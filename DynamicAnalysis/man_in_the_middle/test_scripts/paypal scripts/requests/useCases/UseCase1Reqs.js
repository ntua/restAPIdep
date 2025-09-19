import axios from "axios";
import {
  createProductReqBody,
  updateProductReqBody,
  createOrderReqBody,
  updateOrderReqBody,
  captureAuthorizedPaymentReqBody,
  addTrackingInfoReqBody,
  updateTrackingInfoReqBody,
} from "../requestBodies/UseCase1.js";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import { approveOrder } from "../selenium/seleniumFunctions.js";

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

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase1Requests = async () => {
  // Use Case 1 : Create Product - New Order - Payment - Tracking
  console.log("USE CASE 1 : Create Product - New Order - Payment - Tracking");

  // generate PayPal access token
  let access_token = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/oauth2/token`,
      generateAccessTokenReqBody(),
      {
        // authentication header to generate a PayPal access token
        // handling tracking information requires the initial (default) client id / client secret
        // (owned by a random merchant, not the one associated with the sandbox business account)
        auth: {
          username: process.env.PAYPAL_CLIENT_ID_INITIAL,
          password: process.env.PAYPAL_CLIENT_SECRET_INITIAL,
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

  // Show details about the product
  try {
    let res = await axios.get(
      `${baseURL}/v1/catalogs/products/${productID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Update product
  try {
    let res = await axios.patch(
      `${baseURL}/v1/catalogs/products/${productID}`,
      updateProductReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create order for this product
  let orderID = "";
  let approveLink = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders`,
      createOrderReqBody(),
      headersWithPreferOption
    );
    printInfo(res);
    orderID = res.data.id;
    approveLink = res.data.links.find((link) => link.rel === "approve").href;
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Update order
  try {
    let res = await axios.patch(
      `${baseURL}/v2/checkout/orders/${orderID}`,
      updateOrderReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // show order details
  try {
    let res = await axios.get(
      `${baseURL}/v2/checkout/orders/${orderID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // the buyer approves the order
  (await approveOrder(approveLink))
    ? console.log(`${requestCounter++}. Order approved`, "\x1b[32m✔\x1b[0m")
    : console.log(
        `${requestCounter++}. Failed to approve order`,
        "\x1b[31m✕\x1b[0m"
      );

  await sleep(1000);

  // authorize payment for order
  let authorizationID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders/${orderID}/authorize`,
      {},
      headersWithPreferOption
    );
    authorizationID = res.data.purchase_units[0].payments.authorizations[0].id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // show details for authorized payment
  try {
    let res = await axios.get(
      `${baseURL}/v2/payments/authorizations/${authorizationID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // capture authorized payment
  let captureID = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/payments/authorizations/${authorizationID}/capture`,
      captureAuthorizedPaymentReqBody(Date.now()),
      headersWithPreferOption
    );
    captureID = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // show captured payment details
  try {
    let res = await axios.get(
      `${baseURL}/v2/payments/captures/${captureID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // add tracking information
  let trackingID = "";
  const trackingNumber = Date.now();
  try {
    let res = await axios.post(
      `${baseURL}/v1/shipping/trackers-batch`,
      addTrackingInfoReqBody(captureID, trackingNumber),
      headers
    );
    trackingID =
      res.data.tracker_identifiers[0].transaction_id +
      "-" +
      `${trackingNumber}`;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // show tracking information
  try {
    let res = await axios.get(
      `${baseURL}/v1/shipping/trackers/${trackingID}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // update tracking information (carrier)
  try {
    let res = await axios.put(
      `${baseURL}/v1/shipping/trackers/${trackingID}`,
      updateTrackingInfoReqBody(captureID, trackingNumber),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
