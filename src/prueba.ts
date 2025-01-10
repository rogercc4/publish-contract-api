import MicrocksApiService from './service/microcksApiService';
import PublishContractService from './service/publishContractService';
import BlueprintCatalogService from './service/blueprintCatalogService';

(async () => {

    const apiUrlMicrocks = 'https://mockserver.centralus.cloudapp.azure.com/api';
    const apiUrlKeycloak = 'https://mockserver.centralus.cloudapp.azure.com/keycloak/realms/microcks/protocol/openid-connect/token';
    const clientId = 'microcks-serviceaccount';
    const clientSecret = 'ab54d329-e435-41ae-a900-ec6b3fe15c54';

    const apiUrlGetPort = 'https://api.getport.io/v1';
    const clientIdGetPort = 'rogercc4@gmail.com';
    const clientSecretGetPort = 'thdBRzbZ311oz7RlIWlpCkxiAxL0CbwWzAlEzZF21hxnAMEMXe6pohl7LyL3rFOP';

    const microcksService = new MicrocksApiService(apiUrlMicrocks, apiUrlKeycloak, clientId, clientSecret);
    const blueprintCatalogService = new BlueprintCatalogService(apiUrlGetPort, clientIdGetPort, clientSecretGetPort);
    const publishContractService = new PublishContractService('./src/openapi.yaml', microcksService, blueprintCatalogService);

    publishContractService.publishApiMock('rogercc4','https://github.com/rogercc4/contracts-openapi','d38e4ef118265d277560ba3cb127467bdbd5e398');

})();