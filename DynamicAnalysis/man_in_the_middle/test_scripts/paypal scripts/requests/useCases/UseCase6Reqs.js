import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import { createBatchPayout } from "../requestBodies/UseCase6.js";

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

const currentUseCase = "6";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase6Requests = async () => {
  // Use Case 5 : Payouts
  console.log("USE CASE 6: Payouts");

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

  await sleep(1000);

  // Create batch payout
  let payout_batch_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/payments/payouts`,
      createBatchPayout(Date.now()),
      headers
    );
    payout_batch_id = res.data.batch_header.payout_batch_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show payout details
  let payout_item_id = "";
  let unclaimed_payout_item_id = "";
  try {
    let res = await axios.get(
      `${baseURL}/v1/payments/payouts/${payout_batch_id}`,
      headers
    );
    payout_item_id = res.data.items[0].payout_item_id;
    unclaimed_payout_item_id = res.data.items[1].payout_item_id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show payout item details
  try {
    let res = await axios.get(
      `${baseURL}/v1/payments/payouts-item/${payout_item_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(3000);

  // Cancel unclaimed payout items (fot example payouts to users with no active PayPal account)
  try {
    let res = await axios.post(
      `${baseURL}/v1/payments/payouts-item/${unclaimed_payout_item_id}/cancel`,
      {},
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
