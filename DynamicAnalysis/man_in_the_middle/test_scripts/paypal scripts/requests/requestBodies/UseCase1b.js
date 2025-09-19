export const createOrderReqBody = () => {
  return {
    intent: "AUTHORIZE",
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
