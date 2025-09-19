import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  activateSubscription,
  cancelSubscription,
  createPlanReqBody,
  createProductReqBody,
  createSubscription,
  suspendSubscription,
  updatePlanReqBody,
  updatePricingReqBody,
  updateSubscriptionReqBody,
} from "../requestBodies/UseCase5.js";
import { approveSubscription } from "../selenium/seleniumFunctions.js";

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

const currentUseCase = "5";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase5Requests = async () => {
  // Use Case 5 : Subscriptions
  console.log("USE CASE 5: Subscriptions");

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

  // Create product
  let product_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      createProductReqBody(Date.now()),
      headers
    );
    product_id = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show product details
  try {
    let res = await axios.get(
      `${baseURL}/v1/catalogs/products/${product_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create billing plan fro this product
  let billing_plan_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/plans`,
      createPlanReqBody(product_id),
      headersWithPreferOption
    );
    billing_plan_id = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Update plan
  try {
    let res = await axios.patch(
      `${baseURL}/v1/billing/plans/${billing_plan_id}`,
      updatePlanReqBody(),
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Deactivate plan
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/plans/${billing_plan_id}/deactivate`,
      {},
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  //Show plan details
  try {
    let res = await axios.get(
      `${baseURL}/v1/billing/plans/${billing_plan_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  //Activate plan
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/plans/${billing_plan_id}/activate`,
      {},
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Update pricing
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/plans/${billing_plan_id}/update-pricing-schemes`,
      updatePricingReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List plans related to the previous product
  try {
    let res = await axios.get(
      `${baseURL}/v1/billing/plans?product_id=${product_id}`,
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create subscription for the previous product following the billing plan
  let subscription_id = "";
  let approveLink = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/subscriptions`,
      createSubscription(billing_plan_id, Date.now()),
      headersWithPreferOption
    );
    subscription_id = res.data.id;
    approveLink = res.data.links.find((link) => link.rel === "approve").href;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);
  (await approveSubscription(approveLink))
    ? console.log(
        `${requestCounter++}. Subscription approved`,
        "\x1b[32m✔\x1b[0m"
      )
    : console.log(
        `${requestCounter++}. Failed to approve subscription`,
        "\x1b[31m✕\x1b[0m"
      );

  // Show subscription details
  try {
    let res = await axios.get(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Update subscription
  try {
    let res = await axios.patch(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}`,
      updateSubscriptionReqBody(),
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Suspend subscription
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}/suspend`,
      suspendSubscription(),
      headersWithPreferOption
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Activate subscription
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}/activate`,
      activateSubscription(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List transactions related to subscription
  try {
    let res = await axios.get(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}/transactions?start_time=2022-01-01T00:00:00.000Z&end_time=2030-01-01T00:00:00.000Z`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // cancel subscription
  try {
    let res = await axios.post(
      `${baseURL}/v1/billing/subscriptions/${subscription_id}/cancel`,
      cancelSubscription(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
