import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Events } from '../pages/events/events';
import { EventDetail } from '../pages/event-detail/event-detail';
import { Login } from '../pages/login/login';
import { Filter } from '../pages/filter/filter';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage'
import { Data } from '../providers/data';
import { LOCALE_ID } from '@angular/core';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Events,
    EventDetail,
    Login,
    Filter
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Events,
    EventDetail,
    Login,
    Filter
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: LOCALE_ID, useValue: "pt-BR" },
    Data, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
