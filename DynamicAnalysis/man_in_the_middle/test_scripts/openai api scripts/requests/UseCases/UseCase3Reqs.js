import axios from "axios";
import dotenv from "dotenv";
import {
  chatCompletionReqBody,
  createFineTuningJob,
  messages_fine_tuning,
  uploadFileReqBody,
} from "../RequestBodies/UseCase3.js";

dotenv.config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printInfo(res) {
  console.log(
    `${requestCounter++}. ${res.request.method} ${
      res.config.url
    } - STATUS CODE:`,
    res.status,
    "\x1b[32m✔\x1b[0m"
  );
}

function printErrorInfo(error) {
  console.log(
    `${requestCounter++}. ${error.request.method} ${error.config.url} :`,
    error.response.data.message,
    "\x1b[31m✕\x1b[0m"
  );
}

const currentUseCase = "3";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api_openai_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase3Requests = async () => {
  console.log("USE CASE 3 : Fine tuning");

  const authHeader = `Bearer ${process.env.API_TOKEN}`;
  const headers = {
    headers: {
      Authorization: authHeader,
    },
  };

  // List Models
  try {
    let res = await axios.get(`${baseURL}/v1/models`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  let model = "gpt-3.5-turbo-0125";
  // Retrieve Models
  try {
    let res = await axios.get(`${baseURL}/v1/models/${model}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Upload Training File
  let FILE_ID = "";
  let filename = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/files`,
      uploadFileReqBody("fine-tune", "./requests/assets/training.jsonl"),
      headers
    );
    FILE_ID = res.data.id;
    filename = res.data.filename;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve File Contents
  try {
    let res = await axios.get(
      `${baseURL}/v1/files/${FILE_ID}/content`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Fine Tuning Job
  let JOB_ID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/fine_tuning/jobs`,
      createFineTuningJob(FILE_ID, model),
      headers
    );
    JOB_ID = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(10000);

  // List Fine Tuning Jobs
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs?limit=25`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve Fine Tuning Jobs
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(120000);

  // List Fine Tuning Events
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}/events`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(240000);

  // List Fine Tuning Events
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}/events`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List Fine Tuning Checkpoints
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}/checkpoints`,
      headers
    );
    model = res.data.data[0].fine_tuned_model_checkpoint;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Chat Completions
  try {
    let res = await axios.post(
      `${baseURL}/v1/chat/completions`,
      chatCompletionReqBody(model, messages_fine_tuning),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete Fine Tuned Model
  try {
    let res = await axios.delete(`${baseURL}/v1/models/${model}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Upload Training File
  try {
    let res = await axios.post(
      `${baseURL}/v1/files`,
      uploadFileReqBody("fine-tune", "./requests/assets/training3.jsonl"),
      headers
    );
    FILE_ID = res.data.id;
    filename = res.data.filename;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Fine Tuning Job
  try {
    let res = await axios.post(
      `${baseURL}/v1/fine_tuning/jobs`,
      createFineTuningJob(FILE_ID, "gpt-3.5-turbo-0125"),
      headers
    );
    JOB_ID = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(10000);

  // List Fine Tuning Jobs
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs?limit=30`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve Fine Tuning Jobs
  try {
    let res = await axios.get(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Cancel Fine Tuning Jobs
  try {
    let res = await axios.post(
      `${baseURL}/v1/fine_tuning/jobs/${JOB_ID}/cancel`,
      {},
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
