import { describe, it, expect } from "vitest";

import { HttpError, ValidationError } from "./errors";

describe("class HttpError", () => {
  
  it("should contain the provided status code message and data", () => {
    
    const testStatus = 200;
    const testMessage = "test";
    const testData = { key: "test" };
   
    const testError = new HttpError(testStatus, testMessage, testData);
    expect(testError.statusCode).toBe(testStatus);
    expect(testError.message).toBe(testMessage);
    expect(testError.data).toBe(testData);
  });

 
  it("should contain undefined as data if no data is provided", () => {
    const testStatus = 200;
    const testMessage = "test";
    

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
