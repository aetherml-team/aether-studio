/**
 * Bilingual copy for the two standing pages outside the landing page: /about
 * and /contact. Same shape as the legal docs so they render through LegalPage,
 * which keeps one text-page layout for the whole site.
 *
 * Facts only, matching the landing copy: six businesses in production, no savings
 * figures we have not measured with a client.
 */

import type { LegalDoc } from "@/content/legal";

const CONTACT = "help@aetherml.com";

export const aboutDoc: Record<"en" | "es", LegalDoc> = {
  en: {
    title: "About Æther",
    metaDescription:
      "Æther is a boutique software studio in Guadalajara, Mexico. We build and run Nexus, the system your team uses to operate your business.",
    updated: "Guadalajara, Jalisco · Mexico",
    intro: [
      "You run the business. We run the rest.",
      "Æther is a boutique software studio in Guadalajara, Jalisco, operated by Luis Roberto Hernández Robles. We build the technology a company depends on and then keep running it, in English and Spanish, for owners in Mexico and across Latin America.",
    ],
    sections: [
      {
        heading: "What we build",
        paragraphs: [
          "Nexus is the system your team uses to run the business. It can include an internal app, a storefront or a client portal. Every Nexus is different because every business works differently.",
          "We build it around the way your team already works, connect the parts and keep it running. The first process is live in six weeks.",
        ],
      },
      {
        heading: "How we work",
        bullets: [
          "We define. We find the problem and write down the plan.",
          "We connect. We build your app and connect it to what you already use.",
          "We automate. We remove repeat work and your team tests it on real cases.",
          "We run it. We check it every day and improve it every month.",
        ],
        paragraphs: [
          "Four stages, each ending with a written result. We take on three new clients a month, which is how we can commit to a date.",
        ],
      },
      {
        heading: "What we have in production",
        paragraphs: [
          "Our work is live in six businesses: a strength and conditioning gym, a wedding film studio, a coffee roastery and its cafés, a maker of diamonds and wedding bands, a mentoring business for wedding videographers, and Æther itself. Some use an internal app, some a storefront, and some both.",
          "We run our own collections, expenses and monthly billing on it too. We used it before selling it.",
          "We publish no savings figures, because we have not measured them with a client yet. We show you what is already built and used every day.",
        ],
      },
      {
        heading: "What we put in writing",
        bullets: [
          "A fixed price in writing after the free audit.",
          "Acceptance criteria signed before the work starts.",
          "An NDA from day one.",
          "If something inside our control misses the agreed date, we finish it at no extra charge.",
          "If you leave, your customers, payments, invoices and history come with you in Excel and reports. The system and the code stay with Æther.",
        ],
      },
    ],
    closing: `Questions, or a process you want looked at: ${CONTACT}.`,
  },
  es: {
    title: "Sobre Æther",
    metaDescription:
      "Æther es un estudio de software en Guadalajara, México. Construimos y operamos Nexus, el sistema con el que tu equipo trabaja cada día.",
    updated: "Guadalajara, Jalisco · México",
    intro: [
      "Tú llevas el negocio. Nosotros llevamos lo demás.",
      "Æther es un estudio de software en Guadalajara, Jalisco, operado por Luis Roberto Hernández Robles. Construimos la tecnología de la que depende una empresa y después la mantenemos funcionando, en español e inglés, para dueños en México y en Latinoamérica.",
    ],
    sections: [
      {
        heading: "Qué construimos",
        paragraphs: [
          "Nexus es el sistema con el que tu equipo opera el negocio. Puede incluir una app interna, una tienda o un portal para clientes. Cada Nexus es distinto porque cada negocio trabaja distinto.",
          "Lo construimos alrededor de la forma en que ya trabaja tu equipo, conectamos las partes y lo mantenemos. El primer proceso queda operando en 6 semanas.",
        ],
      },
      {
        heading: "Cómo trabajamos",
        bullets: [
          "Definimos. Encontramos el problema y escribimos el plan.",
          "Conectamos. Hacemos tu app y la conectamos con lo que ya usas.",
          "Automatizamos. Quitamos el trabajo repetido y tu equipo lo prueba con casos reales.",
          "Lo operamos. Lo revisamos cada día y lo mejoramos cada mes.",
        ],
        paragraphs: [
          "Cuatro etapas, cada una termina con un resultado por escrito. Tomamos tres clientes nuevos al mes; por eso podemos comprometer una fecha.",
        ],
      },
      {
        heading: "Qué tenemos en producción",
        paragraphs: [
          "Nuestro trabajo está en producción en seis negocios: un gimnasio, un estudio de video de bodas, una tostaduría con sus cafés, una joyería, un negocio de mentoría y Æther. Algunos usan una app interna, otros una tienda y otros ambas.",
          "Aquí llevamos también nuestras cobranzas, gastos y facturación mensual. Lo usamos antes de vendértelo.",
          "No publicamos cifras de ahorro porque todavía no las hemos medido con ningún cliente. Te mostramos lo que ya está construido y alguien usa todos los días.",
        ],
      },
      {
        heading: "Qué dejamos por escrito",
        bullets: [
          "Precio fijo por escrito después de la auditoría gratuita.",
          "Criterios de aceptación firmados antes de empezar.",
          "NDA desde el primer día.",
          "Si algo bajo nuestro control no llega a la fecha acordada, lo terminamos sin costo adicional.",
          "Si te vas, tus clientes, pagos, facturas e historial se van contigo en Excel y reportes. El sistema y el código se quedan con Æther.",
        ],
      },
    ],
    closing: `Dudas, o un proceso que quieras que revisemos: ${CONTACT}.`,
  },
};

export const contactDoc: Record<"en" | "es", LegalDoc> = {
  en: {
    title: "Contact Æther",
    metaDescription:
      "Book a free 20-minute audit, message us on WhatsApp, or write to help@aetherml.com. Æther replies within one business day, in English or Spanish.",
    updated: "Guadalajara · We reply within one business day",
    intro: [
      `Three ways to reach us: book a free 20-minute audit below, message us on WhatsApp, or write to ${CONTACT}. English or Spanish, either way.`,
    ],
    sections: [
      {
        heading: "What the free audit is",
        paragraphs: [
          "Twenty minutes. We review one manual process and tell you what is broken and what to fix first.",
          "The call is free. You get the findings in writing, whether or not we work together.",
        ],
      },
      {
        heading: "Useful to have ready",
        bullets: [
          "What your business does, and roughly how many people it takes.",
          "The process you still do by hand, and how often it happens.",
          "The tools it touches: bank, point of sale, calendar, spreadsheets, accounting.",
          "Who on your side would own the project.",
        ],
      },
      {
        heading: "Press, legal and data requests",
        paragraphs: [
          `Same address: ${CONTACT}. Requests under Mexico's data protection law (LFPDPPP), including ARCO rights, are handled as described in the Privacy Notice.`,
        ],
      },
    ],
  },
  es: {
    title: "Contacto",
    metaDescription:
      "Agenda una auditoría gratuita de 20 minutos, escríbenos por WhatsApp o a help@aetherml.com. Respondemos en un día hábil, en español o inglés.",
    updated: "Guadalajara · Respondemos en un día hábil",
    intro: [
      `Tres formas de encontrarnos: agenda abajo la auditoría gratuita de 20 minutos, escríbenos por WhatsApp o manda un correo a ${CONTACT}. En español o en inglés.`,
    ],
    sections: [
      {
        heading: "Qué es la auditoría gratuita",
        paragraphs: [
          "Veinte minutos. Revisamos un proceso manual y te decimos qué falla y qué conviene resolver primero.",
          "La llamada es gratis. Recibes los hallazgos por escrito, trabajemos juntos o no.",
        ],
      },
      {
        heading: "Ten a la mano",
        bullets: [
          "Qué hace tu negocio y cuántas personas lo sostienen.",
          "El proceso que todavía haces a mano, y con qué frecuencia ocurre.",
          "Las herramientas que toca: banco, punto de venta, calendario, hojas de cálculo, contabilidad.",
          "Quién de tu lado sería el responsable del proyecto.",
        ],
      },
      {
        heading: "Prensa, legal y datos personales",
        paragraphs: [
          `La misma dirección: ${CONTACT}. Las solicitudes bajo la LFPDPPP, incluidos los derechos ARCO, se atienden como se describe en el Aviso de Privacidad.`,
        ],
      },
    ],
  },
};
