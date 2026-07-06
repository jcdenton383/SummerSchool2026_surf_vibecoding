import { create } from "zustand";
import type { ParticipantInput } from "@/api/types";

type DraftState = {
  slotId: string | null;
  clientName: string;
  participants: ParticipantInput[];
  setDraft: (slotId: string, clientName: string, participants: ParticipantInput[]) => void;
  clear: () => void;
};

const defaultParticipant: ParticipantInput = {
  name: "",
  allergyStatus: "none",
  allergyComment: "",
  equipmentOption: "own"
};

export const useBookingDraftStore = create<DraftState>((set) => ({
  slotId: null,
  clientName: "",
  participants: [defaultParticipant],
  setDraft: (slotId, clientName, participants) => set({ slotId, clientName, participants }),
  clear: () => set({ slotId: null, clientName: "", participants: [defaultParticipant] })
}));

export const emptyParticipant = defaultParticipant;
