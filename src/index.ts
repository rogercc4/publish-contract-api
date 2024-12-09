import * as fs from "fs";
import * as core from "@actions/core";
import * as github from "@actions/github";
import OpenApiParserService from "./service/openApiParserService";
import BlueprintCatalogService from "./service/blueprintCatalogService";

async function run(): Promise<void> {
  try {

    const repoName = process.env.GITHUB_REPOSITORY;
    const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
    
    const repoUrl = `${serverUrl}/${repoName}`;
    const commitSha = process.env.GITHUB_SHA || "";

    // Obtener el nombre del usuario que hizo el último commit
    const octokit = github.getOctokit(core.getInput("github_token"));
    const { data: commitData } = await octokit.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: commitSha,
    });

    const commitAuthor = commitData.commit.author?.name || "Unknown author";

    // Leer el archivo proporcionado como entrada
    const filePath: string = core.getInput("file");

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      core.setFailed(`File "${filePath}" does not exist.`);
      return;
    }

    const openApiParserService = new OpenApiParserService(filePath);
    openApiParserService.printEndpoints();

    const apiUrl = core.getInput("api_url_getport");
    const clientId = core.getInput("client_id_getport");
    const clientSecret = core.getInput("client_secret_getport");

    const uploader = new BlueprintCatalogService(apiUrl, clientId, clientSecret);

    // Leer el archivo YAML
    const apiMockBlueprintDto = openApiParserService.getApiMockBlueprintDto(commitAuthor, repoUrl, commitSha);
    await uploader.addItem("api_mock", apiMockBlueprintDto);
    core.info(`API Mock uploaded successfully into GetPort: ${apiMockBlueprintDto.properties.name}`);

    openApiParserService.getOperationsMockBlueprintDto(apiMockBlueprintDto.identifier).forEach(async (operationItem) => {
      const result = await uploader.addItem('operation_mock', operationItem);
      core.info(`Operation Mock uploaded successfully into GetPort: ${result}`);
    });

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();