// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { CountMetric } from "./CountMetric";

describe("CountMetric", () => {
  it("does not present the initial zero as a settled empty result", () => {
    render(<CountMetric label="Total Scored" value={0} loading error={false} />);

    expect(screen.getByRole("status", { name: "Total Scored: loading" })).toHaveTextContent("Loading");
    expect(screen.getByTestId("count-metric-value")).not.toHaveTextContent("0");
  });

  it("shows a settled zero after loading completes", () => {
    render(<CountMetric label="Total Scored" value={0} loading={false} error={false} />);

    expect(screen.getByRole("status", { name: "Total Scored: 0" })).toHaveTextContent("0");
  });

  it("does not report an error state as an empty result", () => {
    render(<CountMetric label="Total Scored" value={0} loading={false} error />);

    expect(screen.getByRole("status", { name: "Total Scored: unavailable" })).toHaveTextContent("Unavailable");
  });
});
