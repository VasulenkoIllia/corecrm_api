import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../app-config/env-variables';

export const elasticsearchModule = ElasticsearchModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvVariables>) => {
    const node = configService.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200');
    if (!node) {
      console.error('ELASTICSEARCH_URL is not defined');
      throw new Error('ELASTICSEARCH_URL is not defined in environment variables');
    }
    const config = {
      node,
      maxRetries: 3,
      requestTimeout: 30000,
      pingTimeout: 3000,
    };
    console.log('Elasticsearch config:', config);
    return config;
  },
});
