import { useCase1bRequests } from "./requests/useCases/UseCase1bReqs.js";
import { useCase1cRequests } from "./requests/useCases/UseCase1cReqs.js";
import { useCase1Requests } from "./requests/useCases/UseCase1Reqs.js";
import { useCase2bRequests } from "./requests/useCases/UseCase2bReqs.js";
import { useCase2Requests } from "./requests/useCases/UseCase2Reqs.js";
import { useCase3bRequests } from "./requests/useCases/UseCase3bReqs.js";
import { useCase3Requests } from "./requests/useCases/UseCase3Reqs.js";
import { useCase4Requests } from "./requests/useCases/UseCase4Reqs.js";
import { useCase5Requests } from "./requests/useCases/UseCase5Reqs.js";
import { useCase6Requests } from "./requests/useCases/UseCase6Reqs.js";
import { useCase7Requests } from "./requests/useCases/UseCase7Reqs.js";
import { useCase8Requests } from "./requests/useCases/UseCase8Reqs.js";

export const scripts = {
  "1": async () => {
    await useCase1Requests();
    console.log("");
  },
  "1b": async () => {
    await useCase1bRequests();
    console.log("");
  },
  "1c": async () => {
    await useCase1cRequests();
    console.log("");
  },
  "2": async () => {
    await useCase2Requests();
    console.log("");
  },
  "2b": async () => {
    await useCase2bRequests();
    console.log("");
  },
  "3": async () => {
    await useCase3Requests();
    console.log("");
  },
  "3b": async () => {
    await useCase3bRequests();
    console.log("");
  },
  "4": async () => {
    await useCase4Requests();
    console.log("");
  },
  "5": async () => {
    await useCase5Requests();
    console.log("");
  },
  "6": async () => {
    await useCase6Requests();
    console.log("");
  },
  "7": async () => {
    await useCase7Requests();
    console.log("");
  },
  "8": async () => {
    await useCase8Requests();
    console.log("");
  },
};
