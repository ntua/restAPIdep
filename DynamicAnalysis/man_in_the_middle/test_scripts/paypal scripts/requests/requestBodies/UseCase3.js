import FormData from "form-data";
import fs from "fs";
import path from "path";
export const createOrderReqBody = () => {
  return {
    intent: "AUTHORIZE",
    purchase_units: [
      {
        items: [
          {
            name: "My Product 1",
            description: "Product's description 1",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: "80.00",
            },
          },
        ],
        amount: {
          currency_code: "USD",
          value: "80.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "80.00",
            },
          },
        },
      },
    ],
    application_context: {
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel",
    },
  };
};

export const updateOrderReqBody = () => {
  return [
    {
      op: "add",
      path: "/purchase_units/@reference_id=='default'/shipping/address",
      value: {
        address_line_1: "123 Townsend St",
        address_line_2: "Floor 6",
        admin_area_2: "San Francisco",
        admin_area_1: "CA",
        postal_code: "94107",
        country_code: "US",
      },
    },
  ];
};

export const captureAuthorizedPaymentReqBody = (date) => {
  return {
    amount: {
      value: "80",
      currency_code: "USD",
    },
    invoice_id: `${date}`,
    final_capture: true,
    note_to_payer:
      "If the ordered color is not available, we will substitute with a different color free of charge.",
    soft_descriptor: "Bob's Custom Sweaters",
  };
};

export const addTrackingInfoReqBody = (captureID, date) => {
  return {
    trackers: [
      {
        transaction_id: `${captureID}`,
        status: "SHIPPED",
        tracking_number: `${date}`,
        carrier: "FEDEX",
        tracking_number_type: "CARRIER_PROVIDED",
        shipment_date: `${new Date(date).toISOString().slice(0, 10)}`,
        carrier_name_other: "FEDEX Ground",
        notify_buyer: true,
        quantity: 1,
        tracking_number_validated: true,
      },
    ],
  };
};

export const offerRefundReqBody = () => {
  return {
    note: "Offer refund",
    offer_amount: {
      currency_code: "USD",
      value: "50",
    },
    offer_type: "REFUND",
  };
};

export const sendMessageReqBody = () => {
  return {
    message:
      "We are very sorry that we sent you a defective product. We are also very sorry to inform you that we are going to do nothing about this. Oops",
  };
};

export const escalateDisputeToClaimReqBody = () => {
  return {
    note: "Escalating to PayPal claim for resolution.",
  };
};

export const provideEvidenceReqBody = (tracking_number) => {
  const input = {
    evidences: [
      {
        evidence_type: "RECEIPT_OF_MERCHANDISE",
        evidence_info: {
          tracking_info: [
            { carrier_name: "FEDEX", tracking_number: tracking_number },
          ],
        },
        notes: "Test",
      },
    ],
  };
  const form = new FormData();
  const filePath = path.resolve("./requests/selenium/files/evidence1.pdf");
  form.append("input", JSON.stringify(input), {
    contentType: "application/json",
  });
  form.append("evidence-file", fs.createReadStream(filePath));
  return form;
};

export const provideSupportingInfoReqBody = () => {
  return {
    notes: "It is not our fault. The cat ate the product!",
  };
};

export const updateDisputeStatusReqBody = () => {
  return {
    action: "BUYER_EVIDENCE",
  };
};

export const settleDisputeBuyer = () => {
  return {
    adjudication_outcome: "BUYER_FAVOR",
  };
};

export const settleDisputeSeller = () => {
  return {
    adjudication_outcome: "SELLER_FAVOR",
  };
};
