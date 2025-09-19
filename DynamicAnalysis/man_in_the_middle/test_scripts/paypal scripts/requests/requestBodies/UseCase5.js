export const createProductReqBody = (date) => {
  return {
    name: "T-shirt",
    type: "PHYSICAL",
    id: `${date}`,
    description: "Cotton XL",
    category: "CLOTHING",
    image_url: `https://example.com/gallary/images/${date}.jpg`,
    home_url: `https://example.com/catalog/${date}.jpg`,
  };
};

export const createPlanReqBody = (product_id) => {
  return {
    product_id: `${product_id}`,
    name: "Fresh Clean Tees Plan",
    description:
      "Each shirt they send out to subscribers is designed with lots of attention to detail",
    status: "ACTIVE",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "TRIAL",
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: {
            value: "1",
            currency_code: "USD",
          },
        },
      },
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 2,
        total_cycles: 12,
        pricing_scheme: {
          fixed_price: {
            value: "44",
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: "10",
        currency_code: "USD",
      },
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 3,
    },
    taxes: {
      percentage: "10",
      inclusive: false,
    },
  };
};

export const updatePlanReqBody = () => {
  return [
    {
      op: "replace",
      path: "/payment_preferences/payment_failure_threshold",
      value: 7,
    },
  ];
};

export const updatePricingReqBody = () => {
  return {
    pricing_schemes: [
      {
        billing_cycle_sequence: 1,
        pricing_scheme: {
          fixed_price: {
            value: "10",
            currency_code: "USD",
          },
          roll_out_strategy: {
            effective_time: "2025-08-01T00:00:00Z",
            process_change_from: "NEXT_PAYMENT",
          },
        },
      },
      {
        billing_cycle_sequence: 2,
        pricing_scheme: {
          fixed_price: {
            value: "50",
            currency_code: "USD",
          },
          roll_out_strategy: {
            effective_time: "2025-08-01T00:00:00Z",
            process_change_from: "NEXT_PAYMENT",
          },
        },
      },
    ],
  };
};

export const createSubscription = (billing_plan_id, date) => {
  return {
    plan_id: `${billing_plan_id}`,
    start_time: `${new Date(date + 24 * 60 * 60 * 1000).toISOString()}`, // the next day
    shipping_amount: {
      currency_code: "USD",
      value: "10.00",
    },
    subscriber: {
      name: {
        given_name: "John",
        surname: "Doe",
      },
      email_address: "sb-oduor30366001@personal.example.com",
      shipping_address: {
        name: {
          full_name: "John Doe",
        },
        address: {
          address_line_1: "2211 N First Street",
          address_line_2: "Building 17",
          admin_area_2: "San Jose",
          admin_area_1: "CA",
          postal_code: "95131",
          country_code: "US",
        },
      },
    },
    application_context: {
      brand_name: "Example Inc",
      locale: "en-US",
      shipping_preference: "SET_PROVIDED_ADDRESS",
      user_action: "SUBSCRIBE_NOW",
      payment_method: {
        payer_selected: "PAYPAL",
        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
      },
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel",
    },
  };
};

export const updateSubscriptionReqBody = () => {
  return [
    {
      op: "replace",
      path: "/plan/payment_preferences/auto_bill_outstanding",
      value: true,
    },
    {
      op: "replace",
      path: "/plan/payment_preferences/payment_failure_threshold",
      value: 1,
    },
    {
      op: "replace",
      path: "/plan/billing_cycles/@sequence==1/total_cycles",
      value: 2,
    },
    {
      op: "replace",
      path: "/plan/billing_cycles/@sequence==2/pricing_scheme/fixed_price",
      value: {
        currency_code: "USD",
        value: "100.00",
      },
    },
  ];
};

export const suspendSubscription = () => {
  return {
    reason: "Item out of stock",
  };
};

export const activateSubscription = () => {
  return {
    reason: "Items are back in stock",
  };
};

export const cancelSubscription = () => {
  return {
    reason: "Item out of stock again",
  };
};
