import axios from 'axios';

class BlueprintCatalogService {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor(apiUrl: string, clientId: string, clientSecret: string) {
    this.apiUrl = apiUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    const credentials = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    };

    const response = await axios.post<{ accessToken: string }>(`${this.apiUrl}/auth/access_token`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.accessToken;
  }

  async addItem(blueprintId: string, item: any): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.apiUrl}/blueprints/${blueprintId}/entities`,
        item,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        console.log('Item agregado exitosamente.');
      } else {
        console.error(`Error al agregar el item: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al agregar el item:', error);
    }
  }
}

export default BlueprintCatalogService;