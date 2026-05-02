import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskBoard from "../components/TaskBoard";
import { StoreProvider } from "../lib/store";

describe("TaskBoard", () => {
  it("renders the three Kanban columns", () => {
    render(
      <StoreProvider>
        <TaskBoard />
      </StoreProvider>
    );
    expect(screen.getByLabelText(/To Do column/i)).toBeDefined();
    expect(screen.getByLabelText(/In Progress column/i)).toBeDefined();
    expect(screen.getByLabelText(/Done column/i)).toBeDefined();
  });

  it("shows the stats row with all four metrics", () => {
    render(
      <StoreProvider>
        <TaskBoard />
      </StoreProvider>
    );
    expect(screen.getByText(/Total Tasks/i)).toBeDefined();
    expect(screen.getByText(/In Progress/i)).toBeDefined();
    expect(screen.getByText(/Completed/i)).toBeDefined();
    expect(screen.getByText(/Overdue/i)).toBeDefined();
  });
});
