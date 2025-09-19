export const createDraftInvoiceReqBody = (draft_invoice_number) => {
  return {
    detail: {
      invoice_number: `${draft_invoice_number}`,
      invoice_date: "2024-05-22",
      payment_term: {
        term_type: "NET_10",
        due_date: "2024-06-01",
      },
      currency_code: "USD",
      reference: "<The reference data. Includes a post office (PO) number.>",
      note: "<A note to the invoice recipient. Also appears on the invoice notification email.>",
      terms_and_conditions:
        "<The general terms of the invoice. Can include return or cancellation policy and other terms and conditions.>",
      memo: "<A private bookkeeping note for merchant.>",
    },
    invoicer: {
      name: {
        given_name: "David",
        surname: "Larusso",
      },
      address: {
        address_line_1: "123 Townsend St",
        address_line_2: "Floor 6",
        admin_area_2: "San Francisco",
        admin_area_1: "CA",
        postal_code: "94107",
        country_code: "US",
      },
      phones: [
        {
          country_code: "001",
          national_number: "4085551234",
          phone_type: "MOBILE",
        },
      ],
      website: "www.example.com",
      tax_id: "XX-XXXXXXX",
      logo_url: "https://example.com/logo.png",
      additional_notes:
        "<Any additional information. Includes business hours.>",
    },
    primary_recipients: [
      {
        billing_info: {
          name: {
            given_name: "John",
            surname: "Doe",
          },
          address: {
            address_line_1: "1234 Main Street",
            admin_area_2: "Anytown",
            admin_area_1: "CA",
            postal_code: "98765",
            country_code: "US",
          },
          email_address: "sb-oduor30366001@personal.example.com",
          phones: [
            {
              country_code: "001",
              national_number: "3023601272",
              phone_type: "HOME",
            },
          ],
          additional_info_value: "add-info",
        },
        shipping_info: {
          name: {
            given_name: "John",
            surname: "Doe",
          },
          address: {
            address_line_1: "1234 Main Street",
            admin_area_2: "Anytown",
            admin_area_1: "CA",
            postal_code: "98765",
            country_code: "US",
          },
        },
      },
    ],
    items: [
      {
        name: "My Product 2",
        description: "Product's description 2",
        quantity: "1",
        unit_amount: {
          currency_code: "USD",
          value: "120.00",
        },
        tax: {
          name: "Sales Tax",
          percent: "7.25",
        },
        discount: {
          percent: "5",
        },
        unit_of_measure: "QUANTITY",
      },
      {
        name: "My Product 1",
        description: "Product's description 1",
        quantity: "1",
        unit_amount: {
          currency_code: "USD",
          value: "80.00",
        },
        tax: {
          name: "Sales Tax",
          percent: "7.25",
        },
        discount: {
          amount: {
            currency_code: "USD",
            value: "5.00",
          },
        },
        unit_of_measure: "QUANTITY",
      },
    ],
    configuration: {
      partial_payment: {
        allow_partial_payment: true,
        minimum_amount_due: {
          currency_code: "USD",
          value: "20.00",
        },
      },
      allow_tip: true,
      tax_calculated_after_discount: true,
      tax_inclusive: false,
    },
    amount: {
      breakdown: {
        custom: {
          label: "Packing Charges",
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
        shipping: {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
          tax: {
            name: "Sales Tax",
            percent: "7.25",
          },
        },
        discount: {
          invoice_discount: {
            percent: "5",
          },
        },
      },
    },
  };
};

export const generateQRCodeReqBody = () => {
  return {
    width: 500,
    height: 500,
    action: "pay",
  };
};

export const sendInvoiceReqBody = () => {
  return {
    subject:
      "<The subject of the email that is sent as a notification to the recipient.>",
    note: "<A note to the payer.>",
    send_to_recipient: true,
    additional_recipients: [
      "recipient_cc1@example.com",
      "recipient_cc2@example.com",
    ],
    send_to_invoicer: false,
  };
};

export const sendInvoiceReminderReqBody = () => {
  return {
    subject: "Reminder: Payment due for the invoice #ABC-123",
    note: "Please pay before the due date to avoid incurring late payment charges which will be adjusted in the next bill generated.",
    send_to_recipient: true,
    additional_recipients: [
      "recipient_cc1@example.com",
      "recipient_cc2@example.com",
    ],
    send_to_invoicer: false,
  };
};

export const recordPaymentForInvoiceReqBody = () => {
  return {
    method: "CASH",
    payment_date: "2024-04-13",
    amount: {
      currency_code: "USD",
      value: "42.00",
    },
    type: "EXTERNAL",
    transaction_type: "CAPTURE",
    note: "<A note associated with an external cash or check payment.>",
    shipping_info: {
      name: {
        given_name: "John",
        surname: "Doe",
      },
      address: {
        address_line_1: "1234 Main Street",
        admin_area_2: "Anytown",
        admin_area_1: "CA",
        postal_code: "98765",
        country_code: "US",
      },
    },
  };
};

export const recordRefundForInvoiceReqBody = () => {
  return {
    method: "BANK_TRANSFER",
    refund_date: "2024-04-13",
    amount: {
      currency_code: "USD",
      value: "17.00",
    },
  };
};
