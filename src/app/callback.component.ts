import {Component, Input, NgModule, OnInit} from '@angular/core';
import {TwitterService} from './twitter.service';
import {SignInSuccessService} from './sign-in-success.service';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule, UIRouter} from '@uirouter/angular';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
    moduleId: MyModule.id,
    selector: 'app-callback',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    templateUrl: 'callback.component.html',
    styleUrls: ['callback.component.css']
})

export class CallbackComponent implements OnInit {
    @Input() tokens;
    location: Location;

    constructor(private twitterService: TwitterService,
                private signInSuccess: SignInSuccessService,
                private uiRouter: UIRouter,
                location: Location) {
        this.location = location;
    }


    ngOnInit(): void {

        this.uiRouter.stateService.go('callback.signedNoQ', null);
        console.log(this.twitterService.token, this.twitterService.verifier);
        if (this.twitterService.token == null || this.twitterService.verifier == null) {
            console.log("could not get token and verifier", this.tokens);
        }
        else {
            this.twitterService.getAccessToken().then(response => {
                console.log("response in callback: ", response);
                let temp = response["_body"];
                let param = temp.split('&');
                let keyValue = {};
                param.forEach(function (el) {
                    console.log("Formatting Data el: ", el);
                    var user = el.split('=');
                    keyValue[user[0]] = user[1];
                });
                console.log("Formatting Data keyValue: ", keyValue);
                this.twitterService.userInfo = keyValue;
                this.twitterService.getUserData().then(response => {
                    this.signInSuccess.hide = true;
                    this.twitterService.data = JSON.parse(response["_body"]);
                    this.twitterService.allData = JSON.stringify(this.twitterService.data, null, 4);
                    console.log("Here is the UserData", this.twitterService.data);
                    //console.log("Hi this is all data", this.allData);
                    //console.log("newest hide", this.signInSuccess.hide);
                    //this.router.navigate(['/signed']);
                }).catch(TwitterService.handleError);
                /*this.twitterService.fetchTimeline().then(response=>{
                 console.log(response);
                 this.twitterService.arrOfPosts=JSON.parse(response["_body"]);
                 }).catch();*/
                this.twitterService.getLocationAndTrends();
                this.twitterService.getSuggestedUsers();
                this.location.go('callback/signed');
            }).catch(TwitterService.handleError);
        }
    }


    followUser(user: string): void {
        this.twitterService.followUser(user);
    }
}
