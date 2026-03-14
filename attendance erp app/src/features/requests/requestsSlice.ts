import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RequestItem, RequestStatus } from "../../types";
import { requestService } from "./services/requestService";

interface RequestsState {
  items: RequestItem[];
}

const initialState: RequestsState = {
  items: requestService.getRequests(),
};

interface SubmitRequestPayload extends Omit<RequestItem, "id" | "status" | "createdAt" | "updatedAt"> {
  status?: RequestStatus;
}

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    submitRequest: (state, action: PayloadAction<SubmitRequestPayload>) => {
      const now = new Date().toISOString();
      const approvals = action.payload.approvals ?? {};
      const item: RequestItem = {
        ...action.payload,
        approvals,
        id: nanoid(),
        status: action.payload.status ?? "pending",
        createdAt: now,
        updatedAt: now,
      };
      state.items.unshift(item);
      requestService.saveRequests(state.items);
    },
    updateRequestStatus: (state, action: PayloadAction<{ id: string; role: RequestItem["createdForRole"] | string; status: RequestStatus; remarks?: string }>) => {
      state.items = state.items.map((item) => {
        if (item.id !== action.payload.id) return item;
        const approvals = { ...item.approvals, [action.payload.role]: action.payload.status } as RequestItem["approvals"];
        const statusValues = Object.values(approvals);
        const allApproved = statusValues.length && statusValues.every((s) => s === "approved");
        const anyDeclined = statusValues.some((s) => s === "declined");
        const nextStatus: RequestStatus = anyDeclined ? "declined" : allApproved ? "approved" : "pending";
        return {
          ...item,
          approvals,
          status: nextStatus,
          remarks: action.payload.remarks ?? item.remarks,
          updatedAt: new Date().toISOString(),
        };
      });
      requestService.saveRequests(state.items);
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      requestService.saveRequests(state.items);
    },
  },
});

export const { submitRequest, updateRequestStatus, removeRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
