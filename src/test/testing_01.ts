import OpenApiParserService from "../service/openApiParserService";

const parser = new OpenApiParserService("./src/openapi.yaml");
parser.printEndpoints();

const result = parser.getApiMockBlueprintDto("rogercc4",
    "https://github.com/rogercc4/person-api",
    "0fabca9eed6b58bea8d10b46d7cec48a6385fa6c");
const jsonString = JSON.stringify(result, null, 2);

console.log(jsonString);

parser.getOperationsMockBlueprintDto(result.identifier).forEach(operation => {
    const jsonOperation = JSON.stringify(operation, null, 2);
    console.log(jsonOperation);
});

