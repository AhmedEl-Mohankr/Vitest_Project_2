import { HttpError } from "./errors.js";

export async function sendDataRequest(data) {
  const response = await fetch("https://dummy-site.dev/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //body: data,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    //throw new Error('Error'); // if we change the code to this, the second test will fail as we are expecting a type error of HttpError and not Error
    throw new HttpError(
      response.status,
      "Sending the request failed.",
      responseData
    );
  }

  return responseData;
}
