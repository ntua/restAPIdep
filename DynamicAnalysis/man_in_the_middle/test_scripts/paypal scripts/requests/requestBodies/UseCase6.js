export const createBatchPayout = (date) => {
  return {
    sender_batch_header: {
      sender_batch_id: `Payouts_${date}`,
      email_subject: "You have a payout!",
      email_message:
        "You have received a payout! Thanks for using our service!",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: {
          value: "10.00",
          currency: "USD",
        },
        note: "Thanks for your patronage!",
        sender_item_id: "201403140001",
        receiver: "sb-oduor30366001@personal.example.com",
        notification_language: "en-US",
      },
      {
        recipient_type: "PHONE",
        amount: {
          value: "20.00",
          currency: "USD",
        },
        note: "Thanks for your support!",
        sender_item_id: "201403140002",
        receiver: "1-6976666666",
      },
      {
        recipient_type: "PAYPAL_ID",
        amount: {
          value: "30.00",
          currency: "USD",
        },
        note: "Thanks for your patronage!",
        sender_item_id: "201403140003",
        receiver: "5DEJUG27PZB9J",
      },
    ],
  };
};
