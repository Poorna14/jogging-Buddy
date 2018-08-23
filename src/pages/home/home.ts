import {Component,ViewChild,ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';

declare let google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  lat:any;
  lng:any;
@ViewChild('map') mapRef:ElementRef;

  constructor(public navCtrl: NavController,public geo: Geolocation) {
  }

  ionViewDidLoad(){
    this.geo.getCurrentPosition().then( pos =>{
      this.lat=pos.coords.latitude;
      this.lng=pos.coords.longitude;
      this.showMap();
    }).catch(err => console.log(err))
  }

  showMap(){
  	const location = new google.maps.LatLng(this.lat,this.lng);

  	const options = {
  		timeout: 20000,
		enableHighAccuracy: true,
  		center:location,
  		zoom :16,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
  	}

  	const map = new google.maps.Map(this.mapRef.nativeElement,options);

    this.addMarker(location, map)
  }

  addMarker(position,map){
    return new google.maps.Marker({
      position,
      map
    });

  }

}
