import { loadFromStorage, saveToStorage } from "../../../utils/storage";
import type { FeedbackItem } from "../feedbackSlice";

const KEY = "nhu-feedback";

export const feedbackService = {
  getFeedback: (): FeedbackItem[] => loadFromStorage(KEY, []),
  saveFeedback: (items: FeedbackItem[]) => saveToStorage(KEY, items),
};
