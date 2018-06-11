import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class Data {

  constructor(public storage: Storage) {}

  getData() {
    return this.storage.get('filter');
  }


  save(data){
    this.storage.clear();
    let newData = JSON.stringify(data);
    this.storage.set('filter', newData);
  }

}
