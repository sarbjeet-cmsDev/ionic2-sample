import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { LocationService } from '../../providers/location';

declare var google: any;

@Component({
	selector:'business-location',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{business.name}}</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content> 
  		<ng-container *ngIf="mylocation">
	  		<div padding-horizontal id="address-info">
		  		<p text-center>You are here: <ion-icon name="ios-pin"></ion-icon> <span>{{ mylocation?.street_address }}</span></p>
		  		<h3 text-center> {{ traveltime }} <span *ngIf="distance">({{distance}})</span> </h3>
		  		<p text-center>{{ business.street_address }},{{ business.city }}</p>
	  		</div>
  		</ng-container>
  		<div [hidden]="!mylocation" #map id="mapo"></div>
  		<ng-container *ngIf="!mylocation && !loading">
  			<div class='no-result'>
				<div>
					<i class="fal fa-exclamation-circle"></i><br/>
					<p>Unable to track your location</p>
				</div>
			</div>
  		</ng-container>
	</ion-content>
  `
})
export class BarberLocation {
	business:any;
	mylocation:any = null;
	traveltime:string = null;
	distance:string = null;
	loading:boolean = true;

	constructor(public locationService: LocationService,
		public params: NavParams) {
		this.business = this.params.get('business');

		this.locationService.getPlace().then((address) => {
			this.mylocation = address;
			this.loadMap(address);
			this.loading = false;
		}).catch((error) => { this.loading = false; });
	}

    loadMap(address) {
		let latLng = new google.maps.LatLng(address.latitude,address.longitude);
		let mapOptions = {
			center: latLng,
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			fullscreenControl: false,
			streetViewControl: false,
			zoomControl: false,
		};
        let map = new google.maps.Map(document.getElementById('mapo'), mapOptions);


        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;
        directionsDisplay.setMap(map);
        directionsService.route({
			origin: {lat:address.latitude, lng: address.longitude},  // Haight.
			destination: {lat: parseFloat(this.business.latitude) , lng: parseFloat(this.business.longitude) },  // Ocean Beach.
			travelMode: google.maps.TravelMode['DRIVING']
        }, (response, status)=>{
			if (status == 'OK') {
				this.traveltime = response.routes[0].legs[0].duration.text;
				this.distance = response.routes[0].legs[0].distance.text;
				directionsDisplay.setDirections(response);
			} else {
				this.mylocation = null;
			}
        });
	}
}
