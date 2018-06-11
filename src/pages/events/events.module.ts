import { NgModule } from '@angular/core';
//import { IonicModule } from 'ionic-angular';
import { Events } from './events';

@NgModule({
  declarations: [
    Events,
  ],
  imports: [
    //IonicModule.forChild(Events),
  ],
  exports: [
    Events
  ]
})
export class EventsModule {}
