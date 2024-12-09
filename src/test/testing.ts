import BlueprintCatalogService from '../service/blueprintCatalogService';

// Ejemplo de uso
(async () => {
    const apiUrl = 'https://api.getport.io/v1';
    const clientId = 'rogercc4@gmail.com';
    const clientSecret = 'thdBRzbZ311oz7RlIWlpCkxiAxL0CbwWzAlEzZF21hxnAMEMXe6pohl7LyL3rFOP';
    const blueprintId = 'api_mock';
  
    const uploader = new BlueprintCatalogService(apiUrl, clientId, clientSecret);
  
    const item = {
      title: 'API Mock ',
      properties: {
        name: 'API Mock Service',
        type_service: 'REST',
        version: '1.0.0',
        user_update: 'user123',
        date_last_update: '2023-10-01T12:00:00Z',
        contract_openapi: 'openapi: 3.0.0\ninfo:\n  title: API Mock\n  version: 1.0.0',
        url_repo_contract: 'https://example.com/repo/contract',
        commit: 'abc123',
        url_repo_microservice: 'https://example.com/repo/microservice',
      }
    };
  
    try {
      const result = await uploader.addItem(blueprintId, item);
      console.log('Ítem subido exitosamente:', result);
    } catch (error) {
      console.error('Error al subir el ítem:', error);
    }
  })();