export function extractErrorMessage(err, fallback = "Something went wrong. Please try again.") {
    const respData = err?.response?.data;
    if (!respData) return err?.message || fallback;

    // Always log the full response for debugging
    console.log("=== FULL ERROR RESPONSE ===", JSON.stringify(respData, null, 2));

    // Check for "already exists" error
    if (respData?.message && respData.message.includes("already exists")) {
        return "A pricing plan of this type already exists. Please edit the existing plan or choose a different plan type.";
    }

    // data field is often the field-level validation map { fieldName: "error message" }
    if (respData?.data && typeof respData.data === "object") {
        const entries = Object.entries(respData.data);
        if (entries.length > 0) {
            const msgs = entries.map(([field, msg]) => `${field}: ${msg}`);
            return `Validation errors — ${msgs.join(" | ")}`;
        }
    }

    if (typeof respData?.data === "string" && respData.data) {
        return respData.data;
    }

    // errors array or object
    if (respData?.errors) {
        const errs = Array.isArray(respData.errors)
            ? respData.errors.map(e => e.message || e)
            : Object.values(respData.errors).flat();
        if (errs.length) return errs.join(", ");
    }

    return respData?.message || JSON.stringify(respData) || fallback;
}

export function buildPricingPayload({
    title, longDesc, shortDesc, pricingType,
    price, discountPrice, validityType, validity,
    offerStartDate, offerEndDate,
}) {
    const isFree = pricingType === "FREE";
    const isInstallment = pricingType === "INSTALLMENT_PURCHASE";
    const isLimitedTime = pricingType === "LIMITED_TIME_OFFER";

    const actualPrice = isFree ? 0 : Number(price || 0);
    const parsedDiscount = discountPrice ? Number(discountPrice) : 0;
    // discountPrice must never exceed actualPrice; zero it out for FREE or if discount > actual
    const resolvedDiscount = isFree ? 0 : (parsedDiscount > actualPrice ? 0 : parsedDiscount);

    // Backend requires valid ISO date strings for offerStartDate/offerEndDate
    const now = new Date().toISOString();
    const resolvedStartDate = isLimitedTime && offerStartDate
        ? new Date(offerStartDate).toISOString()
        : now;
    const resolvedEndDate = isLimitedTime && offerEndDate
        ? new Date(offerEndDate).toISOString()
        : now;

    const payload = {
        planTitle: title.trim(),
        description: longDesc || "",
        shortDescription: shortDesc || "",
        pricingType,
        actualPrice,
        discountPrice: resolvedDiscount,
        lifetimeAccess: validityType === "lifetime",
        // Backend requires validityInDays > 0 always.
        // For lifetime plans use 36500 (100 years); for validity plans use the entered days
        validityInDays: validityType === "lifetime" ? 36500 : Math.max(1, Number(validity || 1)),
        offerStartDate: resolvedStartDate,
        offerEndDate: resolvedEndDate,
        active: true,
        defaultPlan: false,
    };

    if (isInstallment) {
        payload.installmentMonths = Number(validity || 0);
        payload.amountPerMonth = Number(price || 0);
    }

    console.log("=== PRICING PAYLOAD ===", JSON.stringify(payload, null, 2));
    return payload;
}
