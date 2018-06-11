import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {

  private events: any;

  constructor(public http: Http) {
  }

  requestEvents(lat: String, lng: String, distance: number, category: number, nextDays: number){

    if (this.events) {
      return Promise.resolve(this.events);
    }

    return new Promise(resolve => {
      let url = 'http://45.62.241.134:8092/events';
      url += '?center='   + lat + "," + lng;
      url += '&distance=' + distance;
      url += '&category=' + category;

      console.log('Events Request:' + url);

      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.events = data;

        // Filtro de periodo de evento
        let returnArray = [];
        for(let ev of this.events){

          let startDate:Date = moment(ev.start_time).toDate();

          let dateAux:Date = new Date();
          dateAux.setDate(dateAux.getDate() + nextDays);

          if(startDate.getTime() < dateAux.getTime()){
            returnArray.push(ev);
          }
        }

        // Ordenando eventos por data
        returnArray.sort(function(a,b) {
          let startDateA:Date = moment(a.start_time).toDate();
          let startDateB:Date = moment(b.start_time).toDate();
          return startDateA.getTime() - startDateB.getTime()
        });

        this.events = returnArray;
        resolve(this.events);
      });
    });
  }

  // Busca eventos de um lugar
  searchEvents(placeID: Number){

    if (this.events) {
      return Promise.resolve(this.events);
    }

    return new Promise(resolve => {

      let url = 'https://graph.facebook.com/v2.9/events';

      url += '?id=' + placeID;
      url += '&fields=name%2Cstart_time%2Cend_time%2Cplace%2Cpicture';
      url += '&access_token=119866418119421|bd43dea92fa868d5852e7092a5094bad';

      console.log('Events Request:' + url);

      this.http.get(url).map(res => res.json()).subscribe(data => {
        let events:any[] = data.data;
        let out:any[] = [];

        let yesterday = new Date();

        // Filtro de eventos ativos
        for(let ev of events){
          let startDate:Date = moment(ev.start_time).toDate();
          if(startDate.getTime() > yesterday.getTime()){
            out.push(ev);
          }
        }
        this.events = out;
        resolve(this.events);
      });

    });
  }

  // Busca detalhe de um evento
  searchEventDetail(eventID: Number){

    if (this.events) {
      return Promise.resolve(this.events);
    }

    return new Promise(resolve => {

      let url = 'https://graph.facebook.com/v2.9/';

      url +=  eventID;
      url += '?fields=name%2Ccategory%2Cdescription%2Cstart_time%2Cend_time%2Cowner%2Ccover%2Cattending_count%2Cmaybe_count%2Cinterested_count%2Cinterested.limit(20){picture%2Cname}%2Cattending.limit(20){picture%2Cname}%2Cplace';
      url += '&access_token=119866418119421|bd43dea92fa868d5852e7092a5094bad';

      console.log("Search evnet detail: " + url);

      this.http.get(url).map(res => res.json()).subscribe(data => {
        let eventDetail = data;
        resolve(eventDetail);
      });

    });
  }
}
