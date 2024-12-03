import * as fs from "fs";
import * as core from "@actions/core";
import * as yaml from "js-yaml";

async function run(): Promise<void> {
  try {
    // Leer el archivo proporcionado como entrada
    const filePath: string = core.getInput("file");

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      core.setFailed(`File "${filePath}" does not exist.`);
      return;
    }

    // Cargar el archivo YAML
    const fileContents = fs.readFileSync(filePath, "utf8");
    const openApiDoc = yaml.load(fileContents) as Record<string, any>;

    // Extraer los endpoints
    const paths = openApiDoc.paths || {};
    const endpoints: string[] = [];

    for (const [path, methods] of Object.entries(paths)) {
      for (const method of Object.keys(methods as Record<string, any>)) {
        endpoints.push(`${method.toUpperCase()} ${path}`);
      }
    }

    // Imprimir los endpoints en el log
    core.info("Extracted Endpoints:");
    endpoints.forEach((endpoint) => core.info(endpoint));

    // Establecer los endpoints como una salida
    core.setOutput("endpoints", JSON.stringify(endpoints));
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();