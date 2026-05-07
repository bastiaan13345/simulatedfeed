export interface AdminSettings {
  activeFeed: 'A' | 'B';
  feedName: string;
  timerMinutes: number;
  showConditionA?: boolean;
  showConditionB?: boolean;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  activeFeed: 'A',
  feedName: '',
  timerMinutes: 5,
  showConditionA: true,
  showConditionB: true,
};

const STORAGE_KEY = 'feed-admin-settings';
const SETTINGS_API_PATH = '/api/admin-settings';

function normalizeAdminSettings(input: unknown): AdminSettings {
  const value = typeof input === 'object' && input !== null ? (input as Partial<AdminSettings>) : {};
  const parsedTimerMinutes = typeof value.timerMinutes === 'number'
    ? value.timerMinutes
    : typeof value.timerMinutes === 'string'
      ? Number.parseInt(value.timerMinutes, 10)
      : NaN;

  return {
    activeFeed: value.activeFeed === 'B' ? 'B' : 'A',
    feedName: typeof value.feedName === 'string' ? value.feedName : '',
    timerMinutes: Number.isFinite(parsedTimerMinutes)
      ? Math.max(1, Math.min(60, Math.round(parsedTimerMinutes)))
      : DEFAULT_ADMIN_SETTINGS.timerMinutes,
    showConditionA: value.showConditionA === false ? false : true,
    showConditionB: value.showConditionB === false ? false : true,
  };
}

function readLocalStorageSettings(): AdminSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return normalizeAdminSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeLocalStorageSettings(settings: AdminSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore browser storage failures and keep the shared API as the source of truth.
  }
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export async function loadAdminSettings(): Promise<AdminSettings> {
  try {
    const response = await fetch(SETTINGS_API_PATH, { cache: 'no-store' });
    if (response.ok) {
      const settings = normalizeAdminSettings(await readJsonResponse(response));
      writeLocalStorageSettings(settings);
      return settings;
    }
  } catch {
    // Fall back to browser-local settings when the shared API is unavailable.
  }

  return readLocalStorageSettings() ?? { ...DEFAULT_ADMIN_SETTINGS };
}

export async function saveAdminSettings(settings: AdminSettings): Promise<AdminSettings> {
  const normalizedSettings = normalizeAdminSettings(settings);

  try {
    const response = await fetch(SETTINGS_API_PATH, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedSettings),
      cache: 'no-store',
    });

    if (response.ok) {
      const savedSettings = normalizeAdminSettings(await readJsonResponse(response) ?? normalizedSettings);
      writeLocalStorageSettings(savedSettings);
      return savedSettings;
    }
  } catch {
    // Fall back to browser-local settings when the shared API is unavailable.
  }

  writeLocalStorageSettings(normalizedSettings);
  return normalizedSettings;
}