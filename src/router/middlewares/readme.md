# The middleware logic

## Example usage
Imagine we want to prevent a user action based on if they have enough kittens (we'll consider 5 to be enough in this case).

First, we'd define a middleware that checks if the user has enough kittens. If they do not, it should return `fail()`.

We'll call our middleware `userHasKittens` and extend the `baseMiddleware` class. Finally, we'll put it in the `router/middlewares` folder.

We'll also define the `form` to be used in case the middleware fails. In this case, we want the user to add kittens, so we will return the `AddKittens` form.

```javascript
import baseMiddleware from "./baseMiddleware";

class userHasKittens extends baseMiddleware {

  // The form is what the user will see if the middleware fails
  form = "AddKittens";

  // This is the core action of the middleware. It determines if the middleware passes or a form should be displayed
  async handle() {
    if (user.kittens.length < 5) {
      return this.fail();
    }
  }
}

// This is our middleware instance. Defining only one is OK in this case - its not subject to change so a "singleton type" approach works in our favor.
const middleware = new userHasKittens();

// Finally we export the middleware so that it can be used by our handler. Our handler will pass it options, so we must make sure to set them before running the middleware itself
export default (options) => {
  return middleware.setOptions(options).handle();
};
```

The middleware is defined and ready to be used.

To protect a route, you could pass your middleware name into the `meta.middleware` array in your route, like so:

```javascript
 {
    path: "/kitten-party",
    name: "kitten-party",
    component: () => import("../views/KittenParty.vue"),
    meta: {
      middleware: ["userHasKittens"],
    },
  },
```

You'll notice `middleware` is an array, which means you can pass multiple middlewares and they will run one after the other, stopping the execution if one of them fails. In this case, it could be a good idea to also add an authentication-check middleware before ours, for example.

We can also protect in-component actions too, using the `ConfirmsMiddleware` element.
```html
<ConfirmsMiddleware
    :title="$t('Add kittens')"
    :middleware="['userHasKittens']"
    @confirmed="submitVote()"
>
    <button>Vote for best kitty</button>
</ConfirmsMiddleware>
```

This will show a modal if the middleware fails. The modal itself will have the form displayed inside it (the same one we defined in our middleware).

When they have enough kittens, the `confirmed` component event will fire. If the user already had enough kittens to begin with, then the `confirmed` event would be fired without opening the modal.

## Defining a middleware class

The middleware class

### Properties
#### form: string | false
The form element to use in order to make this middleware pass. You should either pass a string to a form name (filename) of a form in `/src/forms/`, or `false` if no form exists.

Note that middleware that return `false` will not continue any navigation or logic - it is essentially a "cancel" event. Because of this, you should also define the `route` function so that users attempting to access a page directly do not see a blank page.

### Functions

#### handle: fail() | undefined
The main middleware handler. If the middleware should NOT pass, then you should return `this.fail()`, otherwise, do not return anything.

#### route: RouteLocationRaw | false
This function is optional.

If not defined and the middleware is intercepted by a route request, it will be redirected to the path `/confirm/:form()` where `:form()` is the name of the form to use. That route will automatically resolve and display the form, and then continue the navigation once the form is completed.

If you would like to redirect elsewhere, you should override the `route` function in your middleware and return a `RouteLocationRaw`.

#### setOptions
You should not override this function. It sets the options available to the middleware. This function should be called before you call the `handle()` function.