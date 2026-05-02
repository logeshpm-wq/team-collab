import { describe, it, expect } from "vitest";
import { initials, memberColor, TEAM_MEMBERS } from "../lib/team";

describe("team helpers", () => {
  it("derives two-letter initials from full names", () => {
    expect(initials("Alice Chen")).toBe("AC");
    expect(initials("Bob Singh")).toBe("BS");
  });

  it("falls back to a slate color for unknown members", () => {
    expect(memberColor("Unknown Person")).toBe("bg-slate-500");
  });

  it("returns the assigned tailwind class for known members", () => {
    const alice = TEAM_MEMBERS.find((m) => m.name === "Alice Chen");
    expect(memberColor("Alice Chen")).toBe(alice?.color);
  });

  it("includes at least one team member", () => {
    expect(TEAM_MEMBERS.length).toBeGreaterThan(0);
  });
});
