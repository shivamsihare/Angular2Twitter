import {CallbackComponent} from './callback.component';
import {TwitterService} from './twitter.service';
import {SignedComponent} from './signed/signed.component';
import {Transition} from '@uirouter/angular';
export class States {
    static callbackState = {
        name: 'callback',
        url: '/callback?oauth_token&oauth_verifier',
        component: CallbackComponent,
        resolve: [
            {
                token: 'tokens',
                deps: [Transition, TwitterService],
                resolveFn: States.callback
            }
        ]
    };
    static signedState = {
        name: 'callback.signedNoQ',
        url: '/signed',
        component: SignedComponent
    };
    static signedUserState = {
        name: 'callback.signed',
        url: '/signed/:personId',
        component: SignedComponent,
        resolve: [
            {
                token: 'posts',
                deps: [Transition, TwitterService],
                resolveFn: States.signedUser
            }
        ]
    };


    public static callback(trans, TS): void {
        TS.saveTokenVerifier(trans.params().oauth_token, trans.params().oauth_verifier);
    }

    public static signedUser(trans, twitterSvc) {
        twitterSvc.getUserTimeline(trans.params().personId);
    }
}

