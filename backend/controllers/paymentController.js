const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const Plan = require("../models/Plan");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");

// Helper to authenticate with Paymob
const getPaymobAuthToken = async () => {
  const apiKey = process.env.PAYMOB_API_KEY;
  if (!apiKey || apiKey === "your_paymob_api_key_here") {
    return null;
  }

  try {
    const res = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const data = await res.json();
    return data.token || null;
  } catch (err) {
    console.error("Paymob Auth Error:", err);
    return null;
  }
};

// Helper to register Paymob Order
const registerPaymobOrder = async (authToken, totalEgp) => {
  try {
    const res = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: Math.round(totalEgp * 100).toString(),
        currency: "EGP",
        items: [],
      }),
    });
    const data = await res.json();
    return data.id || null;
  } catch (err) {
    console.error("Paymob Order Registration Error:", err);
    return null;
  }
};

// Helper to request acceptance payment key
const getPaymentKey = async (authToken, orderId, totalEgp, integrationId, user) => {
  try {
    const res = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(totalEgp * 100).toString(),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: user.email || "test@punto.com",
          floor: "NA",
          first_name: user.name?.split(" ")[0] || "User",
          street: "NA",
          building: "NA",
          phone_number: user.phone || "+201023002455",
          shipping_method: "PKG",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: user.name?.split(" ")[1] || "Workspace",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: integrationId,
        lock_order_merchant: true,
      }),
    });
    const data = await res.json();
    return data.token || null;
  } catch (err) {
    console.error("Paymob Acceptance Key Error:", err);
    return null;
  }
};

exports.checkout = catchAsync(async (req, res, next) => {
  const { features, paymentMethod, walletNumber } = req.body;

  if (!features || features.length === 0) {
    return next(new AppError("Please select at least one feature for the plan.", 400));
  }

  // Find corresponding plan price
  const sortedFeatures = [...features].sort();
  const plan = await Plan.findOne({
    features: { $size: sortedFeatures.length, $all: sortedFeatures }
  });
  const amountUsd = plan ? plan.value : features.length * 15;
  // Hardcoded to 5 EGP for testing with real wallets as requested
  const totalEgp = 5;

  const expireDate = new Date();
  expireDate.setMonth(expireDate.getMonth() + 1);

  // Check if Paymob credentials are set up
  const authToken = await getPaymobAuthToken();

  if (!authToken) {
    // ────────── MOCK SIMULATION MODE ──────────
    const payment = await Payment.create({
      user_id: req.user.id,
      features,
      amount: amountUsd,
      paymentMethod,
      status: "paid", // Simulate auto-paid on mock checkout
      expireDate,
    });

    // Update user features directly in mock
    await User.findByIdAndUpdate(req.user.id, { features });

    const frontendOrigin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : "http://localhost:5173");
    const redirectUrl = `${frontendOrigin}/setup?payment_status=success&payment_id=${payment._id}&simulated=true`;
    return res.status(200).json({
      status: "success",
      data: { redirectUrl, paymentId: payment._id },
    });
  }

  // ────────── REAL PAYMOB INTEGRATION ──────────
  // 1. Register Paymob Order
  const orderId = await registerPaymobOrder(authToken, totalEgp);
  if (!orderId) {
    return next(new AppError("Failed to register order on Paymob.", 500));
  }

  // Create payment record in DB
  const payment = await Payment.create({
    user_id: req.user.id,
    features,
    amount: amountUsd,
    paymentMethod,
    status: "pending",
    paymobOrderId: orderId.toString(),
    expireDate,
  });

  // Determine Integration ID
  const integrationId =
    paymentMethod === "vodafone_cash"
      ? process.env.PAYMOB_WALLET_INTEGRATION_ID
      : process.env.PAYMOB_CARD_INTEGRATION_ID;

  if (!integrationId || integrationId === "your_wallet_integration_id_here" || integrationId === "your_card_integration_id_here") {
    return next(new AppError("Paymob integration ID is not configured in config.env.", 500));
  }

  // 2. Request Payment Key Token
  const paymentKey = await getPaymentKey(authToken, orderId, totalEgp, integrationId, req.user);
  if (!paymentKey) {
    return next(new AppError("Failed to fetch acceptance payment key.", 500));
  }

  let redirectUrl = "";

  if (paymentMethod === "vodafone_cash") {
    // 3. Initiate wallet payment session
    try {
      const payRes = await fetch("https://accept.paymob.com/api/acceptance/payments/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: {
            identifier: walletNumber || req.user.phone || "01012345678",
            subtype: "WALLET",
          },
          payment_token: paymentKey,
        }),
      });
      const payData = await payRes.json();
      redirectUrl = payData.redirect_url || payData.pending_url;
      if (!redirectUrl) {
        return next(new AppError("Paymob wallet redirection URL not returned.", 500));
      }
    } catch (err) {
      return next(new AppError("Error initiating wallet payment session on Paymob.", 500));
    }
  } else {
    // 3. Hosted iframe redirection for Cards
    const iframeId = process.env.PAYMOB_IFRAME_ID;
    if (!iframeId || iframeId === "your_iframe_id_here") {
      return next(new AppError("Paymob card iframe ID is not configured.", 500));
    }
    redirectUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
  }

  res.status(200).json({
    status: "success",
    data: {
      redirectUrl,
      paymentId: payment._id,
    },
  });
});

// Verify transaction status
exports.verifyStatus = catchAsync(async (req, res, next) => {
  const { paymentId } = req.body;
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return next(new AppError("No payment record found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      status: payment.status, // "paid" or "pending"
    },
  });
});

// Webhook for Paymob callback events
exports.webhook = catchAsync(async (req, res, next) => {
  const queryHmac = req.query.hmac;
  const secret = process.env.PAYMOB_HMAC_SECRET;
  const { obj, type } = req.body || {};

  if (type !== "TRANSACTION" || !obj) {
    return res.status(200).json({ message: "Ignored event" });
  }

  // Validate HMAC signature (skip if HMAC secret is default placeholder for easier setup)
  if (secret && secret !== "your_hmac_secret_here" && queryHmac) {
    const dataString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_voided,
      obj.order?.id || obj.order,
      obj.owner,
      obj.pending,
      obj.source_data?.pan || "",
      obj.source_data?.sub_type || "",
      obj.source_data?.type || "",
      obj.success,
    ].join("");

    const calculatedHmac = crypto
      .createHmac("sha512", secret)
      .update(dataString)
      .digest("hex");

    if (calculatedHmac !== queryHmac) {
      console.warn("Paymob HMAC verification failed!");
      return res.status(400).json({ message: "HMAC signature mismatch" });
    }
  }

  // Update payment status upon success
  if (obj.success === true) {
    const paymobOrderId = obj.order?.id || obj.order;
    const payment = await Payment.findOne({ paymobOrderId: paymobOrderId.toString() });

    if (payment) {
      payment.status = "paid";
      payment.paymobTxnId = obj.id.toString();
      await payment.save();

      // Update user features
      await User.findByIdAndUpdate(payment.user_id, {
        features: payment.features,
      });
      console.log(`Payment successful for order ${paymobOrderId}. Features activated.`);
    }
  }

  res.status(200).json({ status: "success" });
});

exports.myFeatures = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: {
      features: user.features || [],
    },
  });
});