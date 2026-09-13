import { storageKeys } from "./StorageKeys";

type StorageValue = string | number | object;
type AllowedKeys = keyof typeof storageKeys;

export const storage = {
  set(key: AllowedKeys | string, value: StorageValue) {
    const k = (storageKeys as Record<string, string>)[key] ?? key;
    localStorage.setItem(k, JSON.stringify(value));
  },

  get<T extends StorageValue>(key: AllowedKeys | string): T | null {
    const k = (storageKeys as Record<string, string>)[key as string] ?? key;
    const item = localStorage.getItem(k);
    return item !== null ? (JSON.parse(item) as T) : null;
  },

  remove(key: AllowedKeys | string) {
    const k = (storageKeys as Record<string, string>)[key as string] ?? key;
    localStorage.removeItem(k);
  },
};
