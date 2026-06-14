/**
 * Bilingual legal copy for the Privacy Notice (Aviso de Privacidad) and Terms
 * of Service pages. Kept out of the i18n JSON files because the blocks are long
 * and structured — the LegalPage component renders them by current language.
 *
 * Æther operates as a sole proprietorship in Mexico, so the privacy document is
 * structured as an Aviso de Privacidad under the Ley Federal de Protección de
 * Datos Personales en Posesión de los Particulares (LFPDPPP).
 *
 * PLACEHOLDERS to fill before going live (search for the brackets):
 *   [NOMBRE LEGAL] — your full legal name as the "responsable"
 *   [DOMICILIO]    — your fiscal/legal address (street, city, state, Mexico)
 *   [CIUDAD, ESTADO] — venue for governing law in the Terms
 */

export type LegalSection = {
  heading: string;
  /** Paragraphs of body text. */
  paragraphs?: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  /** Meta description for the page <head>. */
  metaDescription: string;
  /** e.g. "Last updated: June 12, 2026" */
  updated: string;
  /** Short lead paragraph(s) above the numbered sections. */
  intro: string[];
  sections: LegalSection[];
  /** Small print rendered at the very bottom. */
  closing?: string;
};

const LEGAL_NAME = "Luis Roberto Hernández Robles";
const DOMICILE = "Senderos de Monteverde, Guadalajara, Jalisco, México";
const VENUE_EN = "Guadalajara, Jalisco, Mexico";
const VENUE_ES = "Guadalajara, Jalisco, México";
const CONTACT = "help@aetherml.com";

/* ------------------------------------------------------------------ */
/* PRIVACY NOTICE / AVISO DE PRIVACIDAD                                */
/* ------------------------------------------------------------------ */

export const privacyDoc: Record<"en" | "es", LegalDoc> = {
  en: {
    title: "Privacy Notice",
    metaDescription:
      "How Æther collects, uses, and protects your personal data, and how to exercise your ARCO rights under Mexico's data protection law (LFPDPPP).",
    updated: "Last updated: June 12, 2026",
    intro: [
      `This Privacy Notice (Aviso de Privacidad) describes how personal data is collected and used through this website and the services offered under the brand “Æther.” It is issued in accordance with the Mexican Federal Law on the Protection of Personal Data Held by Private Parties (Ley Federal de Protección de Datos Personales en Posesión de los Particulares, “LFPDPPP”) and its regulations.`,
    ],
    sections: [
      {
        heading: "1. Who is responsible for your data",
        paragraphs: [
          `“Æther” is a brand operated by ${LEGAL_NAME} (the “Data Controller” or “responsable”), an independent professional established in Mexico, with address at ${DOMICILE}.`,
          `For any matter relating to this notice or your personal data, you can reach us at ${CONTACT}.`,
        ],
      },
      {
        heading: "2. What personal data we collect",
        paragraphs: [
          `We collect only the data we need to respond to you and to provide our services. Depending on how you interact with us, this may include:`,
        ],
        bullets: [
          "Identification and contact data: name, email address, company or organization, and any details you include in a message or proposal request.",
          "Engagement data: information you share about your workflows, tools, and business needs while we scope or deliver a project.",
          "Billing data: where a project proceeds, the tax and payment details required to invoice you.",
          "Technical data: basic information your browser sends automatically, such as approximate location, device and browser type, and pages visited, used to keep the site working and understand usage.",
        ],
      },
      {
        heading: "3. How we use your data (purposes)",
        paragraphs: [
          `Primary purposes — necessary for the relationship you request:`,
        ],
        bullets: [
          "Respond to your inquiries and communicate with you.",
          "Scope, quote, deliver, and support automation and software projects.",
          "Manage contracting, invoicing, and our legal and tax obligations.",
        ],
      },
      {
        heading: "4. Secondary purposes",
        paragraphs: [
          `Where you do not object, we may also use your contact data for secondary purposes that are not necessary for the service:`,
        ],
        bullets: [
          "Sending occasional updates about our services or relevant content.",
          "Measuring and improving the quality of our website and offering.",
        ],
      },
      {
        heading: "5. Limiting use, and the right to opt out",
        paragraphs: [
          `You may withhold consent for the secondary purposes above at any time by writing to ${CONTACT} with the subject “Limit use of my data.” Refusing the secondary purposes will not affect the services you have requested.`,
        ],
      },
      {
        heading: "6. Your ARCO rights",
        paragraphs: [
          `Under Mexican law you have the right to Access, Rectify, Cancel, or Object to the processing of your personal data (the “ARCO” rights), as well as to revoke any consent you have given.`,
          `To exercise these rights, send a request to ${CONTACT} including: (a) your name and a contact channel for our reply; (b) a clear description of the data and the right you wish to exercise; and (c) any document that helps us locate your data. We will respond within the timeframes set by the LFPDPPP.`,
        ],
      },
      {
        heading: "7. Data transfers",
        paragraphs: [
          `To run our business we rely on trusted third-party service providers — for example website hosting, email, and analytics — which may process data on our behalf, including outside Mexico. We share only what is necessary and require these providers to protect your data.`,
          `We do not sell your personal data. We may disclose data where required by a competent authority or by law, as permitted under Article 37 of the LFPDPPP.`,
        ],
      },
      {
        heading: "8. Cookies and similar technologies",
        paragraphs: [
          `This site may use cookies or local storage to remember preferences (such as language and theme) and to gather anonymous usage statistics. You can disable cookies in your browser settings, though some features may stop working as intended.`,
        ],
      },
      {
        heading: "9. Data security and retention",
        paragraphs: [
          `We apply reasonable administrative, technical, and physical measures to protect your personal data against loss, misuse, or unauthorized access. We keep your data only as long as needed for the purposes above and to meet our legal and tax obligations, after which it is deleted or anonymized.`,
        ],
      },
      {
        heading: "10. Google user data and Limited Use",
        paragraphs: [
          `Some of the automations we build and operate for clients connect to Google Workspace services — such as Gmail, Google Calendar, and Google Drive — through Google APIs. Where we access your Google account data for this purpose, we do so only to provide and run the specific automation you have authorized.`,
          `Æther's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. We do not use Google user data for advertising, we do not sell it, and we do not allow humans to read it except where you give explicit consent, where it is necessary for security purposes or to comply with applicable law, or where the data has been aggregated and anonymized. You can revoke our access at any time from your Google Account's security settings or by writing to us at ${CONTACT}.`,
        ],
      },
      {
        heading: "11. Changes to this notice",
        paragraphs: [
          `We may update this Privacy Notice to reflect changes in our practices or the law. The current version is always published on this page, with the “Last updated” date above. Material changes will be highlighted here.`,
        ],
      },
    ],
    closing: `By providing your personal data through this site or by contacting us, you acknowledge that you have read and understood this Privacy Notice.`,
  },
  es: {
    title: "Aviso de Privacidad",
    metaDescription:
      "Cómo Æther recaba, usa y protege tus datos personales, y cómo ejercer tus derechos ARCO conforme a la Ley Federal de Protección de Datos Personales (LFPDPPP).",
    updated: "Última actualización: 12 de junio de 2026",
    intro: [
      `Este Aviso de Privacidad describe cómo se recaban y utilizan los datos personales a través de este sitio web y de los servicios ofrecidos bajo la marca “Æther”. Se emite conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (“LFPDPPP”) y su normatividad.`,
    ],
    sections: [
      {
        heading: "1. Responsable de tus datos",
        paragraphs: [
          `“Æther” es una marca operada por ${LEGAL_NAME} (el “Responsable”), profesional independiente establecido en México, con domicilio en ${DOMICILE}.`,
          `Para cualquier asunto relacionado con este aviso o con tus datos personales, puedes escribirnos a ${CONTACT}.`,
        ],
      },
      {
        heading: "2. Datos personales que recabamos",
        paragraphs: [
          `Recabamos únicamente los datos necesarios para atenderte y prestar nuestros servicios. Según la forma en que interactúes con nosotros, esto puede incluir:`,
        ],
        bullets: [
          "Datos de identificación y contacto: nombre, correo electrónico, empresa u organización y cualquier dato que incluyas en un mensaje o solicitud de propuesta.",
          "Datos del proyecto: información que compartas sobre tus flujos de trabajo, herramientas y necesidades de negocio durante el alcance o la ejecución de un proyecto.",
          "Datos de facturación: cuando un proyecto avanza, los datos fiscales y de pago necesarios para emitir tu factura.",
          "Datos técnicos: información básica que tu navegador envía de forma automática, como ubicación aproximada, tipo de dispositivo y navegador, y páginas visitadas, usada para mantener el sitio en funcionamiento y entender su uso.",
        ],
      },
      {
        heading: "3. Cómo usamos tus datos (finalidades)",
        paragraphs: [
          `Finalidades primarias — necesarias para la relación que solicitas:`,
        ],
        bullets: [
          "Atender tus consultas y comunicarnos contigo.",
          "Definir el alcance, cotizar, entregar y dar soporte a proyectos de automatización y software.",
          "Gestionar la contratación, la facturación y nuestras obligaciones legales y fiscales.",
        ],
      },
      {
        heading: "4. Finalidades secundarias",
        paragraphs: [
          `Cuando no manifiestes tu oposición, también podremos usar tus datos de contacto para finalidades secundarias que no son necesarias para el servicio:`,
        ],
        bullets: [
          "Enviarte información ocasional sobre nuestros servicios o contenido relevante.",
          "Medir y mejorar la calidad de nuestro sitio web y de nuestra oferta.",
        ],
      },
      {
        heading: "5. Limitación de uso y derecho a oponerte",
        paragraphs: [
          `Puedes negar tu consentimiento para las finalidades secundarias en cualquier momento escribiendo a ${CONTACT} con el asunto “Limitar el uso de mis datos”. Negar las finalidades secundarias no afectará los servicios que hayas solicitado.`,
        ],
      },
      {
        heading: "6. Tus derechos ARCO",
        paragraphs: [
          `Conforme a la ley mexicana, tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales (los “derechos ARCO”), así como a revocar el consentimiento que hayas otorgado.`,
          `Para ejercerlos, envía tu solicitud a ${CONTACT} incluyendo: (a) tu nombre y un medio de contacto para responderte; (b) una descripción clara de los datos y del derecho que deseas ejercer; y (c) cualquier documento que nos ayude a localizar tus datos. Responderemos en los plazos previstos por la LFPDPPP.`,
        ],
      },
      {
        heading: "7. Transferencias de datos",
        paragraphs: [
          `Para operar nos apoyamos en proveedores de servicios de confianza — por ejemplo hospedaje del sitio, correo electrónico y analítica — que pueden tratar datos por nuestra cuenta, incluso fuera de México. Compartimos solo lo necesario y exigimos a estos proveedores proteger tus datos.`,
          `No vendemos tus datos personales. Podremos divulgar datos cuando lo requiera una autoridad competente o la ley, en los supuestos permitidos por el artículo 37 de la LFPDPPP.`,
        ],
      },
      {
        heading: "8. Cookies y tecnologías similares",
        paragraphs: [
          `Este sitio puede usar cookies o almacenamiento local para recordar preferencias (como idioma y tema) y recopilar estadísticas anónimas de uso. Puedes desactivar las cookies en la configuración de tu navegador, aunque algunas funciones podrían dejar de operar correctamente.`,
        ],
      },
      {
        heading: "9. Seguridad y conservación de datos",
        paragraphs: [
          `Aplicamos medidas administrativas, técnicas y físicas razonables para proteger tus datos personales contra pérdida, uso indebido o acceso no autorizado. Conservamos tus datos solo durante el tiempo necesario para las finalidades descritas y para cumplir nuestras obligaciones legales y fiscales, tras lo cual se eliminan o anonimizan.`,
        ],
      },
      {
        heading: "10. Datos de usuario de Google y Uso Limitado",
        paragraphs: [
          `Algunas de las automatizaciones que construimos y operamos para nuestros clientes se conectan a servicios de Google Workspace — como Gmail, Google Calendar y Google Drive — a través de las API de Google. Cuando accedemos a los datos de tu cuenta de Google con este fin, lo hacemos únicamente para proporcionar y ejecutar la automatización específica que has autorizado.`,
          `El uso y la transferencia por parte de Æther de la información recibida de las API de Google se apega a la Política de Datos de Usuario de los Servicios de la API de Google, incluidos los requisitos de Uso Limitado (Limited Use). No usamos los datos de usuario de Google con fines publicitarios, no los vendemos y no permitimos que personas los lean, salvo que otorgues tu consentimiento explícito, cuando sea necesario por motivos de seguridad o para cumplir con la ley aplicable, o cuando los datos hayan sido agregados y anonimizados. Puedes revocar nuestro acceso en cualquier momento desde la configuración de seguridad de tu Cuenta de Google o escribiéndonos a ${CONTACT}.`,
        ],
      },
      {
        heading: "11. Cambios a este aviso",
        paragraphs: [
          `Podemos actualizar este Aviso de Privacidad para reflejar cambios en nuestras prácticas o en la ley. La versión vigente se publica siempre en esta página, con la fecha de “Última actualización” indicada arriba. Los cambios relevantes se destacarán aquí.`,
        ],
      },
    ],
    closing: `Al proporcionar tus datos personales a través de este sitio o al contactarnos, reconoces haber leído y comprendido este Aviso de Privacidad.`,
  },
};

/* ------------------------------------------------------------------ */
/* TERMS OF SERVICE / TÉRMINOS Y CONDICIONES                          */
/* ------------------------------------------------------------------ */

export const termsDoc: Record<"en" | "es", LegalDoc> = {
  en: {
    title: "Terms of Service",
    metaDescription:
      "The terms governing use of the Æther website and our automation and software services, under Mexican law.",
    updated: "Last updated: June 12, 2026",
    intro: [
      `These Terms govern your use of this website and any communication or engagement with the brand “Æther,” operated by ${LEGAL_NAME}, an independent professional established in Mexico. By using this site you agree to these Terms.`,
    ],
    sections: [
      {
        heading: "1. About us and the website",
        paragraphs: [
          `“Æther” provides automation and software services to businesses. This website is informational: it presents our services and lets you get in touch. Nothing on this site is an offer to enter into a binding contract by itself.`,
        ],
      },
      {
        heading: "2. Engagements and quotes",
        paragraphs: [
          `Any project is governed by a separate written agreement, proposal, or statement of work that defines scope, deliverables, timelines, and fees. Information on this site (including examples and descriptions) is for general guidance and does not constitute a fixed quote or a guarantee of any particular outcome.`,
        ],
      },
      {
        heading: "3. Acceptable use",
        paragraphs: [
          `You agree to use this website lawfully and not to: interfere with its operation or security; attempt to access areas or data not intended for you; or use it to transmit unlawful, harmful, or misleading content. We may restrict or suspend access if these Terms are breached.`,
        ],
      },
      {
        heading: "4. Intellectual property",
        paragraphs: [
          `The content of this website — including text, design, logos, and the “Æther” brand — is owned by or licensed to us and is protected by applicable law. You may not copy, reproduce, or reuse it without permission, except as allowed for normal browsing.`,
          `Ownership of deliverables produced during a paid engagement is governed by the relevant project agreement, not by these Terms.`,
        ],
      },
      {
        heading: "5. Third-party tools and links",
        paragraphs: [
          `Our work and this site may reference or integrate with third-party platforms and may link to external sites we do not control. We are not responsible for the content, availability, or practices of those third parties; your use of them is subject to their own terms.`,
        ],
      },
      {
        heading: "6. Confidentiality",
        paragraphs: [
          `Information you share with us when scoping or running a project is treated as confidential and used only to provide the services, except where disclosure is required by law. Detailed confidentiality terms, where needed, are set out in the project agreement.`,
        ],
      },
      {
        heading: "7. Disclaimers",
        paragraphs: [
          `This website and its content are provided “as is,” without warranties of any kind. We make reasonable efforts to keep information accurate and the site available, but we do not guarantee that it will be error-free, secure, or uninterrupted.`,
        ],
      },
      {
        heading: "8. Limitation of liability",
        paragraphs: [
          `To the maximum extent permitted by law, we are not liable for indirect or incidental damages arising from your use of this website. Liability in connection with any paid engagement is governed and limited by the relevant project agreement.`,
        ],
      },
      {
        heading: "9. Changes to these Terms",
        paragraphs: [
          `We may update these Terms from time to time. The current version is always published on this page with the “Last updated” date above. Continued use of the site after changes means you accept the updated Terms.`,
        ],
      },
      {
        heading: "10. Governing law and jurisdiction",
        paragraphs: [
          `These Terms are governed by the laws of Mexico. For any dispute relating to this website or these Terms, the parties submit to the competent courts of ${VENUE_EN}, waiving any other jurisdiction that may apply.`,
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [
          `Questions about these Terms can be sent to ${CONTACT}.`,
        ],
      },
    ],
  },
  es: {
    title: "Términos y Condiciones",
    metaDescription:
      "Los términos que rigen el uso del sitio de Æther y de nuestros servicios de automatización y software, conforme a la ley mexicana.",
    updated: "Última actualización: 12 de junio de 2026",
    intro: [
      `Estos Términos regulan el uso de este sitio web y cualquier comunicación o relación con la marca “Æther”, operada por ${LEGAL_NAME}, profesional independiente establecido en México. Al usar este sitio aceptas estos Términos.`,
    ],
    sections: [
      {
        heading: "1. Sobre nosotros y el sitio web",
        paragraphs: [
          `“Æther” presta servicios de automatización y software a empresas. Este sitio web es informativo: presenta nuestros servicios y te permite ponerte en contacto. Nada en este sitio constituye, por sí mismo, una oferta para celebrar un contrato vinculante.`,
        ],
      },
      {
        heading: "2. Proyectos y cotizaciones",
        paragraphs: [
          `Todo proyecto se rige por un acuerdo escrito, propuesta o documento de alcance independiente que define el alcance, los entregables, los plazos y los honorarios. La información de este sitio (incluyendo ejemplos y descripciones) es de carácter general y no constituye una cotización en firme ni una garantía de un resultado determinado.`,
        ],
      },
      {
        heading: "3. Uso aceptable",
        paragraphs: [
          `Te comprometes a usar este sitio de forma lícita y a no: interferir con su funcionamiento o seguridad; intentar acceder a áreas o datos no destinados a ti; ni usarlo para transmitir contenido ilícito, dañino o engañoso. Podemos restringir o suspender el acceso si se incumplen estos Términos.`,
        ],
      },
      {
        heading: "4. Propiedad intelectual",
        paragraphs: [
          `El contenido de este sitio web — incluyendo textos, diseño, logotipos y la marca “Æther” — es de nuestra propiedad o nos ha sido licenciado y está protegido por la ley aplicable. No puedes copiarlo, reproducirlo ni reutilizarlo sin autorización, salvo lo permitido para la navegación normal.`,
          `La titularidad de los entregables producidos durante un proyecto remunerado se rige por el acuerdo correspondiente, no por estos Términos.`,
        ],
      },
      {
        heading: "5. Herramientas y enlaces de terceros",
        paragraphs: [
          `Nuestro trabajo y este sitio pueden hacer referencia o integrarse con plataformas de terceros y pueden enlazar a sitios externos que no controlamos. No somos responsables del contenido, la disponibilidad o las prácticas de dichos terceros; su uso queda sujeto a sus propios términos.`,
        ],
      },
      {
        heading: "6. Confidencialidad",
        paragraphs: [
          `La información que compartas con nosotros al definir o ejecutar un proyecto se trata como confidencial y se usa únicamente para prestar los servicios, salvo cuando la ley exija su divulgación. Los términos detallados de confidencialidad, cuando se requieran, se establecen en el acuerdo del proyecto.`,
        ],
      },
      {
        heading: "7. Limitación de garantías",
        paragraphs: [
          `Este sitio web y su contenido se proporcionan “tal cual”, sin garantías de ningún tipo. Hacemos esfuerzos razonables por mantener la información precisa y el sitio disponible, pero no garantizamos que esté libre de errores, sea seguro o funcione sin interrupciones.`,
        ],
      },
      {
        heading: "8. Limitación de responsabilidad",
        paragraphs: [
          `En la máxima medida permitida por la ley, no somos responsables por daños indirectos o incidentales derivados del uso de este sitio web. La responsabilidad relacionada con cualquier proyecto remunerado se rige y se limita por el acuerdo correspondiente.`,
        ],
      },
      {
        heading: "9. Cambios a estos Términos",
        paragraphs: [
          `Podemos actualizar estos Términos en cualquier momento. La versión vigente se publica siempre en esta página con la fecha de “Última actualización” indicada arriba. El uso continuo del sitio tras los cambios implica que aceptas los Términos actualizados.`,
        ],
      },
      {
        heading: "10. Ley aplicable y jurisdicción",
        paragraphs: [
          `Estos Términos se rigen por las leyes de México. Para cualquier controversia relacionada con este sitio o con estos Términos, las partes se someten a los tribunales competentes de ${VENUE_ES}, renunciando a cualquier otro fuero que pudiera corresponder.`,
        ],
      },
      {
        heading: "11. Contacto",
        paragraphs: [
          `Cualquier duda sobre estos Términos puede enviarse a ${CONTACT}.`,
        ],
      },
    ],
  },
};
