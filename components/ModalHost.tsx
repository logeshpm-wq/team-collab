"use client";

import { useStore } from "../lib/store";
import TaskModal from "./TaskModal";

export function ModalHost() {
  const { modal, closeModal } = useStore();
  return <TaskModal open={modal !== null} mode={modal} onClose={closeModal} />;
}
