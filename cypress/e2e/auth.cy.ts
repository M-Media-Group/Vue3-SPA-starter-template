describe("Guest auth pages redirect to home when logged in", () => {
  beforeEach(() => {
    cy.handleCsrf();
    cy.handleAuthenticatedUser();
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
    cy.handleCsrf();

    cy.handleUnauthenticatedUser();

    cy.intercept(
      {
        method: "POST",
        pathname: "/email-exists/success@stripe.com",
      },
      { statusCode: 200 }
    ).as("emailExists");
    cy.intercept(
      {
        method: "POST",
        pathname: "/email-exists/fail@stripe.com",
      },
      { statusCode: 404 }
    ).as("emailDoesNotExist");

    cy.visit("/login");
    cy.get("form").should("exist");
    cy.get("button").should("exist");

    // The email input should be focused
    cy.focused().should("have.attr", "name", "email");
  });

  it("Fail to login with both inputs missing", () => {
    // Assert the form element exists
    cy.get("form").should("exist");

    // Assert that the input is invalid
    cy.get("input[type=email]").invalidFor(["valueMissing"]);

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
    cy.get("input[type=email]").invalidFor(["patternMismatch"]);

    // Assert that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Fails to login with a 500 server response", () => {
    cy.intercept("POST", "/email-exists/test@invalid.com123", {
      statusCode: 500,
    }).as("serverError");

    // Fill in the form
    cy.get("input[type=email]").type("test@invalid.com123");

    // Click the submit button
    cy.get("button[type=submit]").click();

    // There should still be the email input
    cy.get("input[type=email]").should("exist");

    // The button should not be disabled
    cy.get("button[type=submit]").should("not.be.disabled");
  });

  it("Fail to login when email is valid but password is empty", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Assert that the input is valid
    cy.get("input[type=email]").invalidFor([]);

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

    // While loading, the button should have an attribute of aria-busy
    cy.get("button[type=submit]").should("have.attr", "aria-busy", "true");
    // It should also be disabled
    cy.get("button[type=submit]").should("be.disabled");

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");

    // The password input should be focused
    cy.focused().should("have.attr", "type", "password");

    cy.get("input[name=name]").should("not.exist");

    // Check that the password field is invalid
    cy.get("input[type=password]").invalidFor(["valueMissing"]);

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

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");
    cy.get("input[name=name]").should("not.exist");

    cy.get("input[type=password]").type("password");

    // Check that the password field is valid
    cy.get("input[type=password]").invalidFor([]);

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // When pressing submit, a request to /login should be made
    cy.intercept(
      {
        method: "POST",
        pathname: "/login",
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

    // Assert that somehwere on the page there is a Login text
    // cy.contains("Login");

    // Check that there is a password field
    cy.get("input[type=password]").should("exist");
    cy.get("input[name=name]").should("not.exist");

    cy.get("input[type=password]").type("password");

    // Check that the password field is valid
    cy.get("input[type=password]").invalidFor([]);

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("not.be.disabled");

    // When pressing submit, a request to /login should be made
    cy.intercept(
      {
        method: "POST",
        pathname: "/login",
      },
      {
        statusCode: 200,
      }
    ).as("login");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Confirm that the login request contained a header with X-XSRF-TOKEN
    // @todo make a CSRF check test, the below doesnt work. We need to also do it on registration
    // cy.wait("@login")
    //   .its("request.headers")
    //   .should("have.property", "X-XSRF-TOKEN", "token");

    // We should be redirected to the dashboard
    cy.location("pathname").should("eq", "/");
  });

  it("Logs in and redirects when a redirect is supplied", () => {
    cy.visit("/settings");

    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    cy.get("input[type=password]").type("password");

    // When pressing submit, a request to /login should be made
    cy.intercept(
      {
        method: "POST",
        pathname: "/login",
      },
      {
        statusCode: 200,
      }
    ).as("login");

    cy.handleAuthenticatedUser();

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // We should be redirected to the dashboard
    cy.location("pathname").should("eq", "/settings");
  });

  it("The back button should be present on second pages and, when navigating back, the original submit should not be disabled", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Assert that the input is valid
    cy.get("input[type=email]").invalidFor([]);

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
    cy.handleCsrf();

    cy.handleUnauthenticatedUser();

    cy.intercept(
      {
        method: "POST",
        pathname: "/email-exists/success@stripe.com",
      },
      { statusCode: 200 }
    ).as("emailExists");
    cy.intercept(
      {
        method: "POST",
        pathname: "/email-exists/fail@stripe.com",
      },
      { statusCode: 404 }
    ).as("emailDoesNotExist");
    cy.intercept(
      {
        method: "POST",
        pathname: "/register",
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

    cy.visit("/sign-up");
    cy.get("form").should("exist");
    cy.get("button").should("exist");

    // The email input should be focused
    cy.focused().should("have.attr", "name", "email");
  });

  it("Shows registration when email not found", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

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
    cy.get("input[type=password]").invalidFor(["valueMissing"]);

    // Check that the name field is invalid
    cy.get("input[name=name]").invalidFor(["valueMissing"]);

    cy.get("input[name=surname]").invalidFor(["valueMissing"]);

    // Check that the submit button is disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Fails registration when no name or surname input", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Confirm that the name and surname inputs exist
    cy.get("input[name=name]").should("exist");
    cy.get("input[name=surname]").should("exist");

    // Check that the accept TOC exists
    cy.get("input[type=checkbox]").should("exist");

    // Confirm that both require 2 characters or more
    cy.get("input[name=name]").type("a");
    cy.get("input[name=surname]").type("a");

    // Check that the name field is invalid
    // Cant use tooShort here - needed to trigger validity on non-dirty (script added) inputs, see https://stackoverflow.com/a/53261163/7410951
    cy.get("input[name=name]").invalidFor(["patternMismatch"]);

    // Check that the surname field is invalid
    cy.get("input[name=surname]").invalidFor(["patternMismatch"]);

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");
  });

  it("Shows custom errors on name, email, and password fields when they are returned from the server", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/register",
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
    // Check the checkbox
    cy.get("input[type=checkbox]").check();

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");

    cy.get("input[name=name]").invalidFor(["customError"]);

    cy.get("input[name=surname]").invalidFor(["customError"]);

    cy.get("input[type=password]").invalidFor(["customError"]);
  });

  it("Returns to email screen after submission of registration form with bad email", () => {
    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Confirm that both require 2 characters or more
    cy.get("input[name=name]").type("Alex");
    cy.get("input[name=surname]").type("Dissen");
    cy.get("input[type=password]").type("mySecurePassword");
    // Check the checkbox
    cy.get("input[type=checkbox]").check();

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // The email input should be invalid
    cy.get("input[type=email]").invalidFor(["customError"]);

    // Typing a new email should make the form valid
    cy.get("input[type=email]").clear();
    cy.get("input[type=email]").type("ok@stripe.com");
    cy.get("button[type=submit]").should("not.be.disabled");
  });

  it("Can register", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/register",
      },
      {
        statusCode: 201,
      }
    ).as("goodRegistration");

    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Add a name, surname, and password, and check the checkbox
    cy.get("input[name=name]").type("John");
    cy.get("input[name=surname]").type("Doe");
    cy.get("input[type=password]").type("password123");
    cy.get("input[type=checkbox]").check();

    cy.handleAuthenticatedUser();

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");

    // Confirm we are redirected to the "/" path
    cy.location("pathname").should("eq", "/");

    // Confirm that the navigation bar does not have a link to the login page
    cy.get("a[href='/login']").should("not.exist");
  });

  it("Registers and redirects when redirect supplied", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/register",
      },
      {
        statusCode: 201,
      }
    ).as("goodRegistration");

    cy.visit("/settings");

    // Get the input of type email
    cy.get("input[type=email]").type("fail@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Add a name, surname, and password, and check the checkbox
    cy.get("input[name=name]").type("John");
    cy.get("input[name=surname]").type("Doe");
    cy.get("input[type=password]").type("password123");
    cy.get("input[type=checkbox]").check();

    cy.handleAuthenticatedUser();

    // Submit the form by pressing enter on the name field
    cy.get("input[name=name]").type("{enter}");

    // We should be redirected to the dashboard
    cy.location("pathname").should("eq", "/settings");
  });
});

describe("Reset password", () => {
  beforeEach(() => {
    cy.handleCsrf();
    cy.handleUnauthenticatedUser();

    cy.visit("/forgot-password");
    cy.focused().should("have.attr", "type", "email");
  });
  it("Shows errors", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/forgot-password",
      },
      {
        statusCode: 422,
        body: {
          message: "Please wait before retrying.",
          errors: {
            email: ["Please wait before retrying."],
          },
        },
      }
    ).as("forgotPassword");
    // Get the input of type email
    cy.get("input[type=email]").type("test@test.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that the validity fails
    cy.get("input[type=email]").invalidFor(["customError"]);
  });

  it("Sends an email", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/forgot-password",
      },
      {
        statusCode: 200,
      }
    ).as("forgotPassword");
    // Get the input of type email
    cy.get("input[type=email]").type("test@test.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that a .success message is shown
    cy.get(".success").should("be.visible");

    // The submit should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Shows reset password page", () => {
    cy.visit("/reset-password?token=xxx&email=test@test.com");

    // There should be a password input
    cy.get("input[type=password]").should("be.visible");

    // There should be a disabled submit button
    cy.get("button[type=submit]").should("be.visible").should("be.disabled");

    // The input should be focused
    cy.focused().should("have.attr", "type", "password");
  });

  it("Fails to reset password with invalid token", () => {
    cy.visit("/reset-password?token=xxx&email=test@test.com");

    cy.intercept("POST", "/reset-password", {
      statusCode: 422,
      body: {
        message: "This password reset token is invalid.",
        errors: {
          email: ["This password reset token is invalid."],
        },
      },
    }).as("failResetPassword");

    // There should be a password input
    cy.get("input[type=password]").type("test");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that there is an error shown
    cy.get("input[type=password]").invalidFor(["customError"]);
  });

  it("Can reset password", () => {
    cy.visit("/reset-password?token=xxx&email=test@test.com");

    cy.intercept("POST", "/reset-password", {
      statusCode: 200,
      body: {
        message: "Your password has been reset!",
      },
    }).as("resetPassword");

    // Type a new password
    cy.get("input[type=password]").type("testNewPass");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Check that there is a .success message
    cy.get(".success").should("be.visible");

    // The submit should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Keeps the email when going from login to forgot password", () => {
    cy.intercept("POST", "/email-exists/success@stripe.com", {
      statusCode: 200,
    }).as("emailExists");

    cy.visit("/login");

    // Type an email
    cy.get("input[type=email]").type("success@stripe.com");

    // Press the submit button
    cy.get("button[type=submit]").click();

    // Press the forgot password link
    cy.get("a[href='/forgot-password']").click();

    // Check that the email is still there
    cy.get("input[type=email]").should("have.value", "success@stripe.com");
  });
});

describe("Confirm email", () => {
  beforeEach(() => {
    cy.handleCsrf();
    cy.handleUnauthenticatedUser();
  });

  it("Redirects to login when unauthenticated", () => {
    cy.visit("/confirm-email");
    cy.location("pathname").should("eq", "/login");
    // There should be a query param of redirect pointing to /confirm-email
    cy.location("search").should("eq", "?redirect=/confirm-email");
  });

  it("Redirects to home when already confirmed", () => {
    cy.handleAuthenticatedUser();

    cy.visit("/confirm-email");
    cy.location("pathname").should("eq", "/");
  });

  it("Shows email confirmation resend page", () => {
    // Intercept the call to api/user
    cy.intercept(
      { method: "GET", pathname: "/api/user" },
      {
        fixture: "userWithUnconfirmedEmail",
      }
    ).as("userWithUnconfirmedEmail");

    // Wait for the request to finish

    cy.visit("/confirm-email");

    // There should be a "Resend email" button
    cy.get("button[type=submit]").should("be.visible");

    // The button should have "Resend"
    cy.get("button[type=submit]").should("contain", "Resend");
  });

  it("Allows requesting of new verification email", () => {
    cy.intercept(
      { method: "GET", pathname: "/api/user" },
      {
        fixture: "userWithUnconfirmedEmail",
      }
    ).as("userWithUnconfirmedEmail");

    cy.intercept(
      {
        method: "POST",
        pathname: "/email/verification-notification",
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

describe("Logout", () => {
  beforeEach(() => {
    cy.handleCsrf();
    cy.handleAuthenticatedUser();
    cy.visit("/");
  });

  it("Logs out", () => {
    // Intercept the logout
    cy.intercept("POST", "/logout", {
      statusCode: 204,
    });

    cy.visit("/logout");

    // The user should be redirected to the login page
    cy.url().should("include", "/login");
  });
  it("Can log back in after logout", () => {
    // Intercept the logout
    cy.intercept("POST", "/logout", {
      statusCode: 204,
    });

    cy.visit("/logout");

    cy.intercept("POST", "/email-exists/success@stripe.com", {
      statusCode: 200,
    }).as("emailExists");

    // Get the input of type email
    cy.get("input[type=email]").type("success@stripe.com");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    cy.get("input[type=password]").type("password");

    // When pressing submit, a request to /login should be made
    cy.intercept("POST", "/login", {
      statusCode: 200,
    }).as("login");

    // Click the submit button to advance to the next screen
    cy.get("button[type=submit]").click();

    // Confirm that the login request contained a header with X-XSRF-TOKEN
    // @todo make a CSRF check test, the below doesnt work. We need to also do it on registration
    // cy.wait("@login")
    //   .its("request.headers")
    //   .should("have.property", "X-XSRF-TOKEN", "token");

    // We should be redirected to the dashboard
    cy.location("pathname").should("eq", "/");
  });
});

describe("Confirm password", () => {
  beforeEach(() => {
    cy.handleCsrf();

    cy.handleAuthenticatedUser();

    cy.visit("/confirm-password");
  });
  it("Shows a confirm password page", () => {
    // There should be a password input
    cy.get("input[type=password]").should("be.visible");

    // There should be a disabled submit button
    cy.get("button[type=submit]").should("be.visible").should("be.disabled");

    // The input should be focused
    cy.focused().should("have.attr", "type", "password");
  });

  it("It cannot be submitted if the password is empty", () => {
    // Clear the name input
    cy.get("input[type=password]").clear();

    // The submit button should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("It fails if password is incorrect", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/user/confirm-password",
      },
      {
        statusCode: 422,
        body: {
          message: "The provided password was incorrect.",
          errors: {
            password: ["The provided password was incorrect."],
          },
        },
      }
    ).as("checkPasswordFail");

    // Fill the password
    cy.get("input[type=password]").type("test");

    // Click submit
    cy.get("button[type=submit]").click();

    // There should be an error on the input
    cy.get("input[type=password]").invalidFor(["customError"]);
  });

  it("It can confirm password", () => {
    cy.intercept(
      {
        method: "POST",
        pathname: "/user/confirm-password",
      },
      { statusCode: 201, delay: 150 }
    ).as("checkPassword");

    // Fill the password
    cy.get("input[type=password]").type("test");

    // Click submit
    cy.get("button[type=submit]").click();

    // The submit should be disabled
    cy.get("button[type=submit]").should("be.disabled");

    // The user should be redirected once confirmed
    cy.location("pathname").should("eq", "/");
  });
});

describe("Edit user settings", () => {
  beforeEach(() => {
    cy.handleCsrf();
    cy.handleAuthenticatedUser();

    cy.intercept("PUT", "/user/profile-information", { statusCode: 200 }).as(
      "updateUser"
    );

    cy.visit("/settings");
  });
  it("Shows settings page", () => {
    // There should be a name, surname and email input
    cy.get("input[name=name]").should("be.visible");
    cy.get("input[name=surname]").should("be.visible");
    cy.get("input[type=email]").should("be.visible");

    // There should be a submit button
    cy.get("button[type=submit]").should("be.visible");
  });
  it("It cannot be submitted if the name is empty", () => {
    // Clear the name input
    cy.get("input[name=name]").clear();

    // The submit button should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });
  it("It cannot be submitted if the surname is empty", () => {
    // Clear the name input
    cy.get("input[name=surname]").clear();

    // The submit button should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });
  it("It cannot be submitted if the email is empty", () => {
    // Clear the name input
    cy.get("input[type=email]").clear();

    // The submit button should be disabled
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("Can be submitted", () => {
    // Get the submit button right after the email input
    cy.get("input[type=email]").parent().find("button[type=submit]").click();

    // Each input should have aria-invalid=false
    cy.get("input[name=name]")
      .first()
      .should("have.attr", "aria-invalid", "false");
    cy.get("input[name=surname]").should("have.attr", "aria-invalid", "false");
    cy.get("input[type=email]").should("have.attr", "aria-invalid", "false");
  });

  it("Redirects to email confirm when the email is changed", () => {
    cy.intercept(
      { method: "GET", pathname: "/api/user" },
      {
        fixture: "userWithUnconfirmedEmail",
        delay: 150,
      }
    ).as("userWithUnconfirmedEmail");

    cy.get("input[type=email]").clear();
    cy.get("input[type=email]").type("changed@test.com");

    cy.get("input[type=email]").parent().find("button[type=submit]").click();

    cy.url().should("include", "/confirm-email");
  });
});
