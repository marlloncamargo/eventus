
import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import { Facebook, NativeStorage } from 'ionic-native';
import { Events } from "../events/events";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
  FB_APP_ID: number = 119866418119421;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  facebookLogin(){
    let permissions = new Array();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(function(){
          nav.push(Events);
        }, function (error) {
          console.log(error);
        })
      })
    }, function(error){
      console.log(error);
    });
  }
}
