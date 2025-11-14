import { create } from "zustand";

interface SuggestionDialogState {
    isOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;
    setOpen: (open: boolean) => void;
}

export const useSuggestionDialogStore = create<SuggestionDialogState>(
    (set) => ({
        isOpen: false,
        openDialog: () => set({ isOpen: true }),
        closeDialog: () => set({ isOpen: false }),
        setOpen: (open: boolean) => set({ isOpen: open }),
    }),
);
