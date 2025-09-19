import { useCase1Requests } from "./requests/UseCases/UseCase1Reqs.js";
import { useCase2Requests } from "./requests/UseCases/UseCase2Reqs.js";
import { useCase3Requests } from "./requests/UseCases/UseCase3Reqs.js";

export const scripts = {
  "1": async () => {
    await useCase1Requests();
    console.log("");
  },
  "2": async () => {
    await useCase2Requests();
    console.log("");
  },
  "3": async () => {
    await useCase3Requests();
    console.log("");
  }
};
