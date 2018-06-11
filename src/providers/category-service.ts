import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CategoryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategoryService {

  private categories: any;

  constructor(public http: Http) {
  }

  // Busca categorias do Facebook por tipo -- 0 = TODAS
  searchCategoryById(id:number){

    if (this.categories) {
      return Promise.resolve(this.categories);
    }

    return new Promise(resolve => {
      let url = 'http://45.62.241.134:8090/categories/';

      if(id != 0){
        url += id;
      }

      console.log('Search Category By ID:' + url);

      this.http.get(url).
        map(res => res.json()).
          subscribe(data => {
            this.categories = data;
            //console.log("Categories: " + JSON.stringify(this.categories));
            resolve(this.categories);
      }, (err) => {
        console.log(err);
      });
    });
  }

}
