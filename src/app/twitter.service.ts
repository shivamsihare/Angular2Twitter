import {Injectable, OnInit} from '@angular/core';
import {Headers, Http, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import '../../requirets/require';
import {KEYS} from "./keys";
let CryptoJS = require('crypto-js');

const CONSUMER_KEY = KEYS["oauth_consumer_key"];
const CONSUMER_SECRET = KEYS["oauth_consumer_secret"];

@Injectable()
export class TwitterService {

  public data:JSON;
  public allData:string;
  public token:string;
  public verifier:string;
  public trends;
  public suggestedUsers;
  public tweeted;
  public userInfo;
  public arrOfPosts:Array<object>;
  public loadCount = 1;
  // URL to web api
  constructor(private http: Http) {
    console.log(CONSUMER_KEY);
  }

  static randomElement(arr):any{
    return arr[Math.floor(Math.random()*arr.length)];
  }

  static getQueryParamsFromUrl(url: string): Array<Object> {
    var quesInd = url.indexOf('?');
    if (quesInd == -1)return [];
    var arr = url.substr(quesInd + 1).split('&');
    var newArr = [];
    arr.forEach(function (item) {
      var u = {};
      var t = item.split('=');
      u['key'] = t[0];
      u['value'] = t[1];
      newArr.push(u);
    });
    console.log("This is my Query Array", newArr);
    return newArr;
  }

  /*data is a Array of Params and contains key value JSON OBJECT*/
  getOrPost(method, url, token, tokenSecret, bodyParams): Promise<any> {

    let arrQueryParams = TwitterService.getQueryParamsFromUrl(url);
    let oauth_consumer_key = CONSUMER_KEY;
    let oauth_nonce = TwitterService.getNonce(32);
    let oauth_signature_method = "HMAC-SHA1";
    let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    let oauth_version = "1.0";
    let signatureData = [
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: token},
      {key: "oauth_version", value: "1.0"},
    ];
    console.log(arrQueryParams);
    signatureData.forEach(function (item) {
      arrQueryParams.push(item);
    });
    console.log(arrQueryParams);
    if (method == "POST" && bodyParams != null)
      bodyParams.forEach(function (item) {
        arrQueryParams.push(item);
        console.log("bodyParams item: ", item.key, item.value);
      });
    let parameterString = TwitterService.getSignatureString(arrQueryParams.sort(function (a, b): number {
      if (a['key'] < b['key'])return -1;
      else return 1;
    }));

    let shaKey = encodeURIComponent(CONSUMER_SECRET) + "&" + encodeURIComponent(tokenSecret); //Consumer Key
    // Secret
    let final_string = method + "&" + encodeURIComponent(url.split('?')[0]) + "&" + encodeURIComponent(parameterString);
    console.log("Parameter String:", parameterString);
    console.log("finalString:", final_string);
    console.log("shakey:", shaKey);
    let s = CryptoJS.HmacSHA1(final_string, shaKey);
    let oauth_signature = CryptoJS.enc.Base64.stringify(s);
    console.log(oauth_signature);
    let authValue = TwitterService.getAuthValue([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: token},
      {key: "oauth_version", value: "1.0"},
    ]);

    //console.log(authValue,url);
    //console.log(http);
    //console.log(oauth_nonce.length);
    let resArray = [];
    if (method == 'GET') {
      let headers = new Headers({'Authorization': authValue});
      return this.http.get(url, new RequestOptions({headers: headers})).toPromise()
        .then((response) => response)
        .catch(TwitterService.handleError);
    }
    else {
      let headers = new Headers({'Authorization': authValue, 'Content-Type': 'application/x-www-form-urlencoded'});
      var body = "";
      bodyParams.forEach(function (item) {
        if (body != "") body = body + '&';
        body = body + (encodeURIComponent(item.key) + '=' + encodeURIComponent(item.value));
      });
      console.log("here is the body of post", body);
      return this.http.post(url, body, new RequestOptions({headers: headers})).toPromise()         /* try
       encoding body if doesn't work*/
        .then((response) => response)
        .catch(TwitterService.handleError);
    }
  }

  onSignIn(): Promise<any> {
    let twitterCallbackUrl = 'http://localhost:4200/callback';
    let url = "https://api.twitter.com/oauth/request_token";
    let method = "POST";
    let oauth_consumer_key = CONSUMER_KEY;
    let oauth_nonce = TwitterService.getNonce(32);
    let oauth_signature_method = "HMAC-SHA1";
    let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    let oauth_version = "1.0";
    let parameterString = TwitterService.getSignatureString([
      {key: "oauth_callback", value: twitterCallbackUrl},
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_version", value: "1.0"},
    ]);


    let shaKey = encodeURIComponent(CONSUMER_SECRET) + "&"; //Consumer Key Secret
    let final_string = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
    console.log("Parameter String:", parameterString);
    console.log("finalString:", final_string);
    console.log("shakey:", shaKey);
    let s = CryptoJS.HmacSHA1(final_string, shaKey);
    let oauth_signature = CryptoJS.enc.Base64.stringify(s);
    console.log(oauth_signature);
    let authValue = TwitterService.getAuthValue([
      {key: "oauth_callback", value: twitterCallbackUrl},
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_version", value: "1.0"},
    ]);

    let headers = new Headers({'Authorization': authValue});
    //console.log(authValue,url);
    //console.log(http);
    //console.log(oauth_nonce.length);
    return this.http.post(url, '', new RequestOptions({headers: headers})).toPromise()
      .then(response => response)
      .catch(TwitterService.handleError);
  }

  getAccessToken(): Promise<any> {
    let url = "https://api.twitter.com/oauth/access_token";
    let method = "POST";
    let oauth_consumer_key = CONSUMER_KEY;
    let oauth_nonce = TwitterService.getNonce(32);
    let oauth_signature_method = "HMAC-SHA1";
    let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    let oauth_version = "1.0";
    let parameterString = TwitterService.getSignatureString([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: this.token},
      {key: "oauth_verifier", value: this.verifier},
      {key: "oauth_version", value: "1.0"},
    ]);

    let shaKey = encodeURIComponent(CONSUMER_SECRET) + "&"; //Consumer Key Secret
    let final_string = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
    console.log("Parameter String:", parameterString);
    console.log("finalString:", final_string);
    console.log("shakey:", shaKey);
    let s = CryptoJS.HmacSHA1(final_string, shaKey);
    let oauth_signature = CryptoJS.enc.Base64.stringify(s);
    console.log(oauth_signature);
    let authValue = TwitterService.getAuthValue([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: this.token},
      {key: "oauth_verifier", value: this.verifier},
      {key: "oauth_version", value: "1.0"},
    ]);

    let headers = new Headers({'Authorization': authValue});
    //console.log(authValue,url);
    //console.log(http);
    //console.log(oauth_nonce.length);
    let resArray = [];
    return this.http.post(url, '', new RequestOptions({headers: headers})).toPromise()
      .then((response) => response)
      .catch(TwitterService.handleError);
  }

  tweet(data: string): Promise<any> {
    let url = "https://api.twitter.com/1.1/statuses/update.json";
    return this.getOrPost("POST", url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], [{key: "status", value: data}]);
  }

  getUserData(): Promise<any> {
    let url = "https://api.twitter.com/1.1/account/verify_credentials.json";
    let method = "GET";
    return this.getOrPost(method, url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], []);
  }

  getFollowers(): Promise<any> {
    return this.getOrPost('GET', 'https://api.twitter.com/1.1/followers/list.json', this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], []);
  }

  fetchTimeline() {
    let url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=50";
    let method = "GET";
    this.getOrPost(method, url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], []).then(
      res => {
        console.log("Home Timeline Response:",res);
        this.arrOfPosts=JSON.parse(res["_body"]);
      }
    ).catch(TwitterService.handleError);
  }

  getLocationAndTrends() {
    console.log("got inside Trends");
    this.getTrendsWithoutLocation();
    if ("geolocation" in navigator) {
      let self = this;
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("getLocation and Trends",position);
        if(!position){
          self.getTrendsWithoutLocation();
          console.log("Location Blocked Trends: ",this.trends);
          return;
        }
        let url = "https://api.twitter.com/1.1/trends/closest.json?lat=" + position.coords.latitude + "&long=" + position.coords.longitude;
        let method = "GET";
        self.getOrPost(method, url, self.userInfo["oauth_token"], self.userInfo["oauth_token_secret"], [])
          .then(response => {
            let woeid = JSON.parse(response["_body"])[0]["woeid"];
            console.log("woeid is", woeid);
            let trendUrl = 'https://api.twitter.com/1.1/trends/place.json?id=' + woeid;
            return self.getOrPost(method, trendUrl, self.userInfo["oauth_token"], self.userInfo["oauth_token_secret"], [])
              .then(response => {
                console.log("This response i am not able to see: ", response);
                self.trends = JSON.parse(response["_body"])[0]["trends"];
                console.log("Here a trends:", self.trends);
              }).catch(TwitterService.handleError);
          })
          .catch(TwitterService.handleError);
      });
    }
  }

  getTrendsWithoutLocation(){
    let self=this;
    let method = "GET";
    let trendUrl = 'https://api.twitter.com/1.1/trends/place.json?id=1';
    this.getOrPost(method, trendUrl, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], [])
      .then(response => {
        console.log("getTrendsWithoutLocation ", response);
        self.trends = JSON.parse(response["_body"])[0]["trends"];
      }).catch(TwitterService.handleError);
  }

  getSuggestedUsers() {

    let method = "GET";
    let url = 'https://api.twitter.com/1.1/users/suggestions.json';
    this.getOrPost(method, url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], [])
      .then(response => {
        console.log("This response i am not able to see: ", response);
        let slug = TwitterService.randomElement(JSON.parse(response["_body"]))["slug"];
        let url = 'https://api.twitter.com/1.1/users/suggestions/'+slug+'.json';
        this.getOrPost(method,url,this.userInfo["oauth_token"],this.userInfo["oauth_token_secret"],[])
          .then(response=>{
            this.suggestedUsers = JSON.parse(response["_body"])["users"];
            console.log("Suggested Users: ", this.suggestedUsers);
          })
          .catch(TwitterService.handleError);
      }).catch(TwitterService.handleError);
  }

  public getUserTimeline(user:string) {
    let url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name="+user+"&count=200";
    let method = "GET";
    this.getOrPost(method, url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], []).then(
      res => {
        console.log("User Timeline Response:",res);
        this.arrOfPosts=JSON.parse(res["_body"]);
      }
    ).catch(TwitterService.handleError);
    return true;
  }

  followUser(user:string){

    let url = "https://api.twitter.com/1.1/friendships/create.json?screen_name="+user+"&follow=true";
    let method = "POST";
    this.getOrPost(method, url, this.userInfo["oauth_token"], this.userInfo["oauth_token_secret"], []).then(
      res => {
        console.log("Follwed User:",res);
      }
    ).catch(TwitterService.handleError);
  }

  //any used here is an Object of format {key,value}
  static getSignatureString(arr: Array<any>): string {
    var result = "";
    let l = arr.length;
    for (let i: number = 0; i < l; i++) {
      console.log(arr[i].key, arr[i].value);
      result += encodeURIComponent(arr[i].key) + '=' + encodeURIComponent(arr[i].value);
      if (i != l - 1) {
        result += '&';
      }
    }
    return result;
  }

  static getAuthValue(arr: Array<any>): string {
    var result = "OAuth ";
    let l = arr.length;
    for (let i: number = 0; i < l; i++) {
      result += encodeURIComponent(arr[i].key) + '="' + encodeURIComponent(arr[i].value) + '"';
      if (i != l - 1) {
        result += ', ';
      }
    }
    return result;
  }

  static getNonce(numChars): string {
    var st = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz";
    var l = st.length;
    var result = "";

    for (var i = 0; i < numChars; i++) {
      var randomIndex = Math.floor(Math.random() * l);
      result = result + st.charAt(randomIndex);
    }
    return result;
  }

  static saveToken(response: any) {
    let temp = response["_body"];
    let iA = temp.indexOf('&');
    return temp.substr(0, iA);
  }

  static handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  clickOnTweetButton(data: string): any {
    var self = this;
    this.tweet(data)
      .then((response) => {
        console.log(response);
        this.tweeted = "Tweeted Successfully";
        setTimeout(function () {
          self.tweeted = null;
        }, 3000);
      })
      .catch(function (error) {
        console.log(error);
        self.tweeted = "Error While Tweeting";
        setTimeout(function () {
          self.tweeted = null;
        }, 3000);
      })
  }

  onScroll():void{
    if(!this.loadCount)this.loadCount=1;
    this.loadCount++;
  }

  keyPressed(val):void{
    //console.log("TweetData",val.value);
    let self = this;
    if(val.value.length>=140){
      this.tweeted="Note: Maximum characters allowed in tweet are 140";
      setTimeout(function(){
        self.tweeted=null;
      },2000);
    }
    else self.tweeted=null;
  }

  public saveTokenVerifier(token:string,verifier:string):void{
    this.token=token;
    this.verifier=verifier;
  }
}


