export const createOrderReqBody = () => {
  return {
    intent: "AUTHORIZE",
    purchase_units: [
      {
        items: [
          {
            name: "T-Shirt",
            description: "Green XL",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: "42.00",
            },
          },
        ],
        amount: {
          currency_code: "USD",
          value: "42.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "42.00",
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
      value: "42",
      currency_code: "USD",
    },
    invoice_id: `${date}`,
    final_capture: true,
    note_to_payer:
      "If the ordered color is not available, we will substitute with a different color free of charge.",
    soft_descriptor: "Bob's Custom Sweaters",
  };
};

export const acceptClaimReqBody = () => {
  return {
    note: "Full refund to the customer.",
    //"accept_claim_reason": "DID_NOT_SHIP_ITEM",
    accept_claim_type: "REFUND_WITH_RETURN",
    return_shipping_address: {
      address_line_1: "Κολοκοτρώνη 1 & Σταδίου",
      admin_area_2: "Αθήνα",
      admin_area_1: "Ελλάδα",
      postal_code: "105 62",
      country_code: "GR",
    },
  };
};

export const acknowledgeReturnedItem = () => {
  return {
    note: "I have received the item back.",
    acknowledgement_type: "ITEM_RECEIVED",
  };
};
