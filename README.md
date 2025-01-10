# Extract OpenAPI Endpoints

A GitHub Action to extract endpoints from an OpenAPI YAML file and upload into a IDP.

## Inputs

- `file`: Path to the OpenAPI YAML file (default: `openapi.yml`)
- `github_token`: GitHub token for authentication
- `api_url_getport`: API URL for GetPort
- `client_id_getport`: Client ID for GetPort
- `client_secret_getport`: Client Secret for GetPort
- `api_url_microcks`: API URL for Microcks
- `realm_keycloack`: Name of the Realm corresponding to Microcks (default: `microcks`)
- `api_url_keycloack`: API URL for Keycloack
- `client_id_microcks`: Client ID for Microcks
- `client_secret_microcks`: Client Secret for Microcks


## Example Usage

```yaml
name: Extract OpenAPI Endpoints
on: [push]

jobs:
  extract-endpoints:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Extract OpenAPI Endpoints
        uses: ./ # Uses an action in the root directory
        with:
          file: 'path/to/your/openapi.yml'
          github_token: ${{ secrets.GITHUB_TOKEN }}
          api_url_getport: ${{ secrets.API_URL_GETPORT }}
          client_id_getport: ${{ secrets.CLIENT_ID_GETPORT }}
          client_secret_getport: ${{ secrets.CLIENT_SECRET_GETPORT }}
          api_url_microcks: ${{ secrets.API_URL_MICROCKS }}
          realm_keycloack: ${{ secrets.REALM_KEYCLOACK }}
          api_url_keycloack: ${{ secrets.API_URL_KEYCLOACK }}
          client_id_microcks: ${{ secrets.CLIENT_ID_MICROCKS }}
          client_secret_microcks: ${{ secrets.CLIENT_SECRET_MICROCKS }}