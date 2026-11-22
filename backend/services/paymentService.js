
const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER;

function isPaymentConfigured() {
  return Boolean(
    PAYMENT_PROVIDER &&
    process.env.PAYMENT_SECRET
  );
}

async function createPayment({ userId, plan, amount, currency }) {
  if (!userId || !plan || !amount || !currency) {
    throw new Error("Payment information is incomplete");
  }

  if (!isPaymentConfigured()) {
    throw new Error(
      "Payment provider is not configured yet"
    );
  }

  throw new Error(
    "Payment provider integration is not implemented yet"
  );
}

async function verifyPayment() {
  throw new Error(
    "Payment verification is unavailable until a provider is integrated"
  );
}

module.exports = {
  createPayment,
  verifyPayment,
  isPaymentConfigured
};
