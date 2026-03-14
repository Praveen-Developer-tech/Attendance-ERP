import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { feedbackService } from "./services/feedbackService";

export interface FeedbackItem {
  id: string;
  studentId: string;
  courseId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

interface FeedbackState {
  items: FeedbackItem[];
}

const initialState: FeedbackState = {
  items: feedbackService.getFeedback(),
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    submitFeedback: (state, action: PayloadAction<Omit<FeedbackItem, "id" | "createdAt">>) => {
      const item: FeedbackItem = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(item);
      feedbackService.saveFeedback(state.items);
    },
    updateFeedback: (state, action: PayloadAction<{ id: string; rating: 1 | 2 | 3 | 4 | 5; comment?: string }>) => {
      state.items = state.items.map((item) => (item.id === action.payload.id ? { ...item, rating: action.payload.rating, comment: action.payload.comment } : item));
      feedbackService.saveFeedback(state.items);
    },
  },
});

export const { submitFeedback, updateFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
