/** What a visitor can say they want solved. The CRM stores the English label, the site shows its own. */
export const NEEDS = ["payments", "sales", "inventory", "accounting", "other"] as const;
export type Need = (typeof NEEDS)[number];

export const NEED_LABEL: Record<Need, string> = {
  payments: "Payments and collections",
  sales: "Sales and clients",
  inventory: "Inventory and purchasing",
  accounting: "Accounting and invoicing",
  other: "Something else",
};
