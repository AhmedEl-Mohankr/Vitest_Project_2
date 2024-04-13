import { describe, it, expect, vi } from "vitest";
import { sendDataRequest } from "./http";
import { HttpError } from "./errors";
//Mock a global function.
/*
This is a great use case for Mocking because with that, we can get rid of the request
 function in http.js and we focus on the core function that we want test.

The following test is for testing that we can successfully send a request and responseData
 that is sent back from that API isn't the end returned after it was parsed by the sendDataRequest 
 function.

 1- We will create our test as usual and import sendDataRequest function from http.
 2- We need to make sure that the 'fetch' isn't really executed or that it is executed but it is not
 the original fetch function that it is built into the browser.
 3- Import 'vi' and we would have called it vi.mock.
 4- Then we pass a module name that should be replaced => 'fs'
 5- The problem here that fetch is a globally available function. It is not imported from any module.
 That's the difference. => Therefore, we can't use vi.mock to replace a module.

 6- What we can do instead is call another method provided on the vi object called 'stubGlobal()'
 ---- stubGlobal() method => This allow us to replace globally available objects / functions with
 our implementations.
 ----- We use stubGlobal() method by passing a string as the first argument and then as a value for 
 its string you use the name of the globally available object / function. 
 In the current case is 'fetch' => stubGlobal('fetch');
 --- The second argument is the replacement for this globally available API. In this case, that could
 be an empty function that should be used instead when fetch is called.
 7- We will create that replacement function by using vi.fn() so that I also have a function 
 which has this spy functionality, in case we need it. then we will pass it to a new constant called
 'testFetch'.
 8- Then use testFetch as the second argument for stubGlobal().
 9- We should tweak this function vi.fn() as we want to a certain behavior to make the test easier.
 10- Therefore, we will pass this argument to fn(). This will be the actual function that's used
 as a replacement for the fetch function for our tests.
 11- The fetch function takes two arguments ('The 'URL' to which the request is sent', An object that's used
 for configuring the request 'options object for configuring'). T
 12- fetch also returns => a promise for the await in http.js, Then we will will return new Promise
 13- We pass the promise function to the promise constructor Promise((resolve, reject) => {})
 14- Inside this promise function, we want to resolve some dummy object which in the end will contain
 the response (the fake testing response) which I want to simulate. But also some other data that's
 required.
 15- Therefore we will create a new constant called testResponse which will contain the object 
 which is what i resolved to.
 16- In this object we will set the ok key to true => ok: true. => Because we are checking this key 
 ===> if (!response.ok){we throw an error if it is not ok}.
 17- Beside this ok property, we should add a json adjacent method to this test response. Because
 we have that on the original response [  const responseData = await response.json();
] as well and we call it here to extract the responseData from 
 the response. So the data that was sent back from the backend. This also yield a promise. A new promise
 , it will be a nested promise.
 18- We pass a function to this promise that will take resolve and reject.
 19- Then resolve to some testTestResponseData but we will add this constant as a global constant
 which can have testKey and it its value will be testData. This will be just a response that we
 can use for evaluation in the nest promise for the resolve(testResponseData).
*/

//vi.mock(fs) => we couldn't use because fetch is a global function which is not imported from any module.

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

/*
After completing the replacement process, we will create testData constant that is sent along with
the request.
- Then pass the testData to the sendDataRequest function.
- Since testData yield a promise then we can return expect(sendDataRequest(testData));
- Then use resolves to wait for the promise to resolve then check the resolved value against 
something. 
- In http file, sendDataRequest will resolve to the unpacked and parsed responseData.
- WE WILL USE toEqual(testResponseData) so that is exactly an object with the properties and the values
set up in the global constant testResponseData {testKey: 'test'}.
- This test is used by the replacement fetch function does using use it such that the data we get
back is parsed by calling await response.json() and it returned as responseData.
- If we removed return responseData from http file, then our test will fail and return undefined 
because the data wouldn't be returned.
*/

it("should return any available response data", () => {
  const testData = { key: "test" };
  return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData);
});

/*
Now we can write more tests as we have this fetch mocking replacements.
We can check that our code is converting the provided data that we pass into send data request.
So our test data into JSON before sending it or as a process of sending it to the backend.
So we can test if we do have JSON.stringify because the real fetch function would fail to send
the request if we pass an non stringified JSON data to it.
so if we change the code in http.js from body: JSON.stringify(data), to body: data, 
If we leave it like that and created the following test:
1- We will use the same testData constant.
2- We can add some code to our replacement fetch function that allow me to find our whether 
the data was transformed.
3- Therefore, in the parent promise, and we will check if options.body (because we set the body
    of the outgoing request) may not be the type of 'string'. Json in the end is just text.That's why
    its type will be string.
 4- We are checking if the body I received here is not a string, we will reject(the promise). and we will
 use return before the rejection to not execute the test of this code.
 5- I will reject with a message of not a string.
 6- In our test, we will return expect sendDataRequest(testData).not.rejects because we don't want this
 to rejects and we could pass to rejects an error message.Or not expect it to reject at all.
7- We should also make sure when this rejects, it rejects to a string so we will use toBe('Not a string.').
==========> This test will succeed if sent data request is called with data and it doesn't reject to
this message.
8- However this test will fail even if we didn't adjust the body in http file because the test 
checks for this '' not rejecting with this string'' but it is still expect that to reject.
Note => The expect below is easy to misread as the test fails even if the promise does not reject.
Because it is expected to not rejected this value 'not a string' and not to not reject overall. 
And it will still reject as we are using 'rejects' below.
9- The better way to make this test rejects if is not a string and resolves if it is correct by using
(async) and instead of return expect, we will use await to wait for the response of calling, sendDataRequest.
10- Then wrapping this with try and catch method.
11- With that we can also catch if the Promise is rejects but also we are happy if it resolves.
12- We can now add an error message which is undefined.
13- We will set equal to the error we got for catch. So to the value that was provided after
 the promise was rejected.
 14- We can expect the error message not.toBe() a string.
*/
it("should convert the provided data to JSON before sending the request", async () => {
  const testData = { key: "test" };
  //   return expect(sendDataRequest(testData)).not.rejects.toBe("Not a string.");

  let errorMessage; //Undefined
  try {
    await sendDataRequest(testData);
  } catch (error) {
    errorMessage = error;
  }
  expect(errorMessage).not.toBe("Not a string.");
});

// The following test is for my sendDataRequest function should throw an httpError
//So if we get back a response object where this ok key [ok: true] is not true.
/*
To achieve this test:
1- We will need a testData [const testData = { key: "test" };]
2-  We need to check if whether my promise rejects.
3- We will need to return expect sendDataRequest(testData) to rejects. 
4- we want to make sure that the value I get when it is rejected is an instance of httpError.
So we will use toBeInstanceOf()
5- We will import HttpError from ./errors to pass it to toBeInstanceOf(HttpError) to check whether
the value we got after the promise was rejected is an instance of that clause.

However, this test will not work because we don't have a logic in the fetch replacement function
that would ever set ok value to false. 
---- Note: Adjusting the fetch function for just this test will not always the best practise as
we can't have ok value to be false. This can be done by some kind of conditional code but there
is a better solution.

Solution+ => Replace our test function => testFetch = vi.fn((url, options) =>{}); To be => A different value 
temporarily for the following test only. (Using MockImplementation Or MockImplementationOnce)
so it should be like this => testFetch,mockImplementationOnce() and we can use this method to implement
our replacement by adding a new value to testFetch only once (for the next call only)

- We will copy our original mock testFetch function but only starting (url, options) and not copying vi.fn
- We will remove the 'if condition' as it not needed for this test
-Then set ok value to false.
*/
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
