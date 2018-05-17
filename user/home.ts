import { Component } from '@angular/core';
import { NavController, ModalController, NavParams,IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';
import { LocationService } from '../../providers/location';
import { BusinessDetail } from './business';
import { Filter } from './filter';
import { UserBusinessReviews } from './reviews';
import { UserBusinessWork } from './work';
//import { GoogleMaps,GoogleMap,GoogleMapsEvent,GoogleMapOptions,CameraPosition,MarkerOptions,Marker } from '@ionic-native/google-maps';


import _ from 'lodash';
import * as moment from 'moment';
declare var google: any;



@Component({
	selector: 'user-home',
	template: `
	<ion-header>
		<ion-toolbar>
			<ion-searchbar placeholder='Search Business' (ionInput)="searchBusiness($event)" (ionClear)="clearSearch()"></ion-searchbar>
		</ion-toolbar>
	</ion-header>
  	<ion-content>
  		<div class="search-result" *ngIf='isSearchingMode'>
  			<p *ngIf="!searchEnd" text-center>
  				<ion-spinner name="bubbles"></ion-spinner>
  			</p>
  			<ion-list *ngIf='searchResult.length'>
  				<ion-item *ngFor='let business of searchResult' (click)="pushBusinessDetail(business.id)">
  					<ion-avatar item-start>
  						<img [src]="business.logo_url" />
  					</ion-avatar>
  					<h3>{{ business.name }}</h3>
  					<p>{{ business.formatted_address }}</p>
  				</ion-item>
  			</ion-list>
  			<p *ngIf="!searchResult.length && searchEnd" text-center>No Result Found!</p>
  		</div>

  		<div class="my-location" >
	  		<p text-center>You are here: <ion-icon name="ios-pin"></ion-icon> <span>{{ mylocation?.street_address || '............' }}</span></p>
  		</div>
  		<div class='business-cat' [hidden]="filter.category.value != null || isSearchingMode">
  			<h3 [hidden]="!user">Hi {{ user?.name }}!</h3>
  			<div class="list">
  				<ul>
	  				<li *ngFor="let category of categories" (click)='setSearchCat(category.id)'>{{ category.title }}</li>
	  			</ul>
  			</div>
  		</div>
  		<div class="list-area" [hidden]="filter.category.value == null">
  			<ion-segment [(ngModel)]="displayType">
  				<ion-segment-button value="map">
					<ion-icon name="ios-map"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="list">
					<ion-icon name="ios-menu-outline"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="rating">
					<ion-icon name="ios-star-outline"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="alphabetical">
					<ion-icon name="ios-book"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="price">
					 <ion-icon name="logo-usd"></ion-icon>
				</ion-segment-button>
				<ion-segment-button (click)="viewFilter()">
					 <ion-icon name="ios-more"></ion-icon>
				</ion-segment-button>
			</ion-segment>

			<div [hidden]="displayType != 'map'" #map id="map"></div>

			<div class="list-view">
				<ng-container  *ngIf="displayType == 'list'">
					<ng-container *ngIf="!businesses.length">
						<div class='no-result'>
							<div>
								<i class="fal fa-search"></i>
								<p>No Business Found near to you</p>
							</div>
						</div>
					</ng-container>
					<ng-container *ngIf="businesses.length">
						<ion-grid>
							<ion-row *ngFor="let business of businesses">
								<ion-col class="business-cover" col-5>
									<img [src]="business.cover_image_url"/>
								</ion-col>
								<ion-col col-7 class='business-desc'>
									<div class='info'>
										<h4>{{business.name}}</h4>
										<div class="rating-box" (click)="pushReviewsPage(business)">
											<span class="rating">
												<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
											</span>
											<span>{{business.rating_by}}</span>
										</div>
										<p>
											<span class="pull-right">{{business.distance}}mi</span>
										</p>
									</div>
									<ion-row class="action">
										<ion-col col-6>
											<button ion-button block color="light" (click)="pushWorkPage(business)">PHOTOS</button>
										</ion-col>
										<ion-col col-6>
											<button ion-button block (click)="pushBusinessDetail(business.id)">REZERV</button>
										</ion-col>
									</ion-row>
								</ion-col>
							</ion-row>
						</ion-grid>
						<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
						   <ion-infinite-scroll-content></ion-infinite-scroll-content>
						</ion-infinite-scroll>
					</ng-container>
				</ng-container>
				<ng-container  *ngIf="displayType == 'alphabetical'">
					<ng-container *ngIf="!businessesAlphaSortList.length">
						<div class='no-result'>
							<div>
								<i class="fal fa-search"></i>
								<p>No Business Found near to you</p>
							</div>
						</div>
					</ng-container>
					<ng-container *ngIf="businessesAlphaSortList.length">
						<ion-grid>
							<ion-row *ngFor="let business of businessesAlphaSortList">
								<ion-col class="business-cover" col-5>
									<img [src]="business.cover_image_url"/>
								</ion-col>
								<ion-col col-7 class='business-desc'>
									<div class='info'>
										<h4>{{business.name}}</h4>
										<div class="rating-box" (click)="pushReviewsPage(business)">
											<span class="rating">
												<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
											</span>
											<span>{{business.rating_by}}</span>
										</div>
										<p>
											<span class="pull-right">{{business.distance}}mi</span>
										</p>
									</div>
									<ion-row class="action">
										<ion-col col-6>
											<button ion-button block color="light" (click)="pushWorkPage(business)">PHOTOS</button>
										</ion-col>
										<ion-col col-6>
											<button ion-button block (click)="pushBusinessDetail(business.id)">REZERV</button>
										</ion-col>
									</ion-row>
								</ion-col>
							</ion-row>
						</ion-grid>
						<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
						   <ion-infinite-scroll-content></ion-infinite-scroll-content>
						</ion-infinite-scroll>
					</ng-container>
				</ng-container>
				<ng-container  *ngIf="displayType == 'price'">
					<ng-container *ngIf="!businessesPriceSortList.length">
						<div class='no-result'>
							<div>
								<i class="fal fa-search"></i>
								<p>No Business Found near to you</p>
							</div>
						</div>
					</ng-container>
					<ng-container *ngIf="businessesPriceSortList.length">
						<ion-grid>
							<ion-row *ngFor="let business of businessesPriceSortList">
								<ion-col class="business-cover" col-5>
									<img [src]="business.cover_image_url"/>
								</ion-col>
								<ion-col col-7 class='business-desc'>
									<div class='info'>
										<h4>{{business.name}}</h4>
										<div class="rating-box" (click)="pushReviewsPage(business)">
											<span class="rating">
												<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
											</span>
											<span>{{business.rating_by}}</span>
										</div>
										<p>
											<span class="pull-right">{{business.distance}}mi</span>
										</p>
									</div>
									<ion-row class="action">
										<ion-col col-6>
											<button ion-button block color="light" (click)="pushWorkPage(business)">PHOTOS</button>
										</ion-col>
										<ion-col col-6>
											<button ion-button block (click)="pushBusinessDetail(business.id)">REZERV</button>
										</ion-col>
									</ion-row>
								</ion-col>
							</ion-row>
						</ion-grid>
						<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
						   <ion-infinite-scroll-content></ion-infinite-scroll-content>
						</ion-infinite-scroll>
					</ng-container>
				</ng-container>
				<ng-container  *ngIf="displayType == 'rating'">
					<ng-container *ngIf="!businessesReviewSortList.length">
						<div class='no-result'>
							<div>
								<i class="fal fa-search"></i>
								<p>No Business Found near to you</p>
							</div>
						</div>
					</ng-container>
					<ng-container *ngIf="businessesReviewSortList.length">
						<ion-grid>
							<ion-row *ngFor="let business of businessesReviewSortList">
								<ion-col class="business-cover" col-5>
									<img [src]="business.cover_image_url"/>
								</ion-col>
								<ion-col col-7 class='business-desc'>
									<div class='info'>
										<h4>{{business.name}}</h4>
										<div class="rating-box" (click)="pushReviewsPage(business)">
											<span class="rating">
												<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
											</span>
											<span>{{business.rating_by}}</span>
										</div>
										<p>
											<span class="pull-right">{{business.distance}}mi</span>
										</p>
									</div>
									<ion-row class="action">
										<ion-col col-6>
											<button ion-button block color="light" (click)="pushWorkPage(business)">PHOTOS</button>
										</ion-col>
										<ion-col col-6>
											<button ion-button block (click)="pushBusinessDetail(business.id)">REZERV</button>
										</ion-col>
									</ion-row>
								</ion-col>
							</ion-row>
						</ion-grid>
						<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
						   <ion-infinite-scroll-content></ion-infinite-scroll-content>
						</ion-infinite-scroll>
					</ng-container>
				</ng-container>
			</div>
  		</div>

  		<div class='single-view' *ngIf="selectedBusiness && displayType == 'map'">
  			<ion-grid>
	  			<ion-row>
					<ion-col class="business-cover" col-5>
						<img [src]="selectedBusiness.cover_image_url"/>
					</ion-col>
					<ion-col col-7 class='business-desc'>
						<div class='info'>
							<button class="close-me" ion-button clear (click)="selectedBusiness=null"><ion-icon name="ios-close"></ion-icon></button>
							<h4>{{selectedBusiness.name}}</h4>
							<div class="rating-box" (click)="pushReviewsPage(selectedBusiness)">
								<span class="rating">
									<span [ngStyle]="{width: selectedBusiness.rating_count * 20 + '%'}" ></span>
								</span>
								<span>{{selectedBusiness.rating_by}}</span>
							</div>
							<p>
								<span class="pull-right">{{selectedBusiness.formatted_address}} {{selectedBusiness.distance}}mi</span>
							</p>
						</div>
						<ion-row class="action">
							<ion-col col-6>
								<button ion-button block color="light" (click)="pushWorkPage(selectedBusiness)">PHOTOS</button>
							</ion-col>
							<ion-col col-6>
								<button ion-button block (click)="pushBusinessDetail(selectedBusiness.id)">REZERV</button>
							</ion-col>
						</ion-row>
					</ion-col>
				</ion-row>
			</ion-grid>
  		</div>
	</ion-content>
  `
})
export class Home {
	next_page_url:any = null;
	current_page:number = 1;
	current_zoom:number = 8;

	user:any;
	isSearchingMode:boolean = false;
	searchEnd:boolean = false;
	searchResult: Array<any> = [];
	businesses: Array<any> = [];

	businessesReviewSortList: Array<any> = [];
	businessesAlphaSortList: Array<any> = [];
	businessesPriceSortList: Array<any> = [];

	displayType: string = 'map';

	/*GOOGLE MAP VARIABLES*/
	map: any;
	markers:Array<any> = [];

	mylocation:any = null;
	categories:any;

	selectedBusiness:any = null;

	filter:any = {
		alphabatical:{is_show:false,value: 'asc'},
		reviews:{is_show:false,value: 'asc'},
		price:{is_show:false,value: 'desc'},
		category:{is_show:false,value: null},
		availabilty:{is_active: 1},
		distance:{is_active: 1,value: 7500},
	};

	constructor(public storage: Storage,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		public locationService: LocationService,
		authService: AuthProvider,
		public dataService: DataService) {

		if(this.navParams.get('id')){
			this.pushBusinessDetail(this.navParams.get('id'));
		}
		authService.user.subscribe(user => {
			this.user = user;
		});
	}

	ionViewDidEnter(){
		this.loadCategories();

		this.locationService.getPlace().then((address)=>{
			this.mylocation = address;
			this.loadMap();
		});

		let f = this.navParams.get('filter');
		if(f){
			if(this.filter.category.value != f.category.value){
				this.filter = f;
				this.loadBusinesses()
			}
			else{
				this.filter = f;
				this.updateBusinesslist();
			}
		}
	}

	loadCategories(){
		//this.dataService.withLoader();
		this.dataService.get('category/list').subscribe((categories) => {
			categories.unshift({id:0,title:'All'});
			this.categories = categories;
		}, (err) => {
			console.log(err);
		});
	}
	setSearchCat(id){
		this.filter.category.value = id;
		this.loadBusinesses();
	}
	viewFilter() {
		this.navCtrl.push(Filter,{ filter: this.filter, categories:this.categories });
	}

	requestBusiness(query=null,category_id=0,page=1){
		let params = new URLSearchParams();
		params.set('latitude',this.mylocation.latitude );
		params.set('longitude',this.mylocation.longitude);
		params.set('country',this.mylocation.country);
		params.set('category_id',category_id.toString());
		params.set('distance','100');
		params.set('page',page.toString());
		return this.dataService.get('business/list?'+params);
	}
	loadBusinesses() {
		this.dataService.withLoader();
		this.requestBusiness(null,this.filter.category.value).subscribe((res) => {
			this.businesses = res.data;
			this.updateBusinesslist();
			this.addMapLocation();
		}, (err) => {
			console.log(err);
		});
	}
	doInfinite(infiniteScroll) {
		if(this.next_page_url){
			this.requestBusiness(null,this.filter.category.value,(++this.current_page)).subscribe((res) => {
				this.businesses.push(...res.data);
		    	this.next_page_url = res.next_page_url;
		    	this.current_page = res.current_page;
				this.updateBusinesslist();
				this.addMapLocation();
				infiniteScroll.complete();
			}, (err) => {
				infiniteScroll.complete();
				console.log(err);
			});
		}
		infiniteScroll.complete();
	}
	searchBusiness(ev: any){
		if(ev.target.value && ev.target.value.length){
			this.isSearchingMode = true;
			this.searchEnd = false;
			this.requestBusiness(ev.target.value,0).subscribe((res) => {
				this.searchResult = res.data;
				this.searchEnd = true;
			}, (err) => {
				console.log(err);
			});
		}else{
			this.isSearchingMode = false;
			this.searchResult = [];
		}
	}

	updateBusinesslist(){
		let businesses = this.businesses;
		this.businessesReviewSortList = _.orderBy(businesses, ['rating_count'], [this.filter.alphabatical.value]);
		this.businessesAlphaSortList = _.orderBy(businesses, ['name'], [this.filter.alphabatical.value]);
		this.businessesPriceSortList = _.orderBy(businesses, ['rating_count'], ['desc']);;
	}
	clearSearch(){
		this.isSearchingMode = false;
		this.searchResult = [];
	}
	addMapLocation(){
		//return;

		for (var i = 0; i < this.markers.length; i++) {
        	this.markers[i].setMap(null);
        }
        this.markers = [];
		if(this.businesses.length){
			var bounds = new google.maps.LatLngBounds();
			for (let business of this.businesses){
				var marker = new google.maps.Marker({
		          position: new google.maps.LatLng(business.latitude, business.longitude),
		          map: this.map,
		          icon:{
					    url: 'http://api.rezervnow.com/icon/marker.png',
					    // scaledSize: new google.maps.Size(50, 50),
					    // origin: new google.maps.Point(0,0),
					    // anchor: new google.maps.Point(0, 0)
					}
		        });
		        marker.addListener('click',()=>{
		        	this.selectedBusiness = business;
					//this.pushBusinessDetail(business);
				});

				bounds.extend(marker.getPosition());
		        this.markers.push(marker);
			}
			this.map.fitBounds(bounds);
			this.map.setCenter(bounds.getCenter());
			this.map.setZoom(8);
		}
	}
	loadMap(){

		let mapOptions:any = {
			zoom: 10,
			minZoom: 6,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			fullscreenControl: false,
			streetViewControl: false,
			zoomControl: false,
		};
		if(this.mylocation && this.mylocation.latitude){
			let latLng = new google.maps.LatLng(this.mylocation.latitude, this.mylocation.longitude);
			mapOptions.center = latLng;
		}
		if (document.getElementById('map')) {
			this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
			if(this.mylocation && this.mylocation.latitude){
				new google.maps.Marker({
		          position: new google.maps.LatLng(this.mylocation.latitude, this.mylocation.longitude),
		          map: this.map,
		          icon:{url: 'http://api.rezervnow.com/icon/mylocate-marker.png'}
		        });
			}
			this.map.addListener('zoom_changed',()=>{
				if(this.map.getZoom() < this.current_zoom && this.next_page_url){
					this.current_zoom = this.map.getZoom();
					this.requestBusiness(null,this.filter.category.value,(++this.current_page)).subscribe((res) => {
						this.businesses.push(...res.data);
				    	this.next_page_url = res.next_page_url;
				    	this.current_page = res.current_page;
						this.updateBusinesslist();
						this.addMapLocation();
					}, (err) => {
						console.log(err);
					});
				}
	        });
		}
		
	}
	pushBusinessDetail(id) {
		this.navCtrl.push(BusinessDetail, { id: id });
	}
	getAvailability(business){
		let w = new Date().getDay();
		let day = business.availability.find(x => x.day_of_week == w);
		if(day.is_available){
			let currenttime = moment().utc();
			let aval = day.slots;
			let open = moment().format('YYYY-MM-DD '+aval[0].open);
			let close = moment().format('YYYY-MM-DD '+aval[0].open);
			
			if(currenttime >= moment(open).utc() && currenttime <= moment(close).utc()){
				return 'Available Now';	
			}else{
				return 'Opening:'+moment(open).format('hh:mm A');
			}
		}
		else{
			return 'Not Available Today';
		}
	}
	pushReviewsPage(obj,type='business') {
		this.navCtrl.push(UserBusinessReviews, { data:{
			id:obj.id,
			type:type,
			tite:obj.name,
		}});
	}
	pushWorkPage(business) {
		this.navCtrl.push(UserBusinessWork, { data: {
			id:business.id,			
			type:'B',			
			title:business.name,			
		}});
	}
}
