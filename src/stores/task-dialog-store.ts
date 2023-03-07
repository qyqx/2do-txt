import { create } from "zustand";
import { Task } from "../utils/task";

interface TaskDialogState {
  open: boolean;
  task?: Task;
  openTaskDialog: (task?: Task) => void;
  closeTaskDialog: () => void;
  cleanupTaskDialog: () => void;
}

const useTaskDialogStore = create<TaskDialogState>((set) => ({
  open: false,
  task: undefined,
  openTaskDialog: (task?: Task) => set({ open: true, task }),
  closeTaskDialog: () => set((state) => ({ open: false, task: state.task })),
  cleanupTaskDialog: () => set({ open: false, task: undefined }),
}));

export default useTaskDialogStore;