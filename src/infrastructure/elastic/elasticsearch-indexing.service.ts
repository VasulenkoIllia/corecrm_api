import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ClientResponseDto } from '../../common/dto/client/client-response.dto';

interface ClientSearchResult {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  companyId: number;
  name_suggest: string;
}

@Injectable()
export class ElasticsearchIndexingService {
  private readonly logger = new Logger(ElasticsearchIndexingService.name);

  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async checkIndexExists(index: string): Promise<boolean> {
    try {
      const exists = await this.elasticsearch.indices.exists({ index });
      this.logger.debug(`Index ${index} exists: ${exists.body}`);
      return exists.body;
    } catch (error) {
      this.logger.error(`Failed to check index ${index}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteIndex(index: string): Promise<void> {
    try {
      const exists = await this.checkIndexExists(index);
      if (exists) {
        await this.elasticsearch.indices.delete({ index });
        this.logger.log(`Index ${index} deleted`);
      } else {
        this.logger.debug(`Index ${index} does not exist, no need to delete`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete index ${index}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async indexDocument<T>(
    index: string,
    id: string,
    document: T,
    mapping?: Record<string, any>,
  ): Promise<void> {
    try {
      const indexExists = await this.checkIndexExists(index);
      if (!indexExists && mapping) {
        this.logger.log(`Creating index ${index} with mapping`);
        await this.elasticsearch.indices.create({
          index,
          body: mapping,
        });
      } else if (!indexExists) {
        this.logger.warn(`Index ${index} does not exist and no mapping provided`);
        throw new NotFoundException(`Index ${index} does not exist and no mapping provided`);
      }

      await this.elasticsearch.index({
        index,
        id,
        body: document,
      });
      this.logger.log(`Document indexed in ${index} with id ${id}`);
    } catch (error) {
      this.logger.error(`Failed to index document in ${index} with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateDocument<T>(
    index: string,
    id: string,
    document: T,
  ): Promise<void> {
    try {
      const exists = await this.elasticsearch.exists({ index, id });
      if (!exists.body) {
        this.logger.warn(`Document with id ${id} not found in index ${index}`);
        throw new NotFoundException(`Document ${id} not found in index ${index}`);
      }

      await this.elasticsearch.update({
        index,
        id,
        body: {
          doc: document,
        },
      });
      this.logger.log(`Document updated in ${index} with id ${id}`);
    } catch (error) {
      this.logger.error(`Failed to update document in ${index} with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    try {
      const exists = await this.elasticsearch.exists({ index, id });
      if (!exists.body) {
        this.logger.debug(`Document with id ${id} not found in index ${index}, no need to delete`);
        return;
      }

      await this.elasticsearch.delete({
        index,
        id,
      });
      this.logger.log(`Document deleted from ${index} with id ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete document from ${index} with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchWithSuggestions(
    index: string,
    query: string,
    suggestField: string,
    companyId?: number,
  ): Promise<{ results: ClientResponseDto[]; suggestions: string[] }> {
    try {
      const searchRequest = {
        index,
        body: {
          query: {
            bool: {
              should: [
                {
                  multi_match: {
                    query,
                    fields: ['firstName', 'lastName', 'phone', 'email', `${suggestField}^3`],
                    type: 'best_fields',
                    fuzziness: 'AUTO',
                    minimum_should_match: '50%',
                  },
                },
              ],
              filter: companyId ? [{ term: { companyId: { value: companyId } } }] : [],
            },
          },
          highlight: {
            fields: {
              [suggestField]: {},
            },
          },
        },
      };

      this.logger.debug(`Search request for index ${index}: ${JSON.stringify(searchRequest)}`);
      const result = await this.elasticsearch.search(searchRequest);

      const hits = result.body.hits.hits.map((hit: { _id: string | number; _source: ClientSearchResult }) => ({
        id: parseInt(String(hit._id), 10),
        firstName: hit._source.firstName,
        lastName: hit._source.lastName,
        phone: hit._source.phone,
        email: hit._source.email,
        companyId: hit._source.companyId,
      }));

      const suggestions = result.body.hits.hits
        .map((hit: { _source: ClientSearchResult }) => hit._source[suggestField])
        .filter((value: string, index: number, self: string[]) => value && self.indexOf(value) === index);

      this.logger.log(`Found ${hits.length} results for query "${query}" in index ${index}`);
      return { results: hits.map(client => new ClientResponseDto(client)), suggestions };
    } catch (error) {
      this.logger.error(`Failed to search in ${index} with query "${query}": ${error.message}`, error.stack);
      throw error;
    }
  }
}
