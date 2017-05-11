import {Component,NgModule} from '@angular/core';
import {TwitterService} from "./twitter.service";
import {Router} from "@angular/router";
import {SignInSuccessService} from "./sign-in-success.service";
import 'hammerjs';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule} from 'ui-router-ng2';

@Component({
  moduleId: MyModule.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Access Twitter Using angular 2!';
  token:string;
  verifier:string;

  constructor(
    private twitterService:TwitterService,
    private signInService:SignInSuccessService,
  ){}


  startSignInFlow():void{
    let tempStr:string;
    let self = this;
    this.twitterService.onSignIn().then(function (response) {
      tempStr = response["_body"];
      let a = tempStr.indexOf("&");
      let token = tempStr.substr(0,a);
      window.location.href = "https://api.twitter.com/oauth/authenticate?"+token;
    });
  }

}
