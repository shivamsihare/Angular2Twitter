import {SignedComponent} from "./signed/signed.component";
import {TwitterService} from "./twitter.service";

import {CallbackComponent} from "./callback.component";
import {Transition} from "@uirouter/angular";

export const callbackState = {
  name: 'callback',
  url: '/callback?oauth_token&oauth_verifier',
  component: CallbackComponent,
  resolve: [
    {
      token: 'tokens',
      deps: [Transition,TwitterService],
      resolveFn: function(trans,twitterSvc) { twitterSvc.saveTokenVerifier(trans.params().oauth_token,trans.params().oauth_verifier);}
    }
  ]
};

export const signedState = {
  name: 'callback.signedNoQ',
  url: '/signed',
  component: SignedComponent
};

export const signedUserState = {
  name: 'callback.signed',
  url: '/signed/:personId',
  component: SignedComponent,
  resolve: [
    {
      token: 'posts',
      deps: [Transition, TwitterService],
      resolveFn: function(trans, twitterSvc){ twitterSvc.getUserTimeline(trans.params().personId);}
    }
  ]
};

