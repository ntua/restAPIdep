import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  acceptClaimReqBody,
  acknowledgeReturnedItem,
  captureAuthorizedPaymentReqBody,
  createOrderReqBody,
  updateOrderReqBody,
} from "../requestBodies/UseCase4.js";
import {
  approveOrder,
  createDispute,
  denyOrAcceptOffer,
} from "../selenium/seleniumFunctions.js";

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

const currentUseCase = "4";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase4Requests = async () => {
  // Use Case 4 : Order - Dispute - Accept Claim
  console.log("USE CASE 4 : Order - Dispute - Accept Claim");

  // generate PayPal access token
  let access_token = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/oauth2/token`,
      generateAccessTokenReqBody(),
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID_SANDBOX2,
          password: process.env.PAYPAL_CLIENT_SECRET_SANDBOX2,
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

  // the buyer approves the order
  (await approveOrder(approveLink))
    ? console.log(`${requestCounter++}. Order approved`, "\x1b[32m✔\x1b[0m")
    : console.log(
        `${requestCounter++}. Failed to approve order`,
        "\x1b[31m✕\x1b[0m"
      );

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

  await sleep(5000);

  // the buyer creates a new dispute
  (await createDispute("42.00"))
    ? console.log(`${requestCounter++}. Dispute submitted`, "\x1b[32m✔\x1b[0m")
    : console.log(
        `${requestCounter++}. Dispute submission failed`,
        "\x1b[31m✕\x1b[0m"
      );

  console.log("\x1b[36mWait for 4 minutes ... \x1b[0m");
  // 4 minutes waiting time for the dispute to be visible
  await sleep(1000 * 4 * 60);

  // show disputes related to the previous transaction
  let dispute_id = "";
  try {
    let res = await axios.get(
      `${baseURL}/v1/customer/disputes?disputed_transaction_id=${captureID}`,
      headers
    );
    dispute_id = res.data.items[0].dispute_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(500);

  // show details about this dispute
  try {
    let res = await axios.get(
      `${baseURL}/v1/customer/disputes/${dispute_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // the seller accepts the buyer's claim
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/accept-claim`,
      acceptClaimReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(40000);

  // accept the refund and return the item
  (await denyOrAcceptOffer(dispute_id, "accept"))
    ? console.log(
        `${requestCounter++}. Refund was accepted and item was returned back`,
        "\x1b[32m✔\x1b[0m"
      )
    : console.log(
        `${requestCounter++}. Failed to accept refund and return item`,
        "\x1b[31m✕\x1b[0m"
      );

  await sleep(20000);

  // the seller acknowledges returned item
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/acknowledge-return-item`,
      acknowledgeReturnedItem(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
