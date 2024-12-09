import * as fs from "fs";
import * as yaml from "js-yaml";
import { ApiMockBlueprintDto } from "../model/apiMockBlueprintDto";
import { OperationMockBlueprintDto } from "../model/operationMockBlueprintDto";

class OpenApiParserService {
    private openApiDoc: Record<string, any>;
    private readonly fileContents: string;

    constructor(filePath: string) {
        this.fileContents = fs.readFileSync(filePath, "utf8");
        this.openApiDoc = yaml.load(this.fileContents) as Record<string, any>;
    }

    private getCurrentUtcDate(): string {
        return new Date().toISOString();
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

    getServiceType(): string {
        const paths = this.openApiDoc.paths;
        if (paths) {
            for (const path in paths) {
                if (paths.hasOwnProperty(path)) {
                    const methods = Object.keys(paths[path]);
                    if (methods.some(method => ['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase()))) {
                        return 'REST';
                    }
                }
            }
        }
        return 'Unknown';
    }

    getApiMockBlueprintDto(user_last_commit: string, 
                            url_repo_contract: string, 
                            last_commit: string, 
                            url_repo_microservice?: string): ApiMockBlueprintDto {
        const properties = {
            name: this.openApiDoc.info.title,
            type_service: this.getServiceType(),
            version: this.openApiDoc.info.version,
            user_update: user_last_commit,
            date_last_update: this.getCurrentUtcDate(),
            contract_openapi: this.fileContents,
            url_repo_contract: url_repo_contract,
            commit: last_commit,
            url_repo_microservice: url_repo_microservice
        };

        return new ApiMockBlueprintDto(this.openApiDoc.info.title, properties);
    }


    getOperationsMockBlueprintDto(id_api_mock: string): OperationMockBlueprintDto[] {
        const paths = this.openApiDoc.paths;
        const operations: OperationMockBlueprintDto[] = [];

        for (const path in paths) {
            if (paths.hasOwnProperty(path)) {
                const methods = Object.keys(paths[path]);
                methods.forEach(method => {
                    const operation = new OperationMockBlueprintDto("Operation mock", method.toUpperCase(), path, 0, id_api_mock );
                    operations.push(operation);
                });
            }
        }

        return operations;
    }
}

export default OpenApiParserService;