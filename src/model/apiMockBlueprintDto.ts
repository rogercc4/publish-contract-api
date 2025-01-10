
export class ApiMockBlueprintDto {
  identifier: string;  
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
      identifier: string,
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
      this.identifier = identifier;
      this.title = properties.name + ' | Version:' + properties.version;
      this.properties = properties;
    }
  }