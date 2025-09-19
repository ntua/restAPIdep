import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  captureAuthorizedPaymentReqBody,
  createOrderReqBody,
  createWebhookReqBody,
  resendEventNotificationReqBody,
  simulateWebhookEvent,
  triggerSampleEventReqBody,
  updateWebhookReqBody,
} from "../requestBodies/UseCase7.js";
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

const currentUseCase = "7";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase7Requests = async () => {
  // Use Case 7 : Webhooks
  console.log("USE CASE 7: Webhooks");

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

  // Create webhook
  let webhook_id = "";
  let webhook_url = "";
  try {
    let res = await axios.post(
      `${baseURL}/v1/notifications/webhooks`,
      createWebhookReqBody(),
      headers
    );
    webhook_id = res.data.id;
    webhook_url = res.data.url;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List webhooks
  try {
    let res = await axios.get(`${baseURL}/v1/notifications/webhooks`, headers);
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show webhook details
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks/${webhook_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List events captured by the current webhook
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks/${webhook_id}/event-types`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Create order (i.e. order event)
  let order_id = "";
  let approveLink = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders`,
      createOrderReqBody(),
      headersWithPreferOption
    );
    approveLink = res.data.links.find((link) => link.rel === "approve").href;
    order_id = res.data.id;
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
  let authorization_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders/${order_id}/authorize`,
      {},
      headersWithPreferOption
    );
    authorization_id = res.data.purchase_units[0].payments.authorizations[0].id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Capture authorized payment
  let capture_id = "";
  try {
    let res = await axios.post(
      `${baseURL}/v2/payments/authorizations/${authorization_id}/capture`,
      captureAuthorizedPaymentReqBody(Date.now()),
      headersWithPreferOption
    );
    capture_id = res.data.id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List all the available events that can be captured by a webhook
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks-event-types`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
  console.log("\x1b[36mWait for 4 minutes ... \x1b[0m");
  // 4 minutes waiting time
  await sleep(4 * 60 * 1000);

  // List webhook notifications with event_type=PAYMENT.CAPTURE.COMPLETED
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks-events?event_type=PAYMENT.CAPTURE.COMPLETED`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // List webhook notifications about the previous 'capture payment' event
  let event_id = "";
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks-events?transaction_id=${capture_id}`,
      headers
    );
    if (!res.data.events[0].id)
      console.log(
        `${requestCounter++}. ${error.request.method} ${error.config.url} :`,
        "Failed to find event ID",
        "\x1b[31m✕\x1b[0m"
      );
    else event_id = res.data.events[0].id;
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Show notification about the previous event
  try {
    let res = await axios.get(
      `${baseURL}/v1/notifications/webhooks-events/${event_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Trigger a sample event
  try {
    let res = await axios.post(
      `${baseURL}/v1/catalogs/products`,
      triggerSampleEventReqBody(Date.now()),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Resend event notification
  try {
    let res = await axios.post(
      `${baseURL}/v1/notifications/webhooks-events/${event_id}/resend`,
      resendEventNotificationReqBody(webhook_id),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Simulate webhook event
  try {
    let res = await axios.post(
      `${baseURL}/v1/notifications/simulate-event`,
      simulateWebhookEvent(webhook_id, webhook_url),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  console.log("\x1b[36mWait for 3 minutes ... \x1b[0m");
  await sleep(180000);

  // // List webhook notifications with the previous event_type=CUSTOMER.DISPUTE.CREATED
  // try {
  //   let res = await axios.get(
  //     `${baseURL}/v1/notifications/webhooks-events?event_type=CUSTOMER.DISPUTE.CREATED`,
  //     headers
  //   );
  //   printInfo(res);
  // } catch (error) {
  //   printErrorInfo(error);
  // }

  // await sleep(1000);

  // Update webhook
  try {
    let res = await axios.patch(
      `${baseURL}/v1/notifications/webhooks/${webhook_id}`,
      updateWebhookReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(1000);

  // Delete webhook
  try {
    let res = await axios.delete(
      `${baseURL}/v1/notifications/webhooks/${webhook_id}`,
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }
};
