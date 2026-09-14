export type Portal = "customer" | "partner" | "admin" | "all";

const rawPortal = import.meta.env.VITE_PORTAL as string | undefined;

export const PORTAL: Portal =
  rawPortal === "customer" || rawPortal === "partner" || rawPortal === "admin"
    ? rawPortal
    : "all";

export const isCustomer: boolean = PORTAL === "customer";
export const isPartner: boolean = PORTAL === "partner";
export const isAdmin: boolean = PORTAL === "admin";

export const PORTAL_URLS: Record<Exclude<Portal, "all">, string> = {
  customer: import.meta.env.VITE_URL_CUSTOMER || "https://www.intonepal.com",
  partner: import.meta.env.VITE_URL_PARTNER || "https://partner.intonepal.com",
  admin: import.meta.env.VITE_URL_ADMIN || "https://admin.intonepal.com",
};
