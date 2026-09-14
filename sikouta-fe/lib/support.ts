export const SUPPORT_WHATSAPP = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "").replace(/\D/g, "");
export const SUPPORT_URL = SUPPORT_WHATSAPP ? `https://wa.me/${SUPPORT_WHATSAPP}` : "/bantuan";
