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

export const makeOfferReqBody = () => {
  return {
    note: "Offer refund with return.",
    offer_amount: {
      currency_code: "USD",
      value: "80",
    },
    return_shipping_address: {
      address_line_1: "Κολοκοτρώνη 1 & Σταδίου",
      admin_area_2: "Αθήνα",
      admin_area_1: "Ελλάδα",
      postal_code: "105 62",
      country_code: "GR",
    },
    offer_type: "REFUND_WITH_RETURN",
  };
};

export const acknowledgeReturnedItem = () => {
  return {
    note: "I have received the item back.",
    acknowledgement_type: "ITEM_RECEIVED",
  };
};
