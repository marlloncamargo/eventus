import { Component } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { EventService } from '../../providers/event-service';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
  providers: [EventService, GoogleMaps]
})

export class EventDetail {
  public loadingPopup :any;

  public image       :String;
  public name        :String;
  public placeName   :String;
  public desc        :String;
  public startTime   :String;
  public endTime     :String;
  public adress      :String;
  public owner       :String;
  public attending   :Number;
  public maybe       :Number;
  public interested  :Number;

  //Fotos dos convidados
  public attendingPicture   :any[];
  public interestedPicture  :any[];

  map: GoogleMap;
  destination:string;
  start:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              private googleMaps: GoogleMaps,
              private eventService: EventService) {
  }


  // Load map only after view is initialized
  ngAfterViewInit() {
   //this.loadMap();
  }


  navigate(){
    let options: LaunchNavigatorOptions = {
      start: ""
    };

    LaunchNavigator.navigate(this.destination, options)
        .then(
            success => //alert('Launched navigator'),
            error => alert('Error launching navigator: ' + error)
    );
  }

  ionViewDidLoad() {
    // Create the popup
    this.loadingPopup = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    // Show the popup
    this.loadingPopup.present();

    let eventID = Number(this.navParams.get('item'));

    if(eventID){
      this.searhDetail(eventID);
    }
  }

  private searhDetail(eventID: Number){
    this.eventService.searchEventDetail(eventID).then(data => {
      setTimeout(() => {
        if(data){
          let eventDetail = data;
          //console.log(data);
          this.convertObject(eventDetail);
        }
        this.loadingPopup.dismiss();
      }, 1000);
    });
  }

  private convertObject(obj: any){
    //this.image  = obj.cover.source;
    this.name       = obj.name;
    this.desc       = new String(obj.description);

    this.startTime  = obj.start_time;
    this.endTime    = obj.end_time;

    if(obj.cover){
      this.image    = obj.cover.source;
    }

    if(obj.place.name){
      this.placeName = obj.place.name;
    }

    if(obj.owner.name){
      this.owner = obj.owner.name;
    }

    if(obj.place.location){
      console.log(obj.place.location);

      this.adress    = obj.place.location.street;
      this.adress   += ' - ';
      this.adress   += obj.place.location.city;

      this.destination = obj.place.location.latitude;
      this.destination += ',';
      this.destination += obj.place.location.longitude;
    }

    if(obj.attending_count){
      this.attending = Number(obj.attending_count);
    }

    if(obj.interested_count){
      this.interested = Number(obj.interested_count);
    }

    if(obj.maybe_count){
      this.maybe     = Number(obj.maybe_count);
    }

    if(obj.attending){
      this.attendingPicture  = obj.attending.data;
    }

    if(obj.interested){
      this.interestedPicture = obj.interested.data;
    }

  }

loadMap() {
 // make sure to create following structure in your view.html file
 // and add a height (for example 100%) to it, else the map won't be visible
 // <ion-content>
 //  <div #map id="map" style="height:100%;"></div>
 // </ion-content>

 // create a new map by passing HTMLElement
 let element: HTMLElement = document.getElementById('map');

 let map: GoogleMap = this.googleMaps.create(element);

 // listen to MAP_READY event
 // You must wait for this event to fire before adding something to the map or modifying it in anyway
 map.one(GoogleMapsEvent.MAP_READY).then(
   () => {
     console.log('Map is ready!');
     // Now you can add elements to the map like the marker
   }
 );

 // create LatLng object
 let ionic: LatLng = new LatLng(43.0741904,-89.3809802);

 // create CameraPosition
 let position: CameraPosition = {
   target: ionic,
   zoom: 18,
   tilt: 30
 };

 // move the map's camera to position
 map.moveCamera(position);

 // create new marker
 let markerOptions: MarkerOptions = {
   position: ionic,
   title: 'Ionic'
 };

/*
 const marker: Marker = map.addMarker(markerOptions)
   .then((marker: Marker) => {
      marker.showInfoWindow();
    });

  */
 }

}
