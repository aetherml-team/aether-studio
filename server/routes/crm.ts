import { Router } from "express";

const router = Router();

/**
 * POST /api/crm/publish
 *
 * Send a lead, form submission, or event to your CRM of choice.
 * The body shape is yours to define — common: { name, email, phone, source, metadata }.
 *
 * Example adapters to wire:
 *
 *   HubSpot:
 *     POST https://api.hsforms.com/submissions/v3/integration/submit/:portalId/:formId
 *
 *   Salesforce:
 *     Use jsforce or the Salesforce REST API with OAuth credentials from Bun.env.
 *
 *   Webhook (Zapier / Make):
 *     await fetch(Bun.env.CRM_WEBHOOK_URL, { method: "POST", body: JSON.stringify(req.body) });
 */
router.post("/publish", (_req, res) => {
  res.status(501).json({
    error: "not_implemented",
    hint: "Wire a CRM adapter in routes/crm.ts",
  });
});

export default router;
