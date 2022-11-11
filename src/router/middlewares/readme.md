# The middleware logic
This starter kit comes with an opinionated middleware handler. It allows you to protect routes and actions using middlewares defined in a single place.

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

### Route level protection

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

### Component level protection

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
When a user clicks the `Vote for best kitty` button, their click will be intercepted by the `ConfirmsMiddleware` component, which will check each middleware.

If a middleware fails, a modal will be shown. The modal itself will have the form displayed inside it (the same one we defined in our middleware).

When the user has enough kittens added, the `confirmed` component event will fire and the modal will close. If the user already had enough kittens to begin with, then the `confirmed` event would be fired without opening the modal.

## The middleware class

The middleware class defines the logic of your middleware.

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

## The middleware handler
The middleware handler is already set up for you for the Router and in the `ConfirmsMiddleware` component.

The middleware handler itself takes an array of middleware names and runs through each of them. As a second parameter, you can pass in optional options. Calling the `handle()` function will execute all the middlewares passed to the handler.

```javascript
const response = await new MiddlewareHandler(['auth', 'userHasKittens'], options).handle();
```

If all middlewares pass, the response will be `undefined`. If the middleware should stop execution, it will return `false`. If you pass an instance of `RouteLocationNormalized` to the `options`, the handler will automatically detect that it should respond with a redirect if it fails. Otherwise, it will return a `string` containing the name of the form to display.