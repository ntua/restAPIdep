export const createOrderReqBody = () => {
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: [
          {
            name: "Product 1",
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

export const createProductReqBody = (date) => {
  return {
    name: "My Product 1",
    type: "PHYSICAL",
    id: `${date}`,
    description: "Product's description 1",
    category: "CLOTHING",
    image_url: `https://example.com/gallary/images/${date}.jpg`,
    home_url: `https://example.com/catalog/${date}.jpg`,
  };
};

export const refundCapturedPaymentReqBody = (date) => {
  return {
    amount: {
      value: "80.00",
      currency_code: "USD",
    },
    invoice_id: `${date}`,
    note_to_payer: "Defective product",
  };
};
