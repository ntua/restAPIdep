import axios from "axios";
import { generateAccessTokenReqBody } from "../requestBodies/auth.js";
import {
  createDispute,
  approveOrder,
  denyOrAcceptOffer,
  buyerProvidesEvidence,
} from "../selenium/seleniumFunctions.js";
import {
  createOrderReqBody,
  captureAuthorizedPaymentReqBody,
  addTrackingInfoReqBody,
  offerRefundReqBody,
  sendMessageReqBody,
  escalateDisputeToClaimReqBody,
  provideEvidenceReqBody,
  provideSupportingInfoReqBody,
  updateDisputeStatusReqBody,
  settleDisputeBuyer,
  settleDisputeSeller,
} from "../requestBodies/UseCase3.js";
import { updateOrderReqBody } from "../requestBodies/UseCase1.js";

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

const currentUseCase = "3";

const baseURL = `http://localhost:${process.env.MIM_PORT}/proxy/https_api-m_sandbox_paypal_com/${currentUseCase}`;

var requestCounter = 1;

export const useCase3Requests = async () => {
  // Use Case 3 : New Order - Tracking - Dispute - Offers and Messages - Evidence - Settle - Appeal - Evidence - Settle
  console.log(
    "USE CASE 3 : New Order - Tracking - Dispute - Offers and Messages - Evidence - Settle - Appeal - Evidence - Settle"
  );

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
  try {
    let res = await axios.post(
      `${baseURL}/v2/checkout/orders`,
      createOrderReqBody(),
      headersWithPreferOption
    );
    printInfo(res);
    orderID = res.data.id;
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

  // Show order details
  let approveLink = "";
  try {
    let res = await axios.get(
      `${baseURL}/v2/checkout/orders/${orderID}`,
      headers
    );
    approveLink = res.data.links.find((link) => link.rel === "approve").href;
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

  await sleep(5000);

  // the buyer creates a new dispute
  (await createDispute("80.00"))
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

  await sleep(10000);

  // the seller makes offer to resolve the dispute
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/make-offer`,
      offerRefundReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(40000);

  (await denyOrAcceptOffer(dispute_id, "deny"))
    ? console.log(`${requestCounter++}. Offer was rejected`, "\x1b[32m✔\x1b[0m")
    : console.log(
        `${requestCounter++}. Failed to deny offer`,
        "\x1b[31m✕\x1b[0m"
      );

  await sleep(20000);

  // the seller sends a message to the buyer
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/send-message`,
      sendMessageReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(20000);

  // Escalate dispute to claim => a PayPal agent will decide
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/escalate`,
      escalateDisputeToClaimReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  console.log("\x1b[36mWait for 3 minutes ... \x1b[0m");

  // wait ~3 minutes
  await sleep(3 * 60 * 1000);

  // The seller provides evidence
  try {
    let body = provideEvidenceReqBody(trackingNumber);
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/provide-evidence`,
      body,
      {
        headers: {
          ...body.getHeaders(),
          Authorization: authHeader,
        },
      }
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(5000);

  // The seller provides extra supporting information
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/provide-supporting-info`,
      provideSupportingInfoReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  console.log("\x1b[36mWait for about 3 minutes ... \x1b[0m");
  await sleep(150000);

  // The PayPal agent asks buyer to provide evidence
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/require-evidence`,
      updateDisputeStatusReqBody(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  await sleep(30000);

  (await buyerProvidesEvidence(dispute_id))
    ? console.log(
        `${requestCounter++}. Buyer provided evidence`,
        "\x1b[32m✔\x1b[0m"
      )
    : console.log(
        `${requestCounter++}. Failed to deny offer`,
        "\x1b[31m✕\x1b[0m"
      );

  console.log("\x1b[36mWait for about 3 minutes ... \x1b[0m");
  await sleep(150000);

  // The PayPal agent settles the dispute in buyer's favor
  try {
    let res = await axios.post(
      `${baseURL}/v1/customer/disputes/${dispute_id}/adjudicate`,
      settleDisputeBuyer(),
      headers
    );
    printInfo(res);
  } catch (error) {
    printErrorInfo(error);
  }

  // console.log("\x1b[36mWait for 4 minutes ... \x1b[0m");
  // await sleep(4 * 60 * 1000);
  // // The seller provides evidence
  // try {
  //   let body = provideEvidenceReqBody(trackingNumber);
  //   let res = await axios.post(
  //     `${baseURL}/v1/customer/disputes/${dispute_id}/appeal`,
  //     body,
  //     {
  //       headers: {
  //         ...body.getHeaders(),
  //         Authorization: authHeader,
  //       },
  //     }
  //   );
  //   printInfo(res);
  // } catch (error) {
  //   printErrorInfo(error);
  // }
  // console.log("\x1b[36mWait for 1 minute ... \x1b[0m");
  // await sleep(60000);

  // // The PayPal agent settles the dispute in seller's favor
  // try {
  //   let res = await axios.post(
  //     `${baseURL}/v1/customer/disputes/${dispute_id}/adjudicate`,
  //     settleDisputeSeller(),
  //     headers
  //   );
  //   printInfo(res);
  // } catch (error) {
  //   printErrorInfo(error);
  // }
};
