import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface ClientSearchResult {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  companyId: number;
}

@Injectable()
export class ElasticsearchIndexingService {
  private readonly logger = new Logger(ElasticsearchIndexingService.name);

  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async checkIndexExists(index: string): Promise<boolean> {
    try {
      const exists = await this.elasticsearch.indices.exists({ index });
      return exists.body;
    } catch (error) {
      this.logger.error(`Failed to check index ${index}: ${error.message}`);
      throw error;
    }
  }

  async deleteIndex(index: string): Promise<void> {
    try {
      await this.elasticsearch.indices.delete({ index });
      this.logger.log(`Index ${index} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete index ${index}: ${error.message}`);
      throw error;
    }
  }

  async indexDocument<T>(
    index: string,
    id: string,
    document: T,
    mapping: Record<string, any>,
  ): Promise<void> {
    try {
      const indexExists = await this.elasticsearch.indices.exists({ index });
      if (!indexExists.body) {
        this.logger.log(`Creating index ${index} with mapping`);
        await this.elasticsearch.indices.create({
          index,
          body: mapping,
        });
      }

      await this.elasticsearch.index({
        index,
        id,
        body: document,
      });
      this.logger.log(`Document indexed in ${index} with id ${id}`);
    } catch (error) {
      this.logger.error(`Failed to index document in ${index}: ${error.message}`);
      throw error;
    }
  }

  async searchWithSuggestions(
    index: string,
    query: string,
    suggestField: string,
    companyId?: number,
  ): Promise<{ results: any[]; suggestions: string[] }> {
    try {
      const searchRequest: any = {
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
                    minimum_should_match: '50%', // Гнучкість для часткових збігів
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

      this.logger.log(`Search request: ${JSON.stringify(searchRequest)}`);
      const result: any = await this.elasticsearch.search<ClientSearchResult>(searchRequest);
      this.logger.log(`Search result: ${JSON.stringify(result.body)}`);

      const hits = result.body.hits.hits.map((hit: any) => hit._source);
      const suggestions = result.body.hits.hits
        .map((hit: any) => hit._source[suggestField])
        .filter((value: string, index: number, self: string[]) => value && self.indexOf(value) === index);

      return { results: hits, suggestions };
    } catch (error) {
      this.logger.error(`Failed to search in ${index}: ${error.message}`);
      throw error;
    }
  }
}
