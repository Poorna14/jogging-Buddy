import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WeatherServiceProvider {
  private appId='f087f139efcdbecd8cde68b90b7b3e93';
  private baseUrl="http://api.openweathermap.org/data/2.5/forecast?";

  constructor(public http: Http) {
    }

    city(lat:string,lon:string){
      let url=this.baseUrl;
      url += 'lat=' +lat;
      url += '&lon=' +lon;
      url += '&units=metric&appId=' + this.appId;

      return this.http.get(url);

    }
}
