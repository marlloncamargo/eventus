import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { NativeStorage } from 'ionic-native';

// Pages
//import { Login } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Events } from '../pages/events/events';
import { Filter } from '../pages/filter/filter';
import { Data } from '../providers/data';

@Component({
  templateUrl: 'app.html',
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Events;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public dataservice: Data) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Eventos', component: Events },
      { title: 'Bares e Baladas', component: HomePage },
      { title: 'Filtros', component: Filter }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      /*
      let env = this;
      NativeStorage.getItem('user')
      .then( function (data) {
        // user is previously logged and we have his data
        // we will let him access the app
        env.nav.push(Events);
        //this.splashScreen.hide();
      }, function (error) {
        //we don't have the user data so we will ask him to log in
        env.nav.push(Login);
        //this.splashScreen.hide();
      });
      */
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
