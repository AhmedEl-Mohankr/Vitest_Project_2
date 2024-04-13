import { describe, it, expect } from "vitest";
import { extractPostData } from "./posts";
/*
To test the extract function:
1- We will set up a testTitle and testContent and that will be the data inside the form
2- We will need to create a testformData object, a regular object 
3- This object has a get() method inside 
4- This get()accepts a key as an identifier and returns some value.
5- In the testFormData object, we will add key title which holds testTitle and a kay named content
which stores the testContent and then the get()method that we added previously.
6- We will return 'this' from the get()method and this is referring to this object seen
 from inside this get method, identifier.
 7- We are using [] the square brackets to dynamically access these different keys (title, content) 
 depending on which identifier was passed to get().
*/

// you can use this object as a global by using beforeEach().

describe("extractPostData", () => {
  /*
beforeEach(() => {
    testFormData = {
    title: testTitle,
    content: testContent,
    get(indentifier) { 
        return this[indentifier]; 
    },
    };
});
*/
  it("should extract title and content from the provided form data", () => {
    const testTitle = "Test title";
    const testContent = "Test content";
    //help object or testFormData Object
    const testFormData = {
      title: testTitle,
      content: testContent,
      get(identifier) {
        return this[identifier];
      },
    };
    // We are replacing the function value with our own fake values.
    const data = extractPostData(testFormData);
    expect(data.title).toBe(testTitle);
    expect(data.content).toBe(testContent);
  });
});
