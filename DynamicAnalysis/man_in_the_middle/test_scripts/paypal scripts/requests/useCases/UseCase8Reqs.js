import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  createInvoiceTemplateReqBody,
  fullyUpdateInvTemplateReqBody,
} from "../requestBodies/UseCase8.js";

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

const currentUseCase = "8";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase8Requests = async () => {
  // Use Case 8 :  Invoice Templates
  console.log("USE CASE 8: Invoice Templates");

  // generate PayPal access token
  let access_token = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/oauth2/token`,
      generateAccessTokenReqBody(),
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID_SANDBOX,
          password: process.env.PAYPAL_CLIENT_SECRET_SANDBOX,
        },

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    printInfo(res);
    access_token = res.data.access_token;
  } catch (error) {
    printErrorInfo(error);
  }

  const authHeader = `Bearer ${access_token}`;
  const headers = {
    headers: {
      Authorization: authHeader,
    },
  };
  const headersWithPreferOption = {
    headers: { Authorization: authHeader, prefer: "return=representation" },
  };

  await sleep(1000);

  // Create invoice template
  let invoice_template_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/templates`,
      createInvoiceTemplateReqBody(Date.now()),
      headersWithPreferOption
    );
    invoice_template_id = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List templates
  try {
    let res = await axios.get(
      `${baseURL}/v2/invoicing/templates?fields=all&page=1&page_size=10`,
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show template details
  try {
    let res = await axios.get(
      `${baseURL}/v2/invoicing/templates/${invoice_template_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Fully update template
  try {
    let res = await axios.put(
      `${baseURL}/v2/invoicing/templates/${invoice_template_id}`,
      fullyUpdateInvTemplateReqBody(Date.now()),
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete template
  try {
    let res = await axios.delete(
      `${baseURL}/v2/invoicing/templates/${invoice_template_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
