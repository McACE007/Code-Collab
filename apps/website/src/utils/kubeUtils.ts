"use server"
import yaml from "yaml";
import path from "path";
import fs from 'fs';
import { KubeConfig, AppsV1Api, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

const readAndParseKubeYaml = (filePath: string, roomId: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
    let docString = doc.toString();
    const regex = new RegExp(`service_name`, 'g');
    docString = docString.replace(regex, roomId);
    console.log(docString);
    return yaml.parse(docString);
  });
  return docs;
};

export async function createResources(roomId: string) {
  const namespace = "default";
  const kubeManifests = readAndParseKubeYaml(path.join(process.cwd(), "src/yamls/service.yaml"), roomId);
  // for (const manifest of kubeManifests) {
  //   switch (manifest.kind) {
  //     case "Deployment":
  //       await appsV1Api.createNamespacedDeployment(namespace, manifest);
  //       break;
  //     case "Service":
  //       await coreV1Api.createNamespacedService(namespace, manifest);
  //       break;
  //     case "Ingress":
  //       await networkingV1Api.createNamespacedIngress(namespace, manifest);
  //       break;
  //     default:
  //       console.log(`Unsupported kind: ${manifest.kind}`);
  //   }
  // }
}


