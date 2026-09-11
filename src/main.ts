import { isLanguage, isTranslationKey, translations } from "./translations";
import type { Language, TranslationKey } from "./translations";
import { parseProfileData } from "./profile";
import type { ProfileData } from "./profile";

type Theme = "light" | "dark";
type ContactRoute = {
  descriptionKey: TranslationKey;
  actionKey: TranslationKey;
  url: string;
  type: "social" | "booking";
} & ({ name: string; nameKey?: never } | { nameKey: TranslationKey; name?: never });

function initializeSite() {
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>(".site-header");
  const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
  const languageButtons = document.querySelectorAll<HTMLButtonElement>("[data-language]");
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const themeStorageKey = "juan-puentes-theme";
  const languageStorageKey = "juan-puentes-language";
  const contactMessage = document.querySelector<HTMLTextAreaElement>("[data-contact-message]");
  const copyMessageButton = document.querySelector<HTMLButtonElement>("[data-copy-message]");
  const copyStatus = document.querySelector<HTMLElement>("[data-copy-status]");
  const contactOrigin = document.querySelector<HTMLInputElement>("[data-contact-origin]");
  const contactLocation = document.querySelector<HTMLInputElement>("[data-contact-location]");
  const contactTimeZone = document.querySelector<HTMLElement>("[data-contact-timezone]");
  const contactRouteStep = document.querySelector<HTMLElement>("[data-contact-route-step]");
  const contactRouteName = document.querySelector<HTMLElement>("[data-contact-route-name]");
  const contactRouteDescription = document.querySelector<HTMLElement>("[data-contact-route-description]");
  const contactAction = document.querySelector<HTMLAnchorElement>("[data-contact-action]");
  const contactPrevious = document.querySelector<HTMLButtonElement>("[data-contact-previous]");
  const contactNext = document.querySelector<HTMLButtonElement>("[data-contact-next]");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

  const getSystemTheme = (): Theme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const getStoredValue = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storeValue = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Browsers can block storage in private contexts; the UI still updates.
    }
  };

  const getInitialLanguage = (): Language => {
    const stored = getStoredValue(languageStorageKey);
    if (stored === "en" || stored === "es") return stored;
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  };

  let activeLanguage = getInitialLanguage();
  let activeProfile: ProfileData | null = null;
  let contactMessageEdited = false;
  let activeContactRoute = 0;

  const translate = (key: TranslationKey) => translations[activeLanguage][key];
  const getPageTitle = () => translate("pageTitle");

  const contactRoutes: readonly ContactRoute[] = [
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

  const fillTemplate = (template: string, values: Record<string, string>) =>
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

  const syncThemeButton = () => {
    const isDark = root.dataset.theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? translate("themeToLight") : translate("themeToDark"));
  };

  const applyTheme = (theme: Theme, persist: boolean) => {
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

  const bioToggle = document.querySelector<HTMLButtonElement>("[data-bio-toggle]");
  const syncBioToggleText = () => {
    if (!bioToggle) return;
    const expanded = bioToggle.closest(".full-bio-card")?.classList.contains("is-expanded");
    bioToggle.textContent = expanded ? translate("bioShowLess") : translate("bioReadMore");
  };

  const applyLanguage = (language: Language, persist: boolean) => {
    activeLanguage = language;
    root.lang = language;
    document.title = getPageTitle();

    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const value = isTranslationKey(key) ? translate(key) : "";
      if (value) {
        element.textContent = value;
      }
    });
    document.querySelectorAll<HTMLElement>("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      const value = isTranslationKey(key) ? translate(key) : "";
      if (value) {
        element.setAttribute("placeholder", value);
      }
    });
    document.querySelectorAll<HTMLElement>("[data-i18n-alt]").forEach((element) => {
      const key = element.dataset.i18nAlt;
      const value = isTranslationKey(key) ? translate(key) : "";
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

  const setText = (selector: string, value: string | undefined) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const setSourceText = (selector: string, value: string | undefined, language: string | undefined) => {
    if (!value) return;
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.textContent = value;
      if (language) {
        element.lang = language;
      }
    });
  };

  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(activeLanguage === "es" ? "es-AU" : "en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  function applyProfileData(profile: ProfileData | null) {
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

    const avatarUrl = etoro.avatarUrl;
    if (avatarUrl) {
      document.querySelectorAll<HTMLImageElement>("[data-profile-image='avatar']").forEach((image) => {
        image.src = avatarUrl;
      });
    }
  }

  const hydratePublicData = async () => {
    try {
      const response = await fetch(`data/profile.json?refresh=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data: unknown = await response.json();
      activeProfile = parseProfileData(data);
      applyProfileData(activeProfile);
    } catch {
      // Dev preview keeps hand-written fallback copy if a social platform blocks refresh.
    }
  };

  const storedTheme = getStoredValue(themeStorageKey);
  applyTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : getSystemTheme(), false);
  applyLanguage(activeLanguage, false);

  const navLinks = document.querySelectorAll(".nav-links a");

  if (window.location.hash) {
    const matchingLink = Array.from(navLinks).find((link) => link.getAttribute("href") === window.location.hash);
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
    .filter((element): element is HTMLElement => element !== null);

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
      bioToggle.closest(".full-bio-card")?.classList.toggle("is-expanded");
      syncBioToggleText();
    });
  }

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.language;
      if (isLanguage(language)) applyLanguage(language, true);
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
    if (header) header.dataset.elevated = String(window.scrollY > 6);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  void hydratePublicData();
}

initializeSite();
void import("./hero-scene").catch(() => {
  const host = document.querySelector<HTMLElement>("[data-hero-scene]");
  if (host) host.dataset.renderer = "unavailable";
});
