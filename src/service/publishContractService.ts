import { ApiMockBlueprintDto } from '../model/apiMockBlueprintDto';
import { OperationMockBlueprintDto } from '../model/operationMockBlueprintDto';
import BlueprintCatalogService from './blueprintCatalogService';
import  MicrocksApiService from './microcksApiService';
import * as fs from "fs";
import * as yaml from "js-yaml";

class PublishContractService {

    private readonly fileContents: string;
    private openApiDoc: Record<string, any>;
  
    private microcksApiService: MicrocksApiService;
    private blueprintCatalogService: BlueprintCatalogService;

    constructor(filePath: string,
                microcksApiService: MicrocksApiService,
                blueprintCatalogService: BlueprintCatalogService) {

        this.fileContents = fs.readFileSync(filePath, "utf8");
        this.openApiDoc = yaml.load(this.fileContents) as Record<string, any>;
        this.microcksApiService = microcksApiService;
        this.blueprintCatalogService = blueprintCatalogService;
    }

    printEndpoints(): void {
      const paths = this.openApiDoc.paths;
      if (paths) {
          for (const path in paths) {
              if (paths.hasOwnProperty(path)) {
                  console.log(`Endpoint: ${path}`);
                  const methods = Object.keys(paths[path]);
                  methods.forEach(method => {
                      console.log(`  Method: ${method.toUpperCase()}`);
                  });
              }
          }
      } else {
          console.log('No endpoints found in the OpenAPI document.');
      }
  }

  private getCurrentUtcDate(): string {
    return new Date().toISOString();
  }

  publishApiMock(user_last_commit: string, 
                url_repo_contract: string, 
                last_commit: string, 
                url_repo_microservice?: string): void {

    const name = this.openApiDoc.info.title;
    const version = this.openApiDoc.info.version;

    this.microcksApiService.searchIdServices(name, version)
        .then(async (serviceIds) => {
            if (serviceIds.length === 0) {
                console.log('Service not found in Microcks ...');
                return;
            }

            console.log('Service found in Microcks. Updating it...');
            const idServicio = serviceIds[0];
            await this.blueprintCatalogService.deleteItem("api_mock", idServicio);
            const serviceJson = await this.microcksApiService.getServiceJson(idServicio)
            const properties = {
              name: this.openApiDoc.info.title,
              type_service: serviceJson.service.type,
              version: this.openApiDoc.info.version,
              user_update: user_last_commit,
              date_last_update: this.getCurrentUtcDate(),
              contract_openapi: this.fileContents,
              url_repo_contract: url_repo_contract,
              commit: last_commit,
              url_repo_microservice: url_repo_microservice
          };

          const apiMockBlueprintDto = new ApiMockBlueprintDto(idServicio, properties);
          await this.blueprintCatalogService.addItem("api_mock", apiMockBlueprintDto);
          console.log(`API Mock uploaded successfully into GetPort: ${apiMockBlueprintDto.title}`);
          this.publishOperationMocks(serviceJson);
            
        })
        .catch((error) => {
            console.error('Error searching service in Microcks:', error);
        });
  }

  private publishOperationMocks(serviceJson: any): void {
    const idServicio = serviceJson.service.id
    const operations: OperationMockBlueprintDto[] = [];
    const operationsMicrocks = serviceJson.service.operations

    for (const operationMicrock of operationsMicrocks) {
      const name: string = operationMicrock.name;
      const httpMethod: string = operationMicrock.method;
      const urlEndpoint: string = name.split(" ")[1];
      const countSamples = serviceJson.messagesMap[name].length;

      const operation = new OperationMockBlueprintDto(httpMethod.toUpperCase(), urlEndpoint, countSamples, idServicio );
      operations.push(operation);
    }

    operations.forEach(async (operationItem) => {
      const result = await this.blueprintCatalogService.addItem('operation_mock', operationItem);
      console.log(`Operation Mock uploaded successfully into GetPort: ${operationItem.title}`);
    });

  }

}

export default PublishContractService;