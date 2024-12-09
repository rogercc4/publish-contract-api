import BlueprintCatalogService from '../service/blueprintCatalogService';
import OpenApiParserService from '../service/openApiParserService';

// Ejemplo de uso
(async () => {
    const apiUrl = 'https://api.getport.io/v1';
    const clientId = 'rogercc4@gmail.com';
    const clientSecret = 'thdBRzbZ311oz7RlIWlpCkxiAxL0CbwWzAlEzZF21hxnAMEMXe6pohl7LyL3rFOP';

    const parser = new OpenApiParserService("./src/openapi.yaml");
  
    const uploader = new BlueprintCatalogService(apiUrl, clientId, clientSecret);

    const apiMockItem = parser.getApiMockBlueprintDto("rogercc4",
                                                      "https://github.com/rogercc4/person-api",
                                                      "0fabca9eed6b58bea8d10b46d7cec48a6385fa6c");
  
    try {
      const result = await uploader.addItem('api_mock', apiMockItem);
      console.log('Ítem subido exitosamente:', result);

      parser.getOperationsMockBlueprintDto(apiMockItem.identifier).forEach(async operationItem => {
        const result = await uploader.addItem('operation_mock', operationItem);
        console.log('Item operation mock subido exitosamente:', result);
      });

      
    } catch (error) {
      console.error('Error al subir el ítem:', error);
    }
  })();