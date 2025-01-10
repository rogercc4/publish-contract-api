import axios from 'axios';

class MicrocksApiService {
    private apiUrlMicrocks: string;
    private realm: string;
    private apiUrlKeycloak: string;
    private clientId: string;
    private clientSecret: string;

    constructor(apiUrlMicrocks: string, realm: string, apiUrlKeycloak: string, clientId: string, clientSecret: string) {
        this.apiUrlMicrocks = apiUrlMicrocks;
        this.realm = realm;
        this.apiUrlKeycloak = apiUrlKeycloak;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private async getAccessToken(): Promise<string> {
        try {
            const response = await axios.post<{ access_token: string }>(
                `${this.apiUrlKeycloak}/realms/${this.realm}/protocol/openid-connect/token`,
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('Error obtaining access token:', error);
            throw new Error('Failed to obtain access token');
        }
    }

    async getServiceJson(serviceId: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.get(`${this.apiUrlMicrocks}/api/services/${serviceId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error obtaining service JSON:', error);
            throw new Error('Failed to obtain service JSON');
        }
    }

    async searchIdServices(name: string, version: string): Promise<string[]> {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.get(`${this.apiUrlMicrocks}/api/services/search`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    name: name,
                    version: version
                }
            });

            const services = response.data;
            if (Array.isArray(services)) {
                return services.map((service: { id: string }) => service.id);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error searching for services:', error);
            throw new Error('Failed to search for services');
        }
    }   

}

export default MicrocksApiService;

// Ejemplo de uso
/** 
(async () => {
    const apiUrlMicrocks = 'https://mockserver.centralus.cloudapp.azure.com';
    const realm = 'microcks';
    const apiUrlKeycloak = 'https://mockserver.centralus.cloudapp.azure.com/keycloak';
    const clientId = 'microcks-serviceaccount';
    const clientSecret = 'ab54d329-e435-41ae-a900-ec6b3fe15c54';

    const microcksService = new MicrocksApiService(apiUrlMicrocks, realm, apiUrlKeycloak, clientId, clientSecret);
    try {
        const serviceIds = await microcksService.searchIdServices('Swagger Petstore - OpenAPI 3.0', '1.0.11');
        console.log('Found Service IDs:', serviceIds);

        const serviceId = serviceIds[0];

        const serviceJson = await microcksService.getServiceJson(serviceId);

        const operationsMicrocks: any[] = serviceJson.service.operations

        for (const operationMicrock of operationsMicrocks) {
            const name: string = operationMicrock.name;
            console.log('Name Service:', name);

            const countSamples = serviceJson.messagesMap[name].length;
            console.log('Samples Service:', countSamples);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
})();
*/
