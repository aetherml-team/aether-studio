import i18n from "@/i18n";

/** Copy for the ad landing page (/start) and the thank-you page (/thanks), in both languages. */
const funnel = {
  es: {
    startTitle: "Auditoría gratis de 20 minutos · Æther",
    startDescription: "Agenda una auditoría de 20 minutos o envíanos un mensaje. Respondemos en menos de un día hábil.",
    thanksTitle: "Gracias · Æther",
    thanksBooked: "Tu llamada está agendada.",
    thanksBookedBody: "Te llegó la invitación por correo, con el enlace de la videollamada.",
    thanksMessage: "Recibimos tu mensaje.",
    thanksMessageBody: "Te respondemos en menos de un día hábil, al correo que nos dejaste.",
    thanksNext: "Qué sigue",
    thanksNextBody: "Revisamos tu caso antes de hablar. En la llamada vemos un proceso manual y te enviamos los hallazgos por escrito.",
    thanksHome: "Conoce Æther",
    phoneLabel: "WhatsApp",
    phonePlaceholder: "33 1234 5678",
    needLabel: "¿Qué quieres resolver?",
    needs: {
      payments: "Cobros y pagos",
      sales: "Ventas y clientes",
      inventory: "Inventario y compras",
      accounting: "Contabilidad y facturación",
      other: "Otra cosa",
    },
  },
  en: {
    startTitle: "Free 20-minute audit · Æther",
    startDescription: "Book a 20-minute audit or send us a message. We reply within one business day.",
    thanksTitle: "Thanks · Æther",
    thanksBooked: "Your call is booked.",
    thanksBookedBody: "The invite is in your inbox, with the video call link.",
    thanksMessage: "We got your message.",
    thanksMessageBody: "We reply within one business day, to the email you left.",
    thanksNext: "What happens next",
    thanksNextBody: "We look at your case before we talk. On the call we review one manual process and send you the findings in writing.",
    thanksHome: "See what Æther does",
    phoneLabel: "WhatsApp",
    phonePlaceholder: "+52 33 1234 5678",
    needLabel: "What do you want to fix?",
    needs: {
      payments: "Payments and collections",
      sales: "Sales and clients",
      inventory: "Inventory and purchasing",
      accounting: "Accounting and invoicing",
      other: "Something else",
    },
  },
};

for (const [lng, copy] of Object.entries(funnel)) {
  i18n.addResourceBundle(lng, "translation", { funnel: copy }, true, false);
}
