import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController,ToastController  } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserProvider } from '../../providers/user';
import { BarberDetail } from './barber';
import { UserBusinessGallery } from './gallery';
import { BarberLocation } from './barberlocation';
import { UserBusinessAvailability } from './availability';
import { UserBusinessReviews } from './reviews';
import { UserBusinessWork } from './work';
import { DataService } from '../../providers/data';

@Component({
	selector:'user-business-detail',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title *ngIf="business">{{business.name}}</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content>
  		<div padding-horizontal [hidden]="!loading">
			<ngx-content-loading [height]="180">
				<svg:g ngx-circle cy="30%" cx="15%" r="15%" ry="30"></svg:g>
				<svg:g ngx-rect width="70%" height="30" y="20" x="30%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="70%" height="30" y="60" x="30%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="23%" height="40" y="120" x="0" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="23%" height="40" y="120" x="25%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="23%" height="40" y="120" x="50%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="25%" height="40" y="120" x="75%" rx="0" ry="0"></svg:g>
			</ngx-content-loading>
			<ngx-content-loading [height]="110" *ngFor="let x of [1,2,3]">
				<svg:g ngx-rect width="33%" height="100" y="0" x="0" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="64%" height="30" y="0" x="35%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="64%" height="30" y="35" x="35%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="64%" height="30" y="70" x="35%" rx="0" ry="0"></svg:g>
			</ngx-content-loading>
		</div>


  		<ion-grid class="business-detail" *ngIf="business">
	  		<ion-row class='t-header-rw'>
		  		<ion-col col-3>
		  			<ion-avatar>
		  				<img class='blogo' src="{{business.logo_url}}" width="100%"/>
		  			</ion-avatar>
		  		</ion-col>
		  		<ion-col col-8 class='t-header'>
		  			<ion-row class="align-center">
		  				<ion-col>
							<div class="rating-box" (click)="pushReviewsPage(business)">
								<span class="rating">
									<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
								</span>
								<span class="count">{{business.rating_by}}</span>
							</div>
		  				</ion-col>
		  				<ion-col col-2 text-center>
		  					<button ion-button clear (click)="share()">
		  						<i class="fal fa-share-square"></i>
		  					</button>
		  				</ion-col>
		  				<ion-col col-2 text-center>
		  					<button ion-button clear (click)="addToFavourite()">
		  						<i *ngIf="!isFavourites()" class="fal fa-heart"></i>
		  						<i *ngIf="isFavourites()" class="fas fa-heart"></i>
		  					</button>
		  				</ion-col>

		  			</ion-row>
					<ion-row>
						<ion-col>
							<h5>{{business.name}}</h5>
						</ion-col>
					</ion-row>
		  		</ion-col>
	  		</ion-row>

	  		<ion-row class='business-action'>
		  		<ion-col>
		  			<button color='light' ion-button outline full (click)="dialNumber()" outline><ion-icon name="ios-call"></ion-icon></button>
		  		</ion-col>
		  		<ion-col>
		  			<button color='light' ion-button outline full (click)="pushLocationPage()" outline><ion-icon name="ios-pin"></ion-icon></button>
		  		</ion-col>
		  		<ion-col>
		  			<button color='light' ion-button outline full (click)="pushAvailabiltyPage()">
		  				<ion-icon name="ios-clock-outline"></ion-icon>
		  			</button>
		  		</ion-col>
		  		<ion-col text-right>
		  			<button color='light' (click)="pushGalleryPage()" ion-button outline full>
		  			<ion-icon name="ios-images-outline"></ion-icon>
		  			</button>
		  		</ion-col>
	  		</ion-row>
  		</ion-grid>

  		<div class="list-area">
	  		<ion-grid *ngIf="business">
	  			<ng-container *ngFor="let barber of business.staff">
					<ion-row *ngIf="barber.services.length">
						<ion-col class="business-cover" col-5>
							<img [src]="barber.avatar_url"/>
						</ion-col>
						<ion-col col-7 class='business-desc'>
							<div class='info'>
								<h4>{{barber.name}}</h4>
								<div class="rating-box" (click)="pushReviewsPage(barber,'barber')">
									<span class="rating">
										<span [ngStyle]="{width: barber.rating_count * 20 + '%'}" ></span>
									</span>
									<span class="count">{{barber.rating_by}}</span>
								</div>
							</div>
							<ion-row class="action">
								<ion-col col-6>
									<button ion-button block color="light" (click)="pushWorkPage(barber)">PHOTOS</button>
								</ion-col>
								<ion-col col-6>
									<button ion-button block (click)="pushBarberDetail(barber)">REZERV</button>
								</ion-col>
							</ion-row>
						</ion-col>
					</ion-row>
				</ng-container>
			</ion-grid>
		</div>

	</ion-content>
  `
})
export class BusinessDetail {
	
	loading:boolean = true;
	business:any;
	favourites:any = [];

	constructor(private socialSharing: SocialSharing,
		private callNumber: CallNumber,
		public dataService: DataService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		private toastCtrl: ToastController,
		public userService: UserProvider) {

		userService.getFavourites().subscribe(res =>{
			this.favourites = res;
		},err => {});

		this.loadBusiness(this.navParams.get('id'));
		
	}

	loadBusiness(id){
		//this.dataService.withLoader();
		this.loading = true;
		this.dataService.get('business/load/'+id).subscribe((business) => {
		    this.business = business;
		    this.loading = false;
	    }, (err) => {
	    	console.log(err);
	    });
	}
	isFavourites(){
		let t = this.favourites.find(x => x == this.business.id);
		if(t) return 1;
	}

	addToFavourite(){
		this.dataService.withLoader();
		this.dataService.post('user/favourite',{business_id:this.business.id}).subscribe((favourites) => {
		    this.favourites = favourites;
		    this.userService.refresh.next('favourite');
	    },err => {
	    	if(err.error =='Unauthorized.'){
	    		this.toastCtrl.create({message:'Please login to add Business as favourite',duration: 2000}).present();
	    	}
	    });
	}

	share(){
		this.socialSharing.share(this.business.name,
			this.business.name
		).then(() => {}).catch(() => {});
	}
	pushBarberDetail(barber) {
		this.navCtrl.push(BarberDetail, { id: barber.id, business: this.business });
	}
	pushGalleryPage() {
		this.navCtrl.push(UserBusinessGallery, { business: this.business });
	}
	pushAvailabiltyPage() {
		this.navCtrl.push(UserBusinessAvailability, { business: this.business });
	}
	pushReviewsPage(obj,type="business") {
		this.navCtrl.push(UserBusinessReviews, { data:{
			id:obj.id,
			type:type,
			tite:obj.name,
		}});
	}
	pushLocationPage() {
		this.navCtrl.push(BarberLocation, { business: this.business });
	}
	dialNumber(){
		this.callNumber.callNumber(this.business.phone_number, true)
		  .then(() => console.log('Launched dialer!'))
		  .catch(() => console.log('Error launching dialer'));
	}
	pushWorkPage(barber) {
		this.navCtrl.push(UserBusinessWork, { data: {
			id:barber.id,			
			type:'S',			
			title:barber.name,			
		}});
	}
}
