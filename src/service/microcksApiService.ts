import axios from 'axios';

class MicrocksApiService {
    private apiUrlMicrocks: string;
    private apiUrlKeycloak: string;
    private clientId: string;
    private clientSecret: string;

    constructor(apiUrlMicrocks: string, apiUrlKeycloak: string, clientId: string, clientSecret: string) {
        this.apiUrlMicrocks = apiUrlMicrocks;
        this.apiUrlKeycloak = apiUrlKeycloak;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private async getAccessToken(): Promise<string> {
        try {
            const response = await axios.post<{ access_token: string }>(
                `${this.apiUrlKeycloak}`,
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
            const response = await axios.get(`${this.apiUrlMicrocks}/services/${serviceId}`, {
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
            const response = await axios.get(`${this.apiUrlMicrocks}/services/search`, {
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