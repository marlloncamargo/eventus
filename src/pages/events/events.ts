import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';
import { EventService } from '../../providers/event-service';
import { PlaceService } from '../../providers/place-service';
import { EventDetail } from "../event-detail/event-detail";
import { Data } from '../../providers/data';

import { HomePage } from '../home/home';

import { FilterModel } from '../../app/models/filterModel';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  providers: [EventService, PlaceService]
})

export class Events {

  alertMessage:any;

  // Objeto para tela
  events:any = [];
  public loadingPopup :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventService: EventService,
              public placeService: PlaceService,
              public geolocation: Geolocation,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public dataservice: Data) {}

  ionViewDidLoad() {

    // Create the popup
    this.loadingPopup = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    // Show the popup
    this.loadingPopup.present();

    let placeID = this.navParams.get('item');

    if(placeID){
      this.events = [];
      this.searchEvents(placeID, this.events);
    } else {
      this.getFilter();
    }

  }

  // Bar/balada
  private bar     :boolean = false;
  private club    :boolean = false;

  // Mostrar sem eventos
  private nextDays:number   = 0;

  // Busca Filtro
  getFilter(){
    this.dataservice.getData().then((data) => {

      let filter  = JSON.parse(data);

      if (filter == null){
        filter = new FilterModel(1, 1, 5000, 10, 0);
      }

      if(filter.bar && Number(filter.bar)   == 1){
        this.bar  = true;
      }

      if (filter.club && Number(filter.club) == 1){
        this.club = true;
      }

      // Raio Inicial de pesquisa
      let distance:number = 1000;

      if(filter.distance){
        // Raio do filtro escolhido
        distance = filter.distance;
      }

      if(filter.nextDays){
        this.nextDays = Number(filter.nextDays);
      }

      if(this.bar && this.club){
        this.getGeoLocation(distance, 0);
      } else if (this.bar) {
        this.getGeoLocation(distance, 1);
      } else if (this.club) {
        this.getGeoLocation(distance, 2);
      } else {
        this.loadingPopup.dismiss();
        this.alertMessage = "Não existem eventos disponiveis para esse tipo de pesquisa!"
      }
    }, (err) => {
      this.loadingPopup.dismiss();
      this.alertMessage = "Verifique seu acesso a internet!"
      console.log(err);
    });
  }

  // Busca Geolocalizacao
  getGeoLocation(distance: number, category: number){
    this.geolocation.getCurrentPosition().then((position) => {
      let lat = String(position.coords.latitude);
      let lng = String(position.coords.longitude);
      this.requestEvents(lat, lng, distance, category);
    }, (err) => {
      this.loadingPopup.dismiss();
      this.alertMessage = "Acesso a internet e/ou localização indisponiveis no momento!"
      console.log(err);
    });
  }


  // Busca Eventos
  requestEvents(lat: String, lng: String, distance: number, category: number){
    this.eventService.requestEvents(lat, lng, distance, category, this.nextDays).then(data => {
      setTimeout(() => {
        this.events = data;
        if(!this.events || this.events.length <= 0){
          this.alertMessage = "Não existem eventos disponiveis no momento!"
        }
        this.loadingPopup.dismiss();
      }, 1000);
    }, (err) => {
      this.loadingPopup.dismiss();
      this.alertMessage = "Acesso a internet e/ou localização indisponiveis no momento!"
      console.log(err);
    });
  }

  // Busca eventos
  searchEvents(placeID: Number, events:any[]){
    this.eventService.searchEvents(placeID).then(data => {
      let out = data;

      if(out && out.length > 0){
        for(let d of out){
          events.push(d);
        }
      } else {
        let alert = this.alertCtrl.create({
          title: 'Aviso',
          subTitle: 'Não existem eventos no momento para esse local',
          buttons: ['Ok']
        });

        setTimeout(() => {
          this.navCtrl.popToRoot(HomePage);
          alert.present();
        }, 1000);
      }

      setTimeout(() => {
        // Ordenando eventos por data
        events.sort(function(a,b) {
          let startDateA:Date = moment(a.start_time).toDate();
          let startDateB:Date = moment(b.start_time).toDate();
          return startDateA.getTime() - startDateB.getTime()
        });

        events;
        this.loadingPopup.dismiss();
      }, 1000);

    }, (err) => {
      this.loadingPopup.dismiss();
      this.alertMessage = "Acesso a internet e/ou localização indisponiveis no momento!"
      console.log(err);
    });
  }

  // Detalhe do evento
  eventDetail(event, ev) {
    this.navCtrl.push(EventDetail, {
      item: ev.id
    });
  }
}
