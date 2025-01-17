import { v4 as uuidv4 } from 'uuid';

export class ApiMockBlueprintDto {
  identifier: string = uuidv4();  
  title: string;
  properties: {
    name: string;
    type_service: string;
    version: string;
    user_update?: string;
    date_last_update?: string;
    contract_openapi?: string;
    url_repo_contract?: string;
    commit?: string;
    url_repo_microservice?: string;
  };
  
    constructor(
      properties: {
        name: string;
        type_service: string;
        version: string;
        user_update?: string;
        date_last_update?: string;
        contract_openapi?: string;
        url_repo_contract?: string;
        commit?: string;
        url_repo_microservice?: string;
      }
    ) {
      this.title = properties.name + ' | Version:' + properties.version;
      this.properties = properties;
    }
  }