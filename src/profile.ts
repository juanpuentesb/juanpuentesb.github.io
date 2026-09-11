export interface ProfileData {
  lastUpdated?: string;
  etoro?: {
    investingSince?: string;
    copyMinimum?: string;
    avatarUrl?: string;
    fullBio?: string;
    fullBioTranslations?: { en?: string; es?: string };
    bioLanguage?: string;
  };
  instagram?: { aumDisplay?: string; summary?: string };
  tiktok?: { summary?: string };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function imageUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

// Network JSON is untyped at runtime, even when the caller is TypeScript.
export function parseProfileData(value: unknown): ProfileData | null {
  if (!isRecord(value)) return null;
  const profile: ProfileData = { lastUpdated: text(value.lastUpdated) };
  if (isRecord(value.etoro)) {
    const etoro = value.etoro;
    const bio = isRecord(etoro.fullBioTranslations) ? etoro.fullBioTranslations : {};
    profile.etoro = {
      investingSince: text(etoro.investingSince),
      copyMinimum: text(etoro.copyMinimum),
      avatarUrl: imageUrl(etoro.avatarUrl),
      fullBio: text(etoro.fullBio),
      fullBioTranslations: { en: text(bio.en), es: text(bio.es) },
      bioLanguage: text(etoro.bioLanguage),
    };
  }
  if (isRecord(value.instagram)) {
    profile.instagram = {
      aumDisplay: text(value.instagram.aumDisplay),
      summary: text(value.instagram.summary),
    };
  }
  if (isRecord(value.tiktok)) {
    profile.tiktok = { summary: text(value.tiktok.summary) };
  }
  return profile;
}
