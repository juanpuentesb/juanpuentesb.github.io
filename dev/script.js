(function () {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const languageButtons = document.querySelectorAll("[data-language]");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeStorageKey = "juan-puentes-theme";
  const languageStorageKey = "juan-puentes-language";
  const contactMessage = document.querySelector("[data-contact-message]");
  const copyMessageButton = document.querySelector("[data-copy-message]");
  const copyStatus = document.querySelector("[data-copy-status]");
  const contactOrigin = document.querySelector("[data-contact-origin]");
  const contactLocation = document.querySelector("[data-contact-location]");
  const contactTimeZone = document.querySelector("[data-contact-timezone]");
  const contactRouteStep = document.querySelector("[data-contact-route-step]");
  const contactRouteName = document.querySelector("[data-contact-route-name]");
  const contactRouteDescription = document.querySelector("[data-contact-route-description]");
  const contactAction = document.querySelector("[data-contact-action]");
  const contactPrevious = document.querySelector("[data-contact-previous]");
  const contactNext = document.querySelector("[data-contact-next]");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

  const translations = {
    en: {
      pageTitle: "Juan Puentes | Long-Term Investor",
      themeLabel: "Theme",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme",
      skipLink: "Skip to content",
      brandRole: "eToro Popular Investor",
      navPersona: "About me",
      navBook: "My book",
      navStrategy: "Strategy",
      navConnect: "Connect",
      navStartEtoro: "Start on eToro",
      heroEyebrow: "My investor profile",
      heroTitle: "Long-term investing, built with discipline.",
      heroLede:
        "I'm Juan Puentes Botero, a Colombian investor living in Australia. I share a practical investing journey centered on stability, innovation, DCA, ETF foundations, and smart risk control.",
      connectWithMe: "Connect with me",
      followInstagram: "Follow on Instagram",
      followTiktok: "Follow on TikTok",
      verifiedProfile: "Verified profile",
      popularInvestor: "Popular Investor",
      profileStartInvesting: "Invest with me",
      profileRiskDisclaimer:
        "Copy Trading does not amount to investment advice. The value of your investments may go up or down. Your capital is at risk.",
      profileRiskLearnMore: "Learn more about risk on eToro",
      statSince: "Since",
      statBase: "Base",
      statCopyFrom: "Copy from",
      snapshotOrigin: "Origin",
      snapshotOriginTitle: "Colombia to Australia",
      snapshotOriginText: "I share a cross-border investor perspective for everyday people learning to invest.",
      snapshotFocus: "Public focus",
      snapshotFocusTitle: "Long-term growth",
      snapshotFocusText: "I focus on stability, innovation, risk control, and avoiding emotional decisions.",
      snapshotProof: "Social proof",
      snapshotProofText: "You can find this profile linked in my Instagram bio.",
      snapshotStyle: "Style",
      snapshotStyleTitle: "Modern DCA",
      snapshotStyleText: "I follow a repeatable accumulation mindset rather than short-term market noise.",
      personaEyebrow: "My investor profile",
      personaTitle: "I invest calmly, directly, and for the long game.",
      personaIntro:
        "My view is simple: investing is not gambling. I aim to be approachable, bilingual, grounded, and confident without promising outcomes.",
      personaCardOneTitle: "Everyday clarity",
      personaCardOneText:
        "I speak to everyday people who are learning to invest, using plain language and practical decision rules.",
      personaCardTwoTitle: "Discipline over hype",
      personaCardTwoText:
        "I treat patience, process, and emotional control as an edge, especially when markets get noisy.",
      personaCardThreeTitle: "Future-facing",
      personaCardThreeText:
        "I combine broad ETF exposure with selective innovative assets, keeping my approach modern but measured.",
      etoroBioSource: "Synced from eToro",
      etoroBioTitle: "Latest eToro bio",
      etoroBioLoading: "Latest public eToro bio loads from refreshed profile data.",
      strategyEyebrow: "My strategy",
      strategyTitle: "How I approach long-term investing.",
      allocationEtf: "ETF core",
      allocationInnovation: "Innovation",
      allocationDca: "DCA rhythm",
      allocationRisk: "Risk review",
      strategyCardOneTitle: "Foundation first",
      strategyCardOneText: "I use world-class ETFs as a steady foundation.",
      strategyCardTwoTitle: "Innovation with boundaries",
      strategyCardTwoText: "I consider forward-looking assets while keeping risk visible.",
      strategyCardThreeTitle: "DCA and patience",
      strategyCardThreeText: "I prioritize consistency rather than trying to time the market.",
      strategyCardFourTitle: "Transparent risk",
      strategyCardFourText: "I believe copy trading is a decision that requires personal research.",
      quoteEyebrow: "What guides me",
      quoteText:
        "For me, these words mean patient action, education, and discipline over shortcuts.",
      connectEyebrow: "Connect",
      connectTitle: "Connect with me.",
      connectIntro:
        "Tell me where you are from and where you are currently located, then use one contact channel. Start with Instagram and wait for a reply before trying TikTok, or choose a time directly with Calendly.",
      messageDraftEyebrow: "Message draft",
      messageDraftTitle: "A friendly introduction",
      messageLocationIntro:
        "Add your origin and current location. Your browser time zone will be included automatically.",
      contactOriginLabel: "Where are you from?",
      contactOriginPlaceholder: "e.g. Bogotá, Colombia",
      contactLocationLabel: "Where are you currently located?",
      contactLocationPlaceholder: "e.g. Sydney, Australia",
      contactTimezoneLabel: "Time zone included:",
      messageDraftLabel: "Edit your message before sending",
      contactOriginFallback: "[where you are from]",
      contactLocationFallback: "[where you currently live]",
      contactMessageText:
        "Hi Juan, I found your website and would love to connect. I am originally from {origin}, and I am currently located in {location}. My current time zone is {timeZone}. I am interested in learning more about your long-term investing approach and the educational content you share. Please let me know a suitable time to connect. Thank you!",
      copyReady: "Ready to copy",
      copyMessage: "Copy message",
      copySuccess: "Message copied. Paste it into your conversation.",
      copyError: "Select the message and copy it manually.",
      copyMissingLocation: "Add your origin and current location first.",
      contactChannelsEyebrow: "One channel at a time",
      contactChannelsTitle: "Start with Instagram.",
      contactChannelsText:
        "Please use one option and wait for a reply. If social messaging is unavailable, use Calendly to choose a time.",
      contactOptionLabel: "Option",
      contactOptionOf: "of",
      contactInstagramText: "My preferred contact channel.",
      contactTiktokText: "Use only if Instagram is unavailable.",
      contactCalendlyTitle: "Calendly",
      contactCalendlyText: "Choose a time directly if social messaging is unavailable.",
      openInstagram: "Copy & open Instagram",
      openTiktok: "Copy & open TikTok",
      openCalendly: "Choose a time",
      contactPrevious: "Previous option",
      contactTryTiktok: "Instagram unavailable? Try TikTok",
      contactTryCalendly: "TikTok unavailable? Try Calendly",
      tiktokManualNote: "Reviewed public TikTok profile stats",
      navHome: "Home",
      bioReadMore: "Read more",
      bioShowLess: "Show less",
      bookEyebrow: "My book",
      bookLanguage: "Spanish e-book",
      bookCoverAlt: "Cover of Así empecé a invertir by Juan Puentes Botero",
      bookIntro:
        "In this Spanish-language e-book, I share how I began investing and the principles I use to build a long-term portfolio from the ground up.",
      bookTopicOne: "Understand the stock market, investing risk, and diversification.",
      bookTopicTwo: "Explore index funds, compound interest, fees, and taxes.",
      bookTopicThree: "Learn the 4% rule and the thinking behind my investment strategy.",
      bookCta: "Explore the e-book",
      bookNote: "Opens my Gumroad book page in a new tab.",
      riskTitle: "Risk note",
      riskText:
        "This website shares my public profile. It is not financial advice, an offer to buy or sell financial products, or an official eToro website. Copy trading and investing involve risk, including possible loss of capital. Past performance does not guarantee future results. Always verify details directly on eToro and consider your own circumstances.",
      footerText: "I'm Juan Puentes Botero. This is my public investor profile.",
      footerDataText: "Data refreshed",
      footerEtoro: "eToro profile",
      footerInstagram: "Instagram profile",
      footerTiktok: "TikTok profile",
    },
    es: {
      pageTitle: "Juan Puentes | Inversionista a Largo Plazo",
      themeLabel: "Tema",
      themeToDark: "Cambiar a tema oscuro",
      themeToLight: "Cambiar a tema claro",
      skipLink: "Saltar al contenido",
      brandRole: "Inversionista Popular en eToro",
      navPersona: "Sobre mí",
      navBook: "Mi libro",
      navStrategy: "Estrategia",
      navConnect: "Conectar",
      navStartEtoro: "Empezar en eToro",
      heroEyebrow: "Mi perfil de inversionista",
      heroTitle: "Inversión a largo plazo, construida con disciplina.",
      heroLede:
        "Soy Juan Puentes Botero, un inversionista colombiano que vive en Australia. Comparto un camino práctico de inversión basado en estabilidad, innovación, DCA, ETFs como base y control inteligente del riesgo.",
      connectWithMe: "Conecta conmigo",
      followInstagram: "Seguir en Instagram",
      followTiktok: "Seguir en TikTok",
      verifiedProfile: "Perfil verificado",
      popularInvestor: "Inversionista Popular",
      profileStartInvesting: "Invierte conmigo",
      profileRiskDisclaimer:
        "El Copy Trading no constituye asesoramiento de inversión. El valor de tus inversiones puede subir o bajar. Tu capital está en riesgo.",
      profileRiskLearnMore: "Más información sobre riesgos en eToro",
      statSince: "Desde",
      statBase: "Base",
      statCopyFrom: "Copiar desde",
      snapshotOrigin: "Origen",
      snapshotOriginTitle: "De Colombia a Australia",
      snapshotOriginText: "Comparto una perspectiva multicultural para personas comunes que quieren aprender a invertir.",
      snapshotFocus: "Enfoque público",
      snapshotFocusTitle: "Crecimiento a largo plazo",
      snapshotFocusText: "Me enfoco en estabilidad, innovación, control del riesgo y decisiones sin dejarme llevar por las emociones.",
      snapshotProof: "Prueba social",
      snapshotProofText: "Puedes encontrar este perfil enlazado en mi biografía de Instagram.",
      snapshotStyle: "Estilo",
      snapshotStyleTitle: "DCA moderno",
      snapshotStyleText: "Sigo una mentalidad de acumulación constante en lugar del ruido de corto plazo.",
      personaEyebrow: "Mi perfil de inversionista",
      personaTitle: "Invierto con un enfoque equilibrado, directo y de largo plazo.",
      personaIntro:
        "Mi visión es simple: invierto, no apuesto. Busco ser cercano, bilingüe, realista y seguro, sin prometer resultados.",
      personaCardOneTitle: "Claridad cotidiana",
      personaCardOneText:
        "Hablo a personas comunes que están aprendiendo a invertir, con lenguaje claro y reglas prácticas de decisión.",
      personaCardTwoTitle: "Disciplina sobre hype",
      personaCardTwoText:
        "Considero la paciencia, el proceso y el control emocional como una ventaja, especialmente cuando el mercado se vuelve ruidoso.",
      personaCardThreeTitle: "Mirada al futuro",
      personaCardThreeText:
        "Combino exposición amplia a ETFs con activos innovadores selectivos, manteniendo mi enfoque moderno pero medido.",
      etoroBioSource: "Sincronizado desde eToro",
      etoroBioTitle: "Biografía actual de eToro",
      etoroBioLoading: "La biografía pública de eToro se carga desde los datos actualizados.",
      strategyEyebrow: "Mi estrategia",
      strategyTitle: "Cómo abordo la inversión a largo plazo.",
      allocationEtf: "Base ETF",
      allocationInnovation: "Innovación",
      allocationDca: "Ritmo DCA",
      allocationRisk: "Revisión de riesgo",
      strategyCardOneTitle: "Primero la base",
      strategyCardOneText: "Uso ETFs de clase mundial como una base estable.",
      strategyCardTwoTitle: "Innovación con límites",
      strategyCardTwoText: "Considero activos con visión de futuro manteniendo visible el riesgo.",
      strategyCardThreeTitle: "DCA y paciencia",
      strategyCardThreeText: "Priorizo la constancia en lugar de intentar adivinar el mercado.",
      strategyCardFourTitle: "Riesgo transparente",
      strategyCardFourText: "Creo que el copy trading es una decisión que requiere investigación personal.",
      quoteEyebrow: "Lo que me guía",
      quoteText:
        "Para mí, estas palabras significan acción paciente, educación y disciplina por encima de los atajos.",
      connectEyebrow: "Conectar",
      connectTitle: "Conecta conmigo.",
      connectIntro:
        "Cu\u00e9ntame de d\u00f3nde eres y d\u00f3nde te encuentras actualmente. Empieza por Instagram y espera una respuesta antes de probar TikTok, o elige una hora directamente con Calendly.",
      messageDraftEyebrow: "Borrador del mensaje",
      messageDraftTitle: "Una presentaci\u00f3n amable",
      messageLocationIntro:
        "A\u00f1ade tu lugar de origen y tu ubicaci\u00f3n actual. La zona horaria de tu navegador se incluir\u00e1 autom\u00e1ticamente.",
      contactOriginLabel: "\u00bfDe d\u00f3nde eres?",
      contactOriginPlaceholder: "p. ej., Bogot\u00e1, Colombia",
      contactLocationLabel: "\u00bfD\u00f3nde te encuentras actualmente?",
      contactLocationPlaceholder: "p. ej., S\u00eddney, Australia",
      contactTimezoneLabel: "Zona horaria incluida:",
      messageDraftLabel: "Edita tu mensaje antes de enviarlo",
      contactOriginFallback: "[tu lugar de origen]",
      contactLocationFallback: "[tu ubicaci\u00f3n actual]",
      contactMessageText:
        "Hola Juan, encontr\u00e9 tu sitio web y me gustar\u00eda conectar contigo. Soy de {origin} y actualmente estoy en {location}. Mi zona horaria actual es {timeZone}. Me interesa conocer m\u00e1s sobre tu enfoque de inversi\u00f3n a largo plazo y el contenido educativo que compartes. Por favor, dime qu\u00e9 horario te viene bien. \u00a1Gracias!",
      copyReady: "Listo para copiar",
      copyMessage: "Copiar mensaje",
      copySuccess: "Mensaje copiado. P\u00e9galo en tu conversaci\u00f3n.",
      copyError: "Selecciona el mensaje y c\u00f3pialo manualmente.",
      copyMissingLocation: "A\u00f1ade primero tu lugar de origen y tu ubicaci\u00f3n actual.",
      contactChannelsEyebrow: "Un canal a la vez",
      contactChannelsTitle: "Empieza por Instagram.",
      contactChannelsText:
        "Usa una sola opci\u00f3n y espera una respuesta. Si los mensajes sociales no est\u00e1n disponibles, usa Calendly para elegir una hora.",
      contactOptionLabel: "Opci\u00f3n",
      contactOptionOf: "de",
      contactInstagramText: "Mi canal de contacto preferido.",
      contactTiktokText: "Usa TikTok solo si Instagram no est\u00e1 disponible.",
      contactCalendlyTitle: "Calendly",
      contactCalendlyText: "Elige una hora directamente si los mensajes sociales no est\u00e1n disponibles.",
      openInstagram: "Copiar y abrir Instagram",
      openTiktok: "Copiar y abrir TikTok",
      openCalendly: "Elegir una hora",
      contactPrevious: "Opci\u00f3n anterior",
      contactTryTiktok: "\u00bfInstagram no est\u00e1 disponible? Prueba TikTok",
      contactTryCalendly: "\u00bfTikTok no est\u00e1 disponible? Prueba Calendly",
      tiktokManualNote: "Estadísticas públicas revisadas de TikTok",
      navHome: "Inicio",
      bioReadMore: "Leer más",
      bioShowLess: "Mostrar menos",
      bookEyebrow: "Mi libro",
      bookLanguage: "E-book en español",
      bookCoverAlt: "Portada de Así empecé a invertir, de Juan Puentes Botero",
      bookIntro:
        "En este e-book en español, comparto cómo empecé a invertir y los principios que uso para construir un portafolio de largo plazo desde cero.",
      bookTopicOne: "Entiende la bolsa de valores, el riesgo de invertir y la diversificación.",
      bookTopicTwo: "Explora los fondos indexados, el interés compuesto, las comisiones y los impuestos.",
      bookTopicThree: "Conoce la regla del 4% y las ideas detrás de mi estrategia de inversión.",
      bookCta: "Ver el e-book",
      bookNote: "Abre la página de mi libro en Gumroad en una pestaña nueva.",
      riskTitle: "Nota de riesgo",
      riskText:
        "Este sitio comparte mi perfil público. No es asesoría financiera, una oferta para comprar o vender productos financieros ni un sitio oficial de eToro. El copy trading y la inversión implican riesgo, incluida la posible pérdida de capital. El rendimiento pasado no garantiza resultados futuros. Verifica siempre los detalles directamente en eToro y considera tus propias circunstancias.",
      footerText: "Soy Juan Puentes Botero. Este es mi perfil público de inversionista.",
      footerDataText: "Datos actualizados",
      footerEtoro: "Perfil de eToro",
      footerInstagram: "Perfil de Instagram",
      footerTiktok: "Perfil de TikTok",
    },
  };

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const getStoredValue = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storeValue = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Browsers can block storage in private contexts; the UI still updates.
    }
  };

  const getInitialLanguage = () => {
    const stored = getStoredValue(languageStorageKey);
    if (stored === "en" || stored === "es") return stored;
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  };

  let activeLanguage = getInitialLanguage();
  let activeProfile = null;
  let contactMessageEdited = false;
  let activeContactRoute = 0;

  const translate = (key) => translations[activeLanguage][key] || translations.en[key] || "";
  const getPageTitle = () => translate("pageTitle");

  const contactRoutes = [
    {
      name: "Instagram",
      descriptionKey: "contactInstagramText",
      actionKey: "openInstagram",
      url: "https://www.instagram.com/juanpuentesb/",
      type: "social",
    },
    {
      name: "TikTok",
      descriptionKey: "contactTiktokText",
      actionKey: "openTiktok",
      url: "https://www.tiktok.com/@juanpuentesb",
      type: "social",
    },
    {
      nameKey: "contactCalendlyTitle",
      descriptionKey: "contactCalendlyText",
      actionKey: "openCalendly",
      url: "https://calendly.com/j-puentesb?utm_source=juanpuentesb.com&utm_medium=website&utm_campaign=connect&utm_content=contact_section",
      type: "booking",
    },
  ];

  const fillTemplate = (template, values) =>
    Object.entries(values).reduce(
      (result, [key, value]) => result.split(`{${key}}`).join(value),
      template
    );

  const buildContactMessage = () =>
    fillTemplate(translate("contactMessageText"), {
      origin: contactOrigin?.value.trim() || translate("contactOriginFallback"),
      location: contactLocation?.value.trim() || translate("contactLocationFallback"),
      timeZone: userTimeZone,
    });

  const getMissingLocationInput = () =>
    [contactOrigin, contactLocation].find((input) => input && !input.value.trim());

  const ensureLocationDetails = () => {
    const missingInput = getMissingLocationInput();
    if (!missingInput) return true;

    missingInput.setAttribute("aria-invalid", "true");
    missingInput.focus();
    if (copyStatus) {
      copyStatus.textContent = translate("copyMissingLocation");
    }
    return false;
  };

  const syncContactRoute = () => {
    const route = contactRoutes[activeContactRoute];
    if (!route || !contactAction) return;

    if (contactRouteStep) {
      contactRouteStep.textContent = `${translate("contactOptionLabel")} ${activeContactRoute + 1} ${translate("contactOptionOf")} ${contactRoutes.length}`;
    }
    if (contactRouteName) {
      contactRouteName.textContent = route.nameKey ? translate(route.nameKey) : route.name;
    }
    if (contactRouteDescription) {
      contactRouteDescription.textContent = translate(route.descriptionKey);
    }

    contactAction.href = route.url;
    contactAction.target = "_blank";
    contactAction.rel = "noopener noreferrer";
    contactAction.textContent = translate(route.actionKey);

    if (contactPrevious) {
      contactPrevious.hidden = activeContactRoute === 0;
    }
    if (contactNext) {
      contactNext.hidden = activeContactRoute === contactRoutes.length - 1;
      contactNext.textContent =
        activeContactRoute === 0 ? translate("contactTryTiktok") : translate("contactTryCalendly");
    }
  };

  const syncContactMessage = () => {
    if (!contactMessage) return;
    if (!contactMessageEdited) {
      contactMessage.value = buildContactMessage();
    }
    if (contactTimeZone) {
      contactTimeZone.textContent = userTimeZone;
    }
    if (copyStatus) {
      copyStatus.textContent = getMissingLocationInput()
        ? translate("copyMissingLocation")
        : translate("copyReady");
    }
    syncContactRoute();
  };

  const copyContactMessage = async () => {
    if (!contactMessage) return;
    if (!ensureLocationDetails()) return;
    const message = contactMessage.value.trim();
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message);
      if (copyStatus) {
        copyStatus.textContent = translate("copySuccess");
      }
    } catch {
      contactMessage.focus();
      contactMessage.select();
      if (copyStatus) {
        copyStatus.textContent = translate("copyError");
      }
    }
  };

  const calendarHours = [14, 15, 16, 17, 18, 19, 20, 21];
  const slotTemplates = [
    { weekday: 1, hour: 16, minute: 0, duration: 30 },
    { weekday: 2, hour: 15, minute: 30, duration: 30 },
    { weekday: 3, hour: 18, minute: 0, duration: 30 },
    { weekday: 4, hour: 16, minute: 30, duration: 30 },
    { weekday: 5, hour: 15, minute: 0, duration: 30 },
  ];
  let visibleWeekStart = null;
  let selectedSlot = null;

  const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  };

  const getWeekStart = (date) => {
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = weekStart.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + offset);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const getSlotDate = (template) => {
    const slotDate = addDays(visibleWeekStart, template.weekday - 1);
    slotDate.setHours(template.hour, template.minute, 0, 0);
    return slotDate;
  };

  const toCalendarTimestamp = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const escapeIcsText = (value) =>
    value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const getSlotKey = (date) => toCalendarTimestamp(date);

  const formatWeekRange = () => {
    const weekEnd = addDays(visibleWeekStart, 4);
    const sameMonth = visibleWeekStart.getMonth() === weekEnd.getMonth();
    const monthFormatter = new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      month: "short",
    });
    const yearFormatter = new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      year: "numeric",
    });
    const startMonth = monthFormatter.format(visibleWeekStart);
    const endMonth = monthFormatter.format(weekEnd);
    const year = yearFormatter.format(weekEnd);
    return sameMonth
      ? `${visibleWeekStart.getDate()}-${weekEnd.getDate()} ${endMonth}, ${year}`
      : `${visibleWeekStart.getDate()} ${startMonth}-${weekEnd.getDate()} ${endMonth}, ${year}`;
  };

  const formatRelativeWeek = () => {
    const currentWeekStart = getWeekStart(new Date());
    const weekDifference = Math.round((visibleWeekStart - currentWeekStart) / (7 * 24 * 60 * 60 * 1000));

    if (weekDifference === 0) return translate("bookingRelativeThisWeek");
    if (weekDifference === 1) return translate("bookingRelativeNextWeek");
    if (weekDifference > 1) {
      return translate("bookingRelativeInWeeks").replace("{count}", String(weekDifference));
    }
    if (weekDifference === -1) return translate("bookingRelativePreviousWeek");
    return translate("bookingRelativeWeeksAgo").replace("{count}", String(Math.abs(weekDifference)));
  };

  const formatDayName = (date) =>
    new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", { weekday: "short" }).format(date);

  const formatTime = (date) =>
    new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);

  const formatSelectedSlot = (slot) => {
    const endDate = new Date(slot.startDate.getTime() + slot.duration * 60000);
    const datePart = new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(slot.startDate);
    return `${datePart}, ${formatTime(slot.startDate)}-${formatTime(endDate)} (${userTimeZone})`;
  };

  const buildGoogleEventUrl = (slot) => {
    const endDate = new Date(slot.startDate.getTime() + slot.duration * 60000);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Google Meet with Juan Puentes",
      dates: `${toCalendarTimestamp(slot.startDate)}/${toCalendarTimestamp(endDate)}`,
      details:
        "Calendar hold from juanpuentesb.github.io. Final availability and Google Meet details are confirmed through Juan's official booking page.",
      location: "Google Meet",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const buildIcsUrl = (slot) => {
    const endDate = new Date(slot.startDate.getTime() + slot.duration * 60000);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Juan Puentes//Booking//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${getSlotKey(slot.startDate)}@juanpuentesb.github.io`,
      `DTSTAMP:${toCalendarTimestamp(new Date())}`,
      `DTSTART:${toCalendarTimestamp(slot.startDate)}`,
      `DTEND:${toCalendarTimestamp(endDate)}`,
      `SUMMARY:${escapeIcsText("Google Meet with Juan Puentes")}`,
      `DESCRIPTION:${escapeIcsText("Calendar hold from juanpuentesb.github.io. Final availability and Google Meet details are confirmed through Juan's official booking page.")}`,
      `LOCATION:${escapeIcsText("Google Meet")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
  };

  const setActionLink = (link, href) => {
    if (!link) return;
    if (href) {
      link.href = href;
      link.removeAttribute("aria-disabled");
      if (href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
      return;
    }
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("aria-disabled", "true");
  };

  const updateSlotPanel = () => {
    if (!selectedSlotText) return;

    if (!selectedSlot) {
      selectedSlotText.textContent = translate("bookingNoSlot");
      setActionLink(googleEventLink, "");
      setActionLink(icsLink, "");
      return;
    }

    selectedSlotText.textContent = formatSelectedSlot(selectedSlot);
    setActionLink(googleEventLink, buildGoogleEventUrl(selectedSlot));
    setActionLink(icsLink, buildIcsUrl(selectedSlot));
  };

  const renderScheduler = () => {
    if (!calendarGrid) return;
    if (!visibleWeekStart) {
      visibleWeekStart = getWeekStart(new Date());
    }

    if (weekLabel) {
      weekLabel.textContent = formatWeekRange();
    }
    if (weekRelativeLabel) {
      weekRelativeLabel.textContent = formatRelativeWeek();
    }
    if (timezoneLabel) {
      timezoneLabel.textContent = userTimeZone;
    }

    const days = Array.from({ length: 5 }, (_, index) => addDays(visibleWeekStart, index));
    const slots = slotTemplates.map((template) => {
      const startDate = getSlotDate(template);
      return {
        ...template,
        key: getSlotKey(startDate),
        startDate,
      };
    });

    const pieces = ['<div class="calendar-corner" aria-hidden="true"></div>'];
    days.forEach((day) => {
      pieces.push(
        `<div class="calendar-day-head"><strong>${day.getDate()}</strong><span>${formatDayName(day)}</span></div>`
      );
    });

    calendarHours.forEach((hour) => {
      const hourDate = new Date(visibleWeekStart);
      hourDate.setHours(hour, 0, 0, 0);
      pieces.push(`<div class="calendar-time">${formatTime(hourDate)}</div>`);
      days.forEach((day) => {
        const daySlots = slots.filter(
          (slot) =>
            slot.startDate.getFullYear() === day.getFullYear() &&
            slot.startDate.getMonth() === day.getMonth() &&
            slot.startDate.getDate() === day.getDate() &&
            slot.startDate.getHours() === hour
        );
        const slotButtons = daySlots
          .map((slot) => {
            const active = selectedSlot?.key === slot.key ? " is-selected" : "";
            const top = (slot.minute / 60) * 100;
            const height = (slot.duration / 60) * 100;
            const label = `${formatDayName(slot.startDate)} ${slot.startDate.getDate()}, ${formatTime(slot.startDate)}`;
            return `<button class="calendar-slot${active}" type="button" style="--slot-top:${top}%;--slot-height:${height}%;" data-slot-key="${slot.key}" aria-label="${label}"><span>${formatTime(slot.startDate)}</span><strong>30 min</strong></button>`;
          })
          .join("");
        pieces.push(`<div class="calendar-cell">${slotButtons}</div>`);
      });
    });

    calendarGrid.innerHTML = pieces.join("");
    calendarGrid.querySelectorAll("[data-slot-key]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSlot = slots.find((slot) => slot.key === button.dataset.slotKey) || null;
        renderScheduler();
      });
    });
    updateSlotPanel();
  };

  const syncBookingWidget = () => {
    if (hasBookingUrl) {
      [bookingLink, officialBookingLink].forEach((link) => {
        if (!link) return;
        link.href = bookingUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
        link.textContent = translate("bookingOpen");
      });

      if (bookingFrame) {
        bookingFrame.src = bookingUrl;
        bookingFrame.hidden = false;
      }
      if (bookingPlaceholder) {
        bookingPlaceholder.hidden = true;
      }
      return;
    }

    if (bookingLink) {
      bookingLink.removeAttribute("href");
      bookingLink.removeAttribute("target");
      bookingLink.removeAttribute("rel");
      bookingLink.setAttribute("aria-disabled", "true");
      bookingLink.textContent = translate("bookingPendingButton");
    }
    if (officialBookingLink) {
      officialBookingLink.removeAttribute("href");
      officialBookingLink.removeAttribute("target");
      officialBookingLink.removeAttribute("rel");
      officialBookingLink.setAttribute("aria-disabled", "true");
      officialBookingLink.textContent = translate("bookingOfficialPending");
    }

    if (bookingFrame) {
      bookingFrame.removeAttribute("src");
      bookingFrame.hidden = true;
    }
    if (bookingPlaceholder) {
      bookingPlaceholder.hidden = false;
    }
  };

  const syncThemeButton = () => {
    const isDark = root.dataset.theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? translate("themeToLight") : translate("themeToDark"));
  };

  const applyTheme = (theme, persist) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#08120b" : "#f7fff5");
    }
    syncThemeButton();
    if (persist) {
      storeValue(themeStorageKey, theme);
    }
  };

  const bioToggle = document.querySelector("[data-bio-toggle]");
  const syncBioToggleText = () => {
    if (!bioToggle) return;
    const expanded = bioToggle.closest(".full-bio-card")?.classList.contains("is-expanded");
    bioToggle.textContent = expanded ? translate("bioShowLess") : translate("bioReadMore");
  };

  const applyLanguage = (language, persist) => {
    activeLanguage = language;
    root.lang = language;
    document.title = getPageTitle();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = translate(element.dataset.i18n);
      if (value) {
        element.textContent = value;
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const value = translate(element.dataset.i18nPlaceholder);
      if (value) {
        element.setAttribute("placeholder", value);
      }
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = translate(element.dataset.i18nAlt);
      if (value) {
        element.setAttribute("alt", value);
      }
    });

    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });

    syncThemeButton();
    syncBioToggleText();
    syncContactMessage();
    applyProfileData(activeProfile);
    if (persist) {
      storeValue(languageStorageKey, language);
    }
  };

  const setText = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const setSourceText = (selector, value, language) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
      if (language) {
        element.lang = language;
      }
    });
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  function applyProfileData(profile) {
    if (!profile) return;
    const etoro = profile.etoro || {};
    const instagram = profile.instagram || {};
    const tiktok = profile.tiktok || {};

    setText('[data-profile="investingSince"]', etoro.investingSince);
    setText('[data-profile="copyMinimum"]', etoro.copyMinimum);
    setText('[data-profile="aumDisplay"]', instagram.aumDisplay);
    setText('[data-profile="socialProofDetail"]', translate("snapshotProofText"));
    setText('[data-profile="instagramSummary"]', instagram.summary);
    setText('[data-profile="tiktokSummary"]', tiktok.summary);
    setText('[data-profile="lastUpdated"]', formatDate(profile.lastUpdated));
    const translatedBio = etoro.fullBioTranslations?.[activeLanguage];
    setSourceText(
      '[data-profile="etoroFullBio"]',
      translatedBio || etoro.fullBio,
      translatedBio ? activeLanguage : etoro.bioLanguage
    );

    if (etoro.avatarUrl) {
      document.querySelectorAll("[data-profile-image='avatar']").forEach((image) => {
        image.src = etoro.avatarUrl;
      });
    }
  }

  const hydratePublicData = async () => {
    try {
      const response = await fetch(`data/profile.json?refresh=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      activeProfile = await response.json();
      applyProfileData(activeProfile);
    } catch {
      // Dev preview keeps hand-written fallback copy if a social platform blocks refresh.
    }
  };

  applyTheme(getStoredValue(themeStorageKey) || getSystemTheme(), false);
  applyLanguage(activeLanguage, false);

  const navLinks = document.querySelectorAll(".nav-links a");

  if (window.location.hash) {
    const matchingLink = document.querySelector(`.nav-links a[href="${window.location.hash}"]`);
    if (matchingLink) {
      navLinks.forEach((l) => l.removeAttribute("aria-current"));
      matchingLink.setAttribute("aria-current", "page");
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.removeAttribute("aria-current"));
      link.setAttribute("aria-current", "page");
    });
  });

  const spySections = ["persona", "book", "strategy", "connect"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (spySections.length) {
    const navOffset = Math.ceil(header?.getBoundingClientRect().height || 80) + 8;
    const scrollSpy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (match) {
              navLinks.forEach((l) => l.removeAttribute("aria-current"));
              match.setAttribute("aria-current", "page");
            }
          }
        });
      },
      { rootMargin: `-${navOffset}px 0px -55% 0px`, threshold: 0 }
    );
    spySections.forEach((el) => scrollSpy.observe(el));
  }

  if (bioToggle) {
    bioToggle.addEventListener("click", () => {
      bioToggle.closest(".full-bio-card").classList.toggle("is-expanded");
      syncBioToggleText();
    });
  }

  themeToggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.language, true);
    });
  });

  contactMessage?.addEventListener("input", () => {
    contactMessageEdited = true;
    if (copyStatus) {
      copyStatus.textContent = getMissingLocationInput()
        ? translate("copyMissingLocation")
        : translate("copyReady");
    }
    syncContactRoute();
  });

  [contactOrigin, contactLocation].forEach((input) => {
    input?.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      if (!contactMessageEdited) {
        syncContactMessage();
      } else {
        if (copyStatus) {
          copyStatus.textContent = getMissingLocationInput()
            ? translate("copyMissingLocation")
            : translate("copyReady");
        }
        syncContactRoute();
      }
    });
  });

  copyMessageButton?.addEventListener("click", () => {
    void copyContactMessage();
  });

  contactAction?.addEventListener("click", (event) => {
    if (contactRoutes[activeContactRoute]?.type !== "social") return;
    if (ensureLocationDetails()) void copyContactMessage();
    else event.preventDefault();
  });

  contactPrevious?.addEventListener("click", () => {
    activeContactRoute = Math.max(0, activeContactRoute - 1);
    syncContactRoute();
  });

  contactNext?.addEventListener("click", () => {
    activeContactRoute = Math.min(contactRoutes.length - 1, activeContactRoute + 1);
    syncContactRoute();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!getStoredValue(themeStorageKey)) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });

  const updateHeader = () => {
    header.dataset.elevated = String(window.scrollY > 6);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  hydratePublicData();
})();
