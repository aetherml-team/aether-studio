/**
 * Markdown twins of the public routes, served by middleware.ts when a client
 * asks for `Accept: text/markdown` (acceptmarkdown.com). AI agents get the page
 * as text instead of an empty SPA shell; browsers keep getting the real app.
 *
 * Keep these in sync with the pages by hand — they are short on purpose. Facts
 * only: no savings figures we have not measured with a client.
 */

const SITE = "https://www.aetherml.com";

const FOOTER = `
---

Contact: help@aetherml.com · WhatsApp and booking at ${SITE}/contact
More for agents: ${SITE}/llms.txt · Sitemap: ${SITE}/sitemap.xml
`;

const home = `# Æther — A system that works the way you do.

Æther is a boutique software studio in Guadalajara, Jalisco, Mexico. We build
and run Nexus: the system that a team uses to operate its business. It can
include an internal app, a storefront or a client portal. Every Nexus is
different, carries the client's brand and is maintained by Æther.

## What Nexus does

One screen shows what sold, what got paid and who still owes. Bank, point of
sale, calendar and WhatsApp feed it, so nobody types the same thing twice. A
payment finds its invoice. A renewal warns you before it ends. The Monday
summary says what needs a decision.

## What you get in the first phase

- Written findings: what is broken and what to fix first.
- A written plan: what we build, when it is done, how we test it.
- Your app, under your brand, connected to the tools you already use.
- The repetitive work automated, your team trained on real cases.
- We keep it running: backups, daily checks, monthly improvements.

## What we have built

Our work is live in six businesses: a strength and conditioning gym in Zapopan,
a wedding film studio, a coffee roastery and its cafés, a diamond and wedding
band maker, a mentoring business for wedding videographers, and Æther itself.
Some use an internal app, some a storefront, and some both.

We publish no savings figures, because we have not measured them with a client
yet. We show you what is already built and used every day.

## Who it is for

Owners of small and mid-sized businesses with a team, customers and monthly
collections, where a process still lives in a spreadsheet, a chat thread or
one person's head. Mostly Guadalajara and Latin America, bilingual English and
Spanish. Not a fit for the cheapest quote, a pretty app with nothing behind it,
or a promise of more sales.

## How to start

A free 20-minute audit. We review one manual process and send you the findings
in writing. Book at ${SITE}/contact or write to help@aetherml.com.

## Price

You pay once for the build and monthly for operations. The price is fixed in
writing after the audit. If something in our control misses the agreed date,
we finish it at no extra charge.
${FOOTER}`;

const about = `# About Æther

Æther is a boutique software studio based in Guadalajara, Jalisco, Mexico,
operated by Luis Roberto Hernández Robles. We work with business owners in
Mexico and Latin America, in English and Spanish.

## What we believe

You run the business. We run the rest. We build the technology a company
depends on and then keep running it: AI agents, custom software, automation,
system integrations, security, and the digital presence around them. Ongoing,
not one-and-done.

## How we work

1. We define. We find the problem and write down the plan.
2. We connect. We build your app and connect it to what you already use.
3. We automate. We remove repeat work and your team tests it on real cases.
4. We run it. We check it every day and improve it every month.

Every stage ends with a written result. We take on three new clients a month,
which is how we can commit to a date.

## Proof

Our work is live in six businesses across five trades. Some use an internal
app, some a storefront, and some both. We run our own collections, expenses
and monthly billing on Nexus too.

## Terms we put in writing

A fixed price after the audit. Acceptance criteria signed before work starts.
An NDA from day one. If something in our control misses the date, we keep
working at no extra charge. If you leave, your customers, payments, invoices
and history come with you in Excel and reports; the system and code stay with
Æther.
${FOOTER}`;

const contact = `# Contact Æther

Æther · Guadalajara, Jalisco, Mexico. We reply within one business day, in
English or Spanish.

## Ways to reach us

- Email: help@aetherml.com
- WhatsApp: the button at ${SITE} opens a chat with us.
- Book a free 20-minute audit: ${SITE}/#contact

## What the free audit is

Twenty minutes. We review one manual process, tell you what is broken and what
to fix first, then send the findings in writing. The call is free whether or
not we work together.

## Before you write

Useful to have ready: what your business does, the process you still do by
hand, which tools it touches (bank, point of sale, calendar, spreadsheets), and
who on your side would own the project.

## For press, legal or data requests

Same address: help@aetherml.com. Data requests under Mexico's LFPDPPP (ARCO
rights) are handled as described in the Privacy Notice at ${SITE}/privacy.
${FOOTER}`;

const privacy = `# Privacy Notice — Æther

The full Privacy Notice (Aviso de Privacidad) is published at ${SITE}/privacy in
English and Spanish.

Æther is a brand operated by Luis Roberto Hernández Robles, an independent
professional established in Guadalajara, Jalisco, Mexico. The notice is issued
under Mexico's Ley Federal de Protección de Datos Personales en Posesión de los
Particulares (LFPDPPP).

We collect only the data needed to reply to you and deliver the work: name and
contact details, what you tell us about your workflows, billing details if a
project proceeds, and basic technical data your browser sends. To exercise your
ARCO rights (access, rectification, cancellation, opposition), or to limit the
use of your data, write to help@aetherml.com.
${FOOTER}`;

const terms = `# Terms of Service — Æther

The full Terms of Service are published at ${SITE}/terms in English and Spanish.

This site is informational: it presents what Æther does and lets you get in
touch. Nothing on it is, by itself, an offer to enter a binding contract. Work
is governed by the written proposal and acceptance criteria signed before it
starts. Governing law and venue: Guadalajara, Jalisco, Mexico.

Questions about the Terms: help@aetherml.com.
${FOOTER}`;

/** Path (no trailing slash, "/" for home) → Markdown body. */
export const MARKDOWN_PAGES: Record<string, string> = {
  "/": home,
  "/about": about,
  "/contact": contact,
  "/privacy": privacy,
  "/terms": terms,
};

export const NOT_FOUND_MARKDOWN = `# 404 — Page not found

This path does not exist on ${SITE}. Nothing was moved; the URL is simply not
one we publish.

Where to go instead:

- Home: ${SITE}/
- What Æther does and when to call us: ${SITE}/llms.txt
- Every public page: ${SITE}/sitemap.xml
- About: ${SITE}/about · Contact: ${SITE}/contact
- Privacy Notice: ${SITE}/privacy · Terms: ${SITE}/terms

Questions a page cannot answer: help@aetherml.com.
`;
