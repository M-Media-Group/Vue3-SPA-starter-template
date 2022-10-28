describe("Guest auth pages redirect to home when logged in", () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/api/user", // that have a URL that matches '/users/*'
      },
      {
        body: {
          id: 1,
          username: "Michał",
          name: null,
          surname: null,
          email: "hello@test.com",
          email_verified_at: "2020-04-27 20:23:57",
          avatar: null,
          seen_at: "2022-10-27 20:10:14",
          created_at: "2019-05-18T12:52:32.000000Z",
          updated_at: "2022-10-27T18:10:14.000000Z",
          description: "I’m the founder",
          is_public: false,
        },
      }
    ).as("getUser");
  });

  it("Redirects home from login if the user is already authenticated", () => {
    cy.visit("/login");
    // The path should be just "/"
    cy.location("pathname").should("eq", "/");
  });
  it("Redirects home from register if the user is already authenticated", () => {
    cy.visit("/sign-up");
    // The path should be just "/"
    cy.location("pathname").should("eq", "/");
  });
  it("Redirects home from password-reset if the user is already authenticated", () => {
    cy.visit("/forgot-password");
    // The path should be just "/"
    cy.location("pathname").should("eq", "/");
  });
});

describe("Login", () => {
  // Before each, we expect a <form> element to exist
  // with a <button> element inside of it.
  beforeEach(() => {
    cy.visit("/login");
    cy.get("form").should("exist");
    cy.get("button").should("exist");

    // The email input should be focused
    cy.focused().should("have.attr", "name", "email");

    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/email-exists/success@stripe.com", // that have a URL that matches '/users/*'
      },
      { statusCode: 200 }
    ).as("emailExists");
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/email-exists/fail@stripe.com", // that have a URL that matches '/users/*'
      },
      { statusCode: 404 }
    ).as("emailDoesNotExist");
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/register", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 422,
        body: {
          message: "The given data was invalid.",
          errors: {
            email: ["This email is not formatted correctly."],
          },
        },
      }
    ).as("badRegistrationEmail");
  });

  it("Fail to login with both inputs missing", () => {
    // Assert the form element exists
    cy.get("form").should("exist");

    // Assert that the input is invalid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: true,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Assert that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");

    // Assert that the form is invalid
    // cy.get("form").invoke("prop", "validity").should("deep.include", {
    //   valueMissing: true,
    //   typeMismatch: false,
    //   patternMismatch: false,
    //   tooLong: false,
    //   tooShort: false,
    //   rangeUnderflow: false,
    //   rangeOverflow: false,
    //   stepMismatch: false,
    //   badInput: false,
    //   customError: false,
    //   valid: false,
    // });

    // Check that the error message is displayed
    // cy.contains("Please enter your email address");
  });

  it("Fail to login with invalid email", () => {
    // This is actually a valid email when just relying on the type="email" of an input, so we need to add a pattern and here we test for that
    cy.get("input[type=email]").type("test@invalid");

    // Assert that the input is invalid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: true,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Assert that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Fail to login when email is valid but password is empty", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Assert that the input is valid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      });

    // Assert that the form is valid
    // cy.get("form").invoke("prop", "validity").should("deep.include", {
    //   valueMissing: true,
    //   typeMismatch: false,
    //   patternMismatch: false,
    //   tooLong: false,
    //   tooShort: false,
    //   rangeUnderflow: false,
    //   rangeOverflow: false,
    //   stepMismatch: false,
    //   badInput: false,
    //   customError: false,
    //   valid: false,
    // });

    // Assert that the submit button is not disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that form should only have 1 input (password)
    cy.get("input").should("have.length", 1);

    // The password input should be focused
    cy.focused().should("have.attr", "name", "password");

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    // Check that the password field is invalid
    cy.get("input[type=password]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: true,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");

    // Confirm there is a data-cy button back
    cy.get("[data-cy=back]").should("exist");
  });

  it("Shows a forgot password link on the password screen", () => {
    cy.get("input[type=email]").type("success@stripe.com");
    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    // Check that there is a forgot password
    cy.contains("Forgot password?").should("exist");
  });

  it("Fails login on invalid credentials", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that form should only have 1 input (password)
    cy.get("input").should("have.length", 1);

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    cy.get("input[type=password]").type("password");

    // Check that the password field is invalid
    cy.get("input[type=password]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      });

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // When pressing submit, a request to /login should be made
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/login", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 422,
        body: {
          message: "The given data was invalid.",
          errors: {
            email: ["These credentials do not match our records."],
          },
        },
      }
    ).as("login");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the request to /login was made
    cy.wait("@login");

    // The password field should be cleared
    cy.get("input[type=password]").should("have.value", "");

    // The button should be disabled
    cy.get("button[type=submit]").should("be.disabled");

    // Confirm there is a data-cy button back
    cy.get("[data-cy=back]").should("exist");
  });

  it("Logs in", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that form should only have 1 input (password)
    cy.get("input").should("have.length", 1);

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    cy.get("input[type=password]").type("password");

    // Check that the password field is invalid
    cy.get("input[type=password]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      });

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // When pressing submit, a request to /login should be made
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/login", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 200,
      }
    ).as("login");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the request to /login was made
    cy.wait("@login");
  });

  it("The back button should be present on second pages and, when navigating back, the original submit should not be disabled", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Assert that the input is valid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      });

    // Assert that the form is valid
    // cy.get("form").invoke("prop", "validity").should("deep.include", {
    //   valueMissing: true,
    //   typeMismatch: false,
    //   patternMismatch: false,
    //   tooLong: false,
    //   tooShort: false,
    //   rangeUnderflow: false,
    //   rangeOverflow: false,
    //   stepMismatch: false,
    //   badInput: false,
    //   customError: false,
    //   valid: false,
    // });

    // Assert that the submit button is not disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");

    // Confirm there is a data-cy button back
    cy.get("[data-cy=back]").should("exist").should("not.be.disabled").click();

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // Check that the email is now focused again
    cy.focused().should("have.attr", "name", "email");
  });
});

describe("Register", () => {
  // Before each, we expect a <form> element to exist
  // with a <button> element inside of it.
  beforeEach(() => {
    cy.visit("/sign-up");
    cy.get("form").should("exist");
    cy.get("button").should("exist");

    // The email input should be focused
    cy.focused().should("have.attr", "name", "email");

    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/email-exists/success@stripe.com", // that have a URL that matches '/users/*'
      },
      { statusCode: 200 }
    ).as("emailExists");
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/email-exists/fail@stripe.com", // that have a URL that matches '/users/*'
      },
      { statusCode: 404 }
    ).as("emailDoesNotExist");
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/register", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 422,
        body: {
          message: "The given data was invalid.",
          errors: {
            email: ["This email is not formatted correctly."],
          },
        },
      }
    ).as("badRegistrationEmail");
  });

  it("Shows registration when email not found", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Assert that the input is valid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      });

    // Assert that the form is valid
    // cy.get("form").invoke("prop", "validity").should("deep.include", {
    //   valueMissing: true,
    //   typeMismatch: false,
    //   patternMismatch: false,
    //   tooLong: false,
    //   tooShort: false,
    //   rangeUnderflow: false,
    //   rangeOverflow: false,
    //   stepMismatch: false,
    //   badInput: false,
    //   customError: false,
    //   valid: false,
    // });

    // Assert that the submit button is not disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that form should only have 1 input (password)
    cy.get("input").should("have.length", 3);

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    // Check that there is an input with the name of "name"
    cy.get("input[name=name]").should("exist");
    cy.get("input[name=surname]").should("exist");

    // The password input should be focused
    cy.focused().should("have.attr", "name", "name");

    // Check that the password field is invalid
    cy.get("input[type=password]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: true,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Check that the name field is invalid
    cy.get("input[name=name]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: true,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Check that the name field is invalid
    cy.get("input[name=surname]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: true,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Fails registration when no name or surname input", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the form has 3 inputs
    cy.get("input").should("have.length", 3);

    // Confirm that the name and surname inputs exist
    cy.get("input[name=name]").should("exist");
    cy.get("input[name=surname]").should("exist");

    // Confirm that both require 2 characters or more
    cy.get("input[name=name]").type("a");
    cy.get("input[name=surname]").type("a");

    // Check that the name field is invalid
    cy.get("input[name=name]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: true,
        tooLong: false,
        // Cant use tooShort here - needed to trigger validity on non-dirty (script added) inputs, see https://stackoverflow.com/a/53261163/7410951
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Check that the surname field is invalid
    cy.get("input[name=surname]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: true,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
      });

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");

    // Check that the form has 3 inputs
    cy.get("input").should("have.length", 3);
  });

  it("Shows custom errors on name, email, and password fields when they are returned from the server", () => {
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/register", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 422,
        body: {
          message: "The given data was invalid.",
          errors: {
            name: "The name is not correct, according to the server",
            surname: "The surname is not correct, according to the server",
            password: "The password is not correct, according to the server",
          },
        },
      }
    ).as("badRegistrationEmail");

    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Input the name, surname, and password
    cy.get("input[name=name]").type("John");
    cy.get("input[name=surname]").type("Doe");
    cy.get("input[type=password]").type("password123");

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");

    // Check that the form has 3 inputs
    cy.get("input").should("have.length", 3);

    cy.get("input[name=name]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: true,
        valid: false,
      });

    cy.get("input[name=surname]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: true,
        valid: false,
      });

    cy.get("input[name=password]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: true,
        valid: false,
      });
  });

  it("Returns to email screen after submission of registration form with bad email", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Confirm that both require 2 characters or more
    cy.get("input[name=name]").type("Alex");
    cy.get("input[name=surname]").type("Dissen");
    cy.get("input[name=password]").type("mySecurePassword");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the form has 1 input
    cy.get("input").should("have.length", 1);

    // The email input should be invalid
    cy.get("input[type=email]")
      .invoke("prop", "validity")
      .should("deep.include", {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: true,
        valid: false,
      });

    // Typing a new email should make the form valid
    cy.get("input[type=email]").clear();
    cy.get("input[type=email]").type("ok@stripe.com");
    cy.get("button[type=submit]").should("not.be.disabled");
  });
});

describe("Reset password", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("Sends an email", () => {
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/forgot-password", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 200,
      }
    );
    // Get the input of type email
    cy.get("input[type=email]").type("test@test.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that a .success message is shown
    cy.get(".success").should("be.visible");

    // The submit should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });
});

describe("Confirm email", () => {
  it("Redirects to login when unauthenticated", () => {
    cy.visit("/confirm-email");
    cy.url().should("include", "/login");
  });

  it("Shows a message requesting email confirmation", () => {
    // Intercept the call to api/user
    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/api/user", // that have a URL that matches '/users/*'
      },
      {
        body: {
          id: 1,
          username: "Michał",
          name: null,
          surname: null,
          email: "hello@test.com",
          email_verified_at: "2020-04-27 20:23:57",
          avatar: null,
          seen_at: "2022-10-27 20:10:14",
          created_at: "2019-05-18T12:52:32.000000Z",
          updated_at: "2022-10-27T18:10:14.000000Z",
          description: "I’m the founder",
          is_public: false,
        },
      }
    ).as("getUser");

    cy.visit("/");

    // Wait for the request to finish

    cy.visit("/confirm-email");

    // There should be a "Resend email" button
    cy.get("button[type=submit]").should("be.visible");

    // The button should have "Resend"
    cy.get("button[type=submit]").should("contain", "Resend");
  });

  it("Allows requesting of new verification email", () => {
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: "/email/verification-notification", // that have a URL that matches '/users/*'
      },
      {
        statusCode: 202,
      }
    ).as("resendEmail");

    // There should be a "Resend email" button
    cy.get("button[type=submit]").should("be.visible");

    // Click the button
    cy.get("button[type=submit]").click();

    // There should be an intercept on resendEmail
    cy.wait("@resendEmail").then((interception) => {
      expect(interception.response?.statusCode).to.equal(202);
    });

    // There should be a success message
    cy.get(".success").should("be.visible");
  });
});
