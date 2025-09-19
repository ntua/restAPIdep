import axios from "axios";
import dotenv from "dotenv";
import {
  chatCompletionReqBody,
  chatCompletionWithFuncReqBody,
  createEmbeddingOfFAQReqBody,
  createImageEditOrVariationReqBody,
  generateImageReqBody,
  messages,
  moderationsReqBody,
} from "../RequestBodies/UseCase1.js";
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

const currentUseCase = "1";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api_openai_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase1Requests = async () => {
  console.log("USE CASE 1 : Prompts");

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

  let model = "gpt-4o-mini";
  // Retrieve Models
  try {
    let res = await axios.get(`${baseURL}/v1/models/${model}`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Chat Completions
  try {
    let res = await axios.post(
      `${baseURL}/v1/chat/completions`,
      chatCompletionReqBody(model, messages),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Chat Completions with Function
  try {
    let res = await axios.post(
      `${baseURL}/v1/chat/completions`,
      chatCompletionWithFuncReqBody(model),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Embeddings of FAQ Answers
  try {
    let res = await axios.post(
      `${baseURL}/v1/embeddings`,
      createEmbeddingOfFAQReqBody(
        "Our store is open from 9 AM to 9 PM from Monday to Saturday, and from 10 AM to 6 PM on Sundays."
      ),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Embeddings of user input
  try {
    let res = await axios.post(
      `${baseURL}/v1/embeddings`,
      createEmbeddingOfFAQReqBody("What are your store hours?"),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Generate Image
  try {
    let res = await axios.post(
      `${baseURL}/v1/images/generations`,
      generateImageReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create Image Edit
  try {
    let res = await axios.post(
      `${baseURL}/v1/images/edits`,
      createImageEditOrVariationReqBody(
        "Make him have a devil face.",
        "2",
        "1024x1024",
        "./requests/assets/image1.png"
      ),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  //Create Image Variation
  try {
    let res = await axios.post(
      `${baseURL}/v1/images/variations`,
      createImageEditOrVariationReqBody(
        null,
        "1",
        "512x512",
        "./requests/assets/image2.png"
      ),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  //Moderations
  try {
    let res = await axios.post(
      `${baseURL}/v1/moderations`,
      moderationsReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
