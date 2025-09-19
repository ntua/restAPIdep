import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  cancelSentInvoiceReqBody,
  createDraftInvoiceReqBody,
  createProductReqBody,
  fullyUpdateInvoiceReqBody,
  generateQRCodeReqBody,
  sendInvoiceReminderReqBody,
  sendInvoiceReqBody,
} from "../requestBodies/UseCase2.js";

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

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase2Requests = async () => {
  // Use Case 2 : Create Invoice - Payment - Cancel - Delete
  console.log("USE CASE 2 : Create Invoice - Payment - Cancel - Delete");

  // generate PayPal access token
  let access_token = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/oauth2/token`,
      generateAccessTokenReqBody(),
      {
        // authentication header to generate a PayPal access token
        // we use the client id / client secret related to the sandbox business account
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

  // Create product 1
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now(), 1),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // Create product 2
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now(), 2),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // Create product 3
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now(), 3),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // Create product 4
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now(), 4),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List products
  try {
    let res = await axios.get(
      `${baseURL}/v1/catalogs/products?page_size=1&total_required=true&page=760`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  //Generate invoice number
  let draft_invoice_number = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/generate-next-invoice-number`,
      {},
      headers
    );
    draft_invoice_number = res.data.invoice_number;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
  await sleep(1000);

  // Create draft invoice
  let invoice_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices`,
      createDraftInvoiceReqBody(draft_invoice_number),
      headersWithPreferOption
    );
    invoice_id = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show invoice details
  try {
    let res = await axios.get(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Fully update invoice
  try {
    let res = await axios.put(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}?send_to_recipient=true&send_to_invoicer=true`,
      fullyUpdateInvoiceReqBody(Date.now()),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Generate QR code
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/generate-qr-code`,
      generateQRCodeReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Send invoice
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/send`,
      sendInvoiceReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Send invoice reminder
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/remind`,
      sendInvoiceReminderReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Cancel sent invoice
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/cancel`,
      cancelSentInvoiceReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete invoice
  try {
    let res = await axios.delete(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
