import * as fs from "fs";
import * as core from "@actions/core";
import * as github from "@actions/github";
import BlueprintCatalogService from "./service/blueprintCatalogService";
import MicrocksApiService from "./service/microcksApiService";
import PublishContractService from "./service/publishContractService";

async function run(): Promise<void> {
  try {

    const repoName = process.env.GITHUB_REPOSITORY;
    const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
    const repoUrl = `${serverUrl}/${repoName}`;
    const commitSha = process.env.GITHUB_SHA || "";

    core.info(`repoUrl: ${repoUrl}`);
    core.info(`commitSha: ${commitSha}`);

    // Obtener el nombre del usuario que hizo el último commit
    const octokit = github.getOctokit(core.getInput("github_token"));
    const { data: commitData } = await octokit.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: commitSha,
    });

    const commitAuthor = commitData.commit.author?.name || "Unknown author";

    core.info(`commitAuthor: ${commitAuthor}`);

    // Leer el archivo proporcionado como entrada
    const filePath: string = core.getInput("file");

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      core.setFailed(`File "${filePath}" does not exist.`);
      return;
    }

    const apiUrlGetPort = core.getInput("api_url_getport");
    const clientIdGetPort = core.getInput("client_id_getport");
    const clientSecretGetPort = core.getInput("client_secret_getport");

    const apiUrlMicrocks = core.getInput("api_url_microcks");
    const apiUrlKeycloak = core.getInput("api_url_keycloack");
    const clientIdMicrocks = core.getInput("client_id_microcks");
    const clientSecretMicrocks = core.getInput("client_secret_microcks");

    const microcksService = new MicrocksApiService(apiUrlMicrocks, apiUrlKeycloak, clientIdMicrocks, clientSecretMicrocks);
    const blueprintCatalogService = new BlueprintCatalogService(apiUrlGetPort, clientIdGetPort, clientSecretGetPort);
    const publishContractService = new PublishContractService(filePath, microcksService, blueprintCatalogService);

    publishContractService.publishApiMock(commitAuthor, repoUrl, commitSha);

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();