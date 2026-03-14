import { loadFromStorage, saveToStorage } from "../../../utils/storage";
import type { RequestItem } from "../../../types";

const KEY = "nhu-requests";

export const requestService = {
  getRequests: (): RequestItem[] => loadFromStorage<RequestItem[]>(KEY, []),
  saveRequests: (requests: RequestItem[]) => saveToStorage(KEY, requests),
};
