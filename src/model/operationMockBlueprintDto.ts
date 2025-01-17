import { v4 as uuidv4 } from 'uuid';

export class OperationMockBlueprintDto {
    identifier: string = uuidv4();
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
      this.title = http_method + ' ' + url_endpoint;
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