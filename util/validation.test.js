import { describe, it, expect } from "vitest";
import { validateNotEmpty } from "./validation";

//Testing for errors *( note that the following pattern can be used for testing errors).
it("should throw an error if an empty string is provided as a value", () => {
  const testInput = "";
  //The validation function is wrapper for my validation function
  //To validate not empty, we will pass the testInput
  const validationfn = () => validateNotEmpty(testInput);
  expect(validationfn).toThrow();
});

it("should throw an error if an empty string is provided as a value", () => {
  const testInput = "  ";
  //The validation function is wrapper for my validation function
  //To validate not empty, we will pass the testInput
  const validationfn = () => validateNotEmpty(testInput);
  expect(validationfn).toThrow();
});

it("should throw an error with the provided error message", () => {
  const testInput = " ";
  const testErrorMessage = "Test";
  const validationfn = () => validateNotEmpty(testInput, testErrorMessage);
  expect(validationfn).toThrow(testErrorMessage);
});
