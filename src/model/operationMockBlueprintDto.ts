import { v4 as uuidv4 } from 'uuid';

export class OperationMockBlueprintDto {
    identifier: string;
    title: string;
    properties: {
      http_method: string;
      url_endpoint: string;
      total_mocks?: number;
    };
    relations?: {
        item_api_mock?: string;
    }
  
    constructor(
      http_method: string,
      url_endpoint: string,
      total_mocks: number,
      id_api_mock: string
    ) {
      this.identifier = http_method + ' ' + url_endpoint;
      this.title = this.identifier;
      this.properties = {
        http_method: http_method,
        url_endpoint: url_endpoint,
        total_mocks: total_mocks,
      };
      this.relations = {
        item_api_mock: id_api_mock
        };

    }
}