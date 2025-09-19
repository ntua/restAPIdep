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

export const updateProductReqBody = () => {
  return [
    {
      op: "replace",
      path: "/description",
      value: "Updated product's description",
    },
  ];
};

export const createOrderReqBody = () => {
  return {
    intent: "AUTHORIZE",
    purchase_units: [
      {
        items: [
          {
            name: "Product 1",
            description: "Updated product's description",
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

export const updateTrackingInfoReqBody = (captureID, trackingNumber) => {
  return {
    transaction_id: `${captureID}`,
    tracking_number: `${trackingNumber}`,
    status: "SHIPPED",
    carrier: "ACS",
    carrier_name_other: "randomCompanyName",
  };
};
