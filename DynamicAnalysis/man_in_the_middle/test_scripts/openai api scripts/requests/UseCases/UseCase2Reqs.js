import axios from "axios";
import dotenv from "dotenv";
import {
  createBatchReqBody,
  uploadFileReqBody,
} from "../RequestBodies/UseCase2.js";
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

const currentUseCase = "2";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api_openai_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase2Requests = async () => {
  console.log("USE CASE 2 : Batch of requests");

  const authHeader = `Bearer ${process.env.API_TOKEN}`;
  const headers = {
    headers: {
      Authorization: authHeader,
    },
  };

  // Upload Files
  let FILE_ID = "";
  let filename = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/files`,
      uploadFileReqBody("batch", "./requests/assets/batch.jsonl"),
      headers
    );
    FILE_ID = res.data.id;
    filename = res.data.filename;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List Files
  try {
    let res = await axios.get(`${baseURL}/v1/files?purpose=batch`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve File
  try {
    let res = await axios.get(`${baseURL}/v1/files/${FILE_ID}`, headers);
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

  // Create Batch
  let BATCH_ID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/batches`,
      createBatchReqBody(FILE_ID),
      headers
    );
    BATCH_ID = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve Batch
  try {
    let res = await axios.get(`${baseURL}/v1/batches/${BATCH_ID}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Upload Files
  try {
    let res = await axios.post(
      `${baseURL}/v1/files`,
      uploadFileReqBody("batch", "./requests/assets/batch2.jsonl"),
      headers
    );
    FILE_ID = res.data.id;
    filename = res.data.filename;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Batch
  try {
    let res = await axios.post(
      `${baseURL}/v1/batches`,
      createBatchReqBody(FILE_ID),
      headers
    );
    BATCH_ID = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Retrieve Batch
  try {
    let res = await axios.get(`${baseURL}/v1/batches/${BATCH_ID}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List Batch
  try {
    let res = await axios.get(`${baseURL}/v1/batches?limit=20`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Cancel the second batch
  try {
    let res = await axios.post(
      `${baseURL}/v1/batches/${BATCH_ID}/cancel`,
      {},
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete File
  try {
    let res = await axios.delete(`${baseURL}/v1/files/${FILE_ID}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
