import axios from "axios";
import { approveOrder } from "../selenium/seleniumFunctions.js";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import { createOrderReqBody } from "../requestBodies/UseCase1b.js";

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

const currentUseCase = "1b";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase1bRequests = async () => {
  // Use Case 1b : New Order - Payment authorization - Void authorized payment
  console.log(
    "USE CASE 1b : New Order - Payment authorization - Void authorized payment"
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

  // Create new Order
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

  // Show order details
  try {
    let res = await axios.get(
      `${baseURL}/v2/checkout/orders/${orderID}`,
      headers
    );
    printInfo(res);
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

  // Authorize payment for order
  let authorizationID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders/${orderID}/authorize`,
      {},
      headersWithPreferOption
    );
    printInfo(res);
    authorizationID = res.data.purchase_units[0].payments.authorizations[0].id;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Void authorized payment
  try {
    let res = await axios.post(
      `${baseURL}/v2/payments/authorizations/${authorizationID}/void`,
      {},
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show details for authorized payment
  try {
    let res = await axios.get(
      `${baseURL}/v2/payments/authorizations/${authorizationID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
