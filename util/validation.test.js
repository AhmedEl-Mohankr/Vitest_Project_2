import { describe, it, expect } from "vitest";
import { validateNotEmpty } from "./validation";


it("should throw an error if an empty string is provided as a value", () => {
  const testInput = "";
  const validationfn = () => validateNotEmpty(testInput);
  expect(validationfn).toThrow();
});

it("should throw an error if an empty string is provided as a value", () => {
  const testInput = "  ";
  
  const validationfn = () => validateNotEmpty(testInput);
  expect(validationfn).toThrow();
});

it("should throw an error with the provided error message", () => {
  const testInput = " ";
  const testErrorMessage = "Test";
  const validationfn = () => validateNotEmpty(testInput, testErrorMessage);
  expect(validationfn).toThrow(testErrorMessage);
});
