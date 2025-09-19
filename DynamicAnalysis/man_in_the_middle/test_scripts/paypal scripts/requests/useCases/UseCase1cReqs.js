import axios from "axios";
import { approveOrder } from "../selenium/seleniumFunctions.js";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  createProductReqBody,
  createOrderReqBody,
  refundCapturedPaymentReqBody,
} from "../requestBodies/UseCase1c.js";

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

const currentUseCase = "1c";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase1cRequests = async () => {
  // Use Case 1c : Make Order - Pay - Refund
  console.log("USE CASE 1c : Make Order - Pay - Refund");

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

  // Create Product
  let productID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now()),
      headers
    );
    printInfo(res);
    productID = res.data.id;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show product details
  try {
    let res = await axios.get(
      `${baseURL}/v1/catalogs/products/${productID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // Create Order for this product
  let approveLink = "";
  let orderID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders`,
      createOrderReqBody(),
      headersWithPreferOption
    );
    printInfo(res);
    approveLink = res.data.links.find((link) => link.rel === "approve").href;
    orderID = res.data.id;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // the buyer approves the order
  (await approveOrder(approveLink))
    ? console.log(`${requestCounter++}. Order approved`, "\x1b[32m✔\x1b[0m")
    : console.log(
        `${requestCounter++}. Failed to approve order`,
        "\x1b[31m✕\x1b[0m"
      );

  await sleep(1000);

  // Capture payment for order
  let captureID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders/${orderID}/capture`,
      {},
      headersWithPreferOption
    );
    printInfo(res);
    captureID = res.data.purchase_units[0].payments.captures[0].id;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Refund payment
  let refundID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/payments/captures/${captureID}/refund`,
      refundCapturedPaymentReqBody(Date.now()),
      headersWithPreferOption
    );
    printInfo(res);
    refundID = res.data.id;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show refund details
  try {
    let res = await axios.get(
      `${baseURL}/v2/payments/refunds/${refundID}`,
      headers
    );
    printInfo(res);
    refundID = res.data.id;
  } catch (error) {
    printErrorInfo(error);
  }
};
