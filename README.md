# Angular Twitter

* This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.3. 
* It is built on Angular. 
* Uses Material Design and Flexbox.

Make an app on Twitter api [here](https://apps.twitter.com/). Provide callback url as "http://localhost:4200/callback".

Add `keys.ts` to `<Project Directory>/src/app/`. It should contain following code.

```
export const KEYS = {
  'oauth_consumer_key' : "<YOUR CONSUMER KEY GOES HERE>",
  'oauth_consumer_secret': "<YOUR CONSUMER SECRET GOES HERE>"
};
```

Find the `Consumer Key` and `Oauth Consumer Secret` on your app on twitter api.

## Installing and Running
```
npm install
ng serve
```

This application has been executed on Mac with chrome browser.
There may be `CORS(HTTP 400)` issue with chrome, for workaround look [here](http://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome).

