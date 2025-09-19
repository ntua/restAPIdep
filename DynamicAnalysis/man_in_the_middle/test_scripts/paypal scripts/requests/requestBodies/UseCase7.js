export const createWebhookReqBody = () => {
  return {
    url: "https://en51y6nlksvla.x.pipedream.net",
    event_types: [
      {
        name: "*",
      },
    ],
  };
};

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

export const triggerSampleEventReqBody = (date) => {
  return {
    id: `evnt_${date}`,
    name: "Soccer Event",
  };
};

export const resendEventNotificationReqBody = (webhook_id) => {
  return {
    webhook_ids: [`${webhook_id}`],
  };
};

export const simulateWebhookEvent = (webhook_id, webhook_url) => {
  return {
    event_type: "CUSTOMER.DISPUTE.CREATED",
    webhook_id: `${webhook_id}`,
    url: `${webhook_url}`,
    resource_version: "1.0",
  };
};

export const updateWebhookReqBody = () => {
  return [
    {
      op: "replace",
      path: "/event_types",
      value: [
        {
          name: "CUSTOMER.DISPUTE.CREATED",
        },
        {
          name: "CATALOG.PRODUCT.CREATED",
        },
        {
          name: "BILLING.PLAN.PRICING-CHANGE.ACTIVATED",
        },
        {
          name: "PAYMENT.PAYOUTSBATCH.SUCCESS",
        },
        {
          name: "BILLING.PLAN.CREATED",
        },
      ],
    },
  ];
};
