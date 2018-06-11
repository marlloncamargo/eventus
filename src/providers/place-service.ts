import { Injectable } from '@angular/core';
//import * as moment from 'moment';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PlaceService {

  public places: any[]

  constructor(public http: Http) {}

  // Busca Lugares baseado na latitude, longetude e raio informado
  requestPlaces(lat: String, lng: String, distance: number, category: number){

    if (this.places) {
      //return Promise.resolve(this.places);
    }

    return new Promise(resolve => {
      let url = 'http://45.62.241.134:8091/places';
      url += '?center='   + lat + "," + lng;
      url += '&distance=' + distance;
      url += '&category=' + category;

      console.log('Places Request:' + url);

      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.places = data;
        resolve(this.places);
      });
    });
  }

  searchByName(name: String, category: number){

    if (this.places) {
      //return Promise.resolve(this.places);
    }

    return new Promise(resolve => {
      let url = 'http://45.62.241.134:8091/place';
      url += '?q=' + name;
      url += '&category=' + category;

      console.log('Places Request:' + url);

      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.places = data;
        resolve(this.places);
      });
    });
  }

}
