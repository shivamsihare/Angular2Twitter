import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {TwitterService} from "../twitter.service";
import {SignInSuccessService} from "../sign-in-success.service";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule} from 'ui-router-ng2';

@Component({
  selector: 'app-signed',
  templateUrl: 'signed.component.html',
  styleUrls: ['signed.component.css']
})
export class SignedComponent implements OnInit {
  @Input() posts;

  constructor(
    private twitterService:TwitterService,
    private signInSuccess:SignInSuccessService,
  ) { }

  ngOnInit() {
    console.log("Here are the posts Signed Component recieved: ",this.posts);
    if(this.posts){console.log("loaded with user");}else{
      this.twitterService.fetchTimeline();
    }
  }

  onClick(tweet):void{
    this.twitterService.clickOnTweetButton(tweet.value);
    tweet.value = null;
  }
}
