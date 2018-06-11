import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlaceService } from '../../providers/place-service';
import { CategoryService } from '../../providers/category-service';
import { Data } from '../../providers/data';
import { Events } from "../events/events";
import { FilterModel } from '../../app/models/filterModel';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PlaceService, CategoryService]
})

export class HomePage {
  // Searchbar
  searchTerm: string = '';
  searching: any = false;

  // Mensagens de erro
  alertMessage:any;

  // Loading
  public loadingPopup :any;

  // Lista de locais
  public places: any = null;

  // Bar/balada
  private bar     :boolean = false;
  private club    :boolean = false;

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public placeService: PlaceService,
              public categoryService: CategoryService,
              private alertCtrl: AlertController,
              public dataservice: Data) {}

  ionViewDidLoad(){
    this.getFilter();
  }


  setFilteredItems(){
    this.places = null;
    if(this.searchTerm ==  ''){
      this.getFilter();
    } else {
      this.searching = true;
      this.placeService.searchByName(this.searchTerm, 0).then(data => {
          this.places = data;
          if(!this.places || this.places.length <= 0){
            this.alertMessage = "Não existem locais disponiveis no momento!"
          } else {
            this.places = this.places.filter(function(elem, index, self) {
              return index == self.indexOf(elem);
            })
            this.alertMessage = null;
          }
          this.searching = false;
      }, (err) => {
        console.log(err);
      });
    }
  }

  // Busca Filtro
  getFilter(){

    this.searching = true;

    this.dataservice.getData().then((data) => {

      let filter = JSON.parse(data);

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
      if(filter != null){
        // Raio do filtro escolhido
        distance = filter.distance;
      }

      if(this.bar && this.club){
        this.getGeoLocation(distance, 0);
      } else if (this.bar) {
        this.getGeoLocation(distance, 1);
      } else if (this.club){
        this.getGeoLocation(distance, 2);
      } else {
        this.searching = false;
        this.alertMessage = "Não existem locais disponiveis para esse tipo de pesquisa!"
      }
    }, (err) => {
      this.searching = false;
      this.alertMessage = "Verifique seu acesso a internet!"
      console.log(err);
    });
  }

  // Busca Geolocalizacao
  getGeoLocation(distance: number, category: number){
    this.geolocation.getCurrentPosition().then((position) => {
      let lat = String(position.coords.latitude);
      let lng = String(position.coords.longitude);
      this.requestPlaces(lat, lng, distance, category);
    }, (err) => {
      this.searching = false;
      this.alertMessage = "Acesso a internet e/ou localização indisponiveis no momento!"
      console.log(err);
    });
  }

  // Busca Lugares
  requestPlaces(lat: String, lng: String, distance: number, category: number){
    this.placeService.requestPlaces(lat, lng, distance, category).then(data => {
      setTimeout(() => {
        this.places = data;
        if(!this.places){
          this.alertMessage = "Não existem locais disponiveis no momento!"
        } else {
          this.places = this.places.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
          })
          this.alertMessage = null;
        }
        this.searching = false;
      }, 1000);
    }, (err) => {
      this.searching = false;
      this.alertMessage = "Acesso a internet e/ou localização indisponiveis no momento!"
      console.log(err);
    });
  }

  searchEvents(event, place) {
      this.navCtrl.push(Events, {
        item: place.id
      });
    }

}
