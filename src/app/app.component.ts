import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  isLoggedIn: boolean  = false;
  users : [any];

  pages: Array<{title: string, component: any, icon?: string, imgIcon?: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public barcodeScanner: BarcodeScanner, private fb: Facebook) {
    this.initializeApp();

    // Check connection to Facebook
    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Accueil', component: HomePage, icon: 'home' },
      { title: 'Ma cave', component: ListPage, imgIcon: 'wine-bottle' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
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

  openBarcodeScanner() {
    const barcodeOptions = {
      preferFrontCamera: true,
      showFlipCameraButton: true,
      showTorchButton: true,
      orientation: 'portrait'
    };

    this.barcodeScanner.scan(barcodeOptions).then(barcodeData => {
      // Success! Barcode data is here
      console.log(barcodeData);
    }, (err) => {
      // An error occurred
      console.log(err);
    });
  }

  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }
}
