import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  createDraftInvoiceReqBody,
  generateQRCodeReqBody,
  sendInvoiceReminderReqBody,
  sendInvoiceReqBody,
  recordPaymentForInvoiceReqBody,
  recordRefundForInvoiceReqBody,
} from "../requestBodies/UseCase2b.js";

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

const currentUseCase = "2b";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase2bRequests = async () => {
  // Use Case 2 : Create Invoice for some products - Record Payment - Refund
  console.log(
    "USE CASE 2b : Create Invoice for some products - Record Payment - Refund"
  );

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

  // Record payment for invoice
  let invoice_payment_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/payments`,
      recordPaymentForInvoiceReqBody(),
      headers
    );
    invoice_payment_id = res.data.payment_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete external payment
  try {
    let res = await axios.delete(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/payments/${invoice_payment_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Record payment for invoice
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/payments`,
      recordPaymentForInvoiceReqBody(),
      headers
    );
    invoice_payment_id = res.data.payment_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Record refund for invoice
  let invoice_refund_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/refunds`,
      recordRefundForInvoiceReqBody(),
      headers
    );
    invoice_refund_id = res.data.refund_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete external refund
  try {
    let res = await axios.delete(
      `${baseURL}/v2/invoicing/invoices/${invoice_id}/refunds/${invoice_refund_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
