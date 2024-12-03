"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const yaml = __importStar(require("js-yaml"));
async function run() {
    try {
        // Leer el archivo proporcionado como entrada
        const filePath = core.getInput("file");
        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            core.setFailed(`File "${filePath}" does not exist.`);
            return;
        }
        // Cargar el archivo YAML
        const fileContents = fs.readFileSync(filePath, "utf8");
        const openApiDoc = yaml.load(fileContents);
        // Extraer los endpoints
        const paths = openApiDoc.paths || {};
        const endpoints = [];
        for (const [path, methods] of Object.entries(paths)) {
            for (const method of Object.keys(methods)) {
                endpoints.push(`${method.toUpperCase()} ${path}`);
            }
        }
        // Imprimir los endpoints en el log
        core.info("Extracted Endpoints:");
        endpoints.forEach((endpoint) => core.info(endpoint));
        // Establecer los endpoints como una salida
        core.setOutput("endpoints", JSON.stringify(endpoints));
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
run();
