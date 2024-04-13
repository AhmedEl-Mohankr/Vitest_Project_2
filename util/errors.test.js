import { describe, it, expect } from "vitest";

import { HttpError, ValidationError } from "./errors";

describe("class HttpError", () => {
  //this test will check if the http error has the status code, message and data
  it("should contain the provided status code message and data", () => {
    //create 3 constants for status code, message and data arugments.
    const testStatus = 200;
    const testMessage = "test";
    const testData = { key: "test" };
    // store the new HttpError in a variable called testError to test the new status, message and data
    const testError = new HttpError(testStatus, testMessage, testData);
    expect(testError.statusCode).toBe(testStatus);
    expect(testError.message).toBe(testMessage);
    expect(testError.data).toBe(testData);
  });

  //This test to make sure that we don't want any default fallback data but instead have undefined
  it("should contain undefined as data if no data is provided", () => {
    const testStatus = 200;
    const testMessage = "test";
    // const testData = { key: "test" }; //This will be removed

    const testError = new HttpError(testStatus, testMessage); //test data will be removed also

    expect(testError.statusCode).toBe(testStatus);
    expect(testError.message).toBe(testMessage);
    expect(testError.data).toBeUndefined(); //this means undefined
  });
});

describe("class ValidationError", () => {
  it("should contain the provided message", () => {
    const testMessage = "test message";
    const testError = new ValidationError(testMessage);
    expect(testError.message).toBe(testMessage);
  });
});
