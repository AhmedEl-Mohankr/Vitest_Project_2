import { describe, it, expect, vi } from "vitest";
import { sendDataRequest } from "./http";
import { HttpError } from "./errors";

const testResponseData = { testKey: "testData" };

//This is the replacement for the fetch function.
const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.body !== typeof "string") {
      return reject("Not a string.");
    }
    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});
vi.stubGlobal("fetch", testFetch); //This method is to replace global objects / functions.


it("should return any available response data", () => {
  const testData = { key: "test" };
  return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData);
});


it("should convert the provided data to JSON before sending the request", async () => {
  const testData = { key: "test" };

  let errorMessage; //Undefined
  try {
    await sendDataRequest(testData);
  } catch (error) {
    errorMessage = error;
  }
  expect(errorMessage).not.toBe("Not a string.");
});

it("should throw an httpError in case of non-ok responses", () => {
  testFetch.mockImplementationOnce((url, options) => {
  return new Promise((resolve, reject) => {
    const testResponse = {
      ok: false,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});
  const testData = { key: "test" };
  return expect(sendDataRequest(testData)).rejects.toBeInstanceOf(HttpError);
});
