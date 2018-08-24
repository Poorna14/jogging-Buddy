import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {WeatherServiceProvider} from "../../providers/weather-service/weather-service";
import {Geolocation} from '@ionic-native/geolocation';
//import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  public weatherList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public weatherProv:WeatherServiceProvider,public geo:Geolocation) {
  }

  ionViewDidLoad() {
    this.geo.getCurrentPosition().then( pos =>{
      this.getWeather(String(pos.coords.latitude),String(pos.coords.longitude))
    }).catch(err => console.log(err));

    console.log(this.weatherList);
  }

  getWeather(lat:string,lon:string){
    this.weatherProv.city(lat,lon)
      .map(data=>data.json())
      .subscribe(data=>{
        this.weatherList.push(data);
    },
    err => console.log(err),
      () =>console.log('getWeather completed'))

  }
}
