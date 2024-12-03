# Extract OpenAPI Endpoints Action

This GitHub Action extracts and prints all endpoints from an OpenAPI YAML file using TypeScript.

## Inputs

- `file`: Path to the OpenAPI YAML file (default: `openapi.yml`).

## Outputs

- `endpoints`: A JSON string of extracted endpoints.

## Example Usage

```yaml
jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Extract OpenAPI Endpoints Action
        uses: rogercc4/publish-contract-api@v1
        with:
          file: "./path/to/openapi.yml"