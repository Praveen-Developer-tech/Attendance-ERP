const canUseStorage = typeof window !== "undefined" && !!window.localStorage;

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage) {
    return fallback;
  }
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (error) {
    console.warn(`Failed to load ${key} from storage`, error);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (!canUseStorage) {
    return;
  }
  try {
    if (typeof value === "undefined") {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Failed to save ${key} to storage`, error);
  }
}
