import { NgModule } from '@angular/core';
//import { IonicModule } from 'ionic-angular';
import { EventDetail } from './event-detail';

@NgModule({
  declarations: [
    EventDetail,
  ],
  imports: [
    //IonicModule.forChild(EventDetail),
  ],
  exports: [
    EventDetail
  ]
})
export class EventDetailModule {}
