
async function createPayment({
  userId,
  plan,
  amount,
  currency = "RUB"
}) {
  if (!userId || !plan || !amount || Number(amount) <= 0) {
    throw new Error("Payment details are invalid");
  }

  if (!process.env.PAYMENT_PROVIDER || !process.env.PAYMENT_SECRET) {
    throw new Error("Payment provider is not configured");
  }

  throw new Error(
    "Payment provider integration is not implemented yet"
  );
}

async function verifyPayment(paymentId) {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  throw new Error(
    "Payment verification is not implemented yet"
  );
}

module.exports = {
  createPayment,
  verifyPayment
};
