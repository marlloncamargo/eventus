import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Events } from "../events/events";
import { Data } from '../../providers/data';
import { FilterModel } from '../../app/models/filterModel';

@IonicPage()
@Component({
  selector:     'page-filter',
  templateUrl:  'filter.html'
})

export class Filter {

  private optionSelect: number;

  // Bar/balada
  private bar     :boolean = false;
  private club    :boolean = false;

  public distanceRange: number;
  public nextDays     : number;
  public noEvents     : boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataservice: Data,
    public loading: LoadingController) {}

  ionViewDidLoad() {

    let loadingPopup = this.loading.create({
      content: 'Aguarde...',
    });

    // Show the popup
    loadingPopup.present();

    this.dataservice.getData().then((data) => {
      setTimeout(() => {
        let filter = JSON.parse(data)

        if (filter == null){
          filter = new FilterModel(1, 1, 5000, 10, 0);
        }

        this.bar            = Number(filter.bar)      == 1 ? true: false;
        this.club           = Number(filter.club)     == 1 ? true: false;

        if(this.bar && this.club){
          this.optionSelect = 0;
        } else if (this.bar) {
          this.optionSelect = 1;
        } else {
          this.optionSelect = 2;
        }

        this.noEvents       = Number(filter.noEvents) == 1 ? true: false;
        this.distanceRange  = filter.distance / 1000;
        this.nextDays       = filter.nextDays;

        loadingPopup.dismiss();
      }, 1000);
    });
  }

  saveFilter(){
    let loadingPopup = this.loading.create({
      content: 'Aguarde...',
    });

    // Show the popup
    loadingPopup.present();

    let bar      :number = 0;
    let club     :number = 0;
    let noEvents :number = this.noEvents ? 1 : 0;

    if(this.optionSelect == 0){
      bar  = 1;
      club = 1;
    } else if (this.optionSelect == 1){
      bar  = 1;
    } else {
      club = 1;
    }

    let filter = new FilterModel(bar, club, (this.distanceRange * 1000), this.nextDays, noEvents);

    setTimeout(() => {
      this.dataservice.save(filter);
      loadingPopup.dismiss();
      this.navCtrl.setRoot(Events);
    }, 1000);
  }
}
