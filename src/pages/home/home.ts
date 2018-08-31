import {Component,ViewChild,ElementRef} from '@angular/core';
import {NavController, Platform, AlertController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {Subscription} from "rxjs/Subscription";
import {Storage} from '@ionic/storage';
import {filter} from 'rxjs/operators';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
@ViewChild('map') mapRef:ElementRef;
  lat:any;
  lng:any;
  map:any;
  currentMapTrack = null;

  isTracking =false;
  trackedRoute=[];
  previousTracks=[];
  distance=0;

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController,private plt: Platform,public geo: Geolocation
    , private storage: Storage, private alertCtrl: AlertController) {
  }

  ionViewDidLoad(){
    this.plt.ready().then(() =>{
      this.loadHistoricRoutes();
      this.showMap();
  });
  }

  loadHistoricRoutes(){
    this.storage.get('routes').then(data =>{
      if(data){
        this.previousTracks =data;
      }
    });
  }

  startTracking(){
    this.isTracking=true;
    this.trackedRoute=[];
    this.distance=0;

    this.geo.getCurrentPosition().then( pos =>{
      let latLng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
      this.addMarker(latLng,this.map);
    }).catch(err => console.log(err));

    this.positionSubscription = this.geo.watchPosition().pipe(
      filter((p) => p.coords !== undefined)
    ).subscribe(data =>{
      setTimeout(()=>{
        this.trackedRoute.push({lat:data.coords.latitude,lng:data.coords.longitude});
        this.redrawPath(this.trackedRoute);
      });
      })
  }

  redrawPath(path){
    if(this.currentMapTrack){
      this.currentMapTrack.setMap(null);
    }

    if(path.length>1){
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic:true,
        strokeColor:'#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight:3
      });
      this.distance+= path.length;
      this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking(){
    this.geo.getCurrentPosition().then( pos =>{
      let latLng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
      this.addMarker(latLng,this.map);
    }).catch(err => console.log(err));

    let newRoute ={finished:new Date().getTime(), path: this.trackedRoute, distance:this.distance};
    this.previousTracks.push(newRoute);
    this.storage.set('routes',this.previousTracks);
    this.isTracking=false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
  }

  showHistoryRoute(route){
    this.redrawPath(route);
  }

  showMap(){

  	// const location = new google.maps.LatLng(this.lat,this.lng);
  	const options = {
  		timeout: 20000,
		  enableHighAccuracy: true,
  		// center:location,
  		zoom :16,
  		mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
  	}

    this.map = new google.maps.Map(this.mapRef.nativeElement,options);

    this.geo.getCurrentPosition().then( pos =>{
      let latLng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
      this.map.setCenter(latLng);
    }).catch(err => console.log(err));

  }

  addMarker(position,map){
    return new google.maps.Marker({
      position,
      map
    });

  }

}
