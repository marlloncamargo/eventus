import { NgModule } from '@angular/core';
//import { IonicModule } from 'ionic-angular';
import { Filter } from './filter';

@NgModule({
  declarations: [
    Filter,
  ],
  imports: [
    //IonicModule.forChild(Filter),
  ],
  exports: [
    Filter
  ]
})
export class FilterModule {}
