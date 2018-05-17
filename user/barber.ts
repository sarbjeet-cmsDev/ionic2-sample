import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user';
import { UserRezerv } from './rezerv';
import { DataService } from '../../providers/data';
import { UserBusinessReviews } from './reviews';

@Component({
	selector:'user-barber-detail',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title *ngIf="barber">{{barber.name}}</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content>

  		<div padding-horizontal [hidden]="!loading">
			<ngx-content-loading [height]="150">
				<svg:g ngx-circle cy="35%" cx="15%" r="15%" ry="30"></svg:g>
				<svg:g ngx-rect width="70%" height="30" y="20" x="30%" rx="0" ry="0"></svg:g>
				<svg:g ngx-rect width="70%" height="30" y="60" x="30%" rx="0" ry="0"></svg:g>
			</ngx-content-loading>
			<ngx-content-loading [height]="60" *ngFor="let x of [1,2,3,5,6]">
				<svg:g ngx-rect width="100%" height="50" y="0" x="0" rx="0" ry="0"></svg:g>
			</ngx-content-loading>
		</div>

  		<ion-grid *ngIf="barber && business" class="business-detail">
  			<ion-row class="align-center">
  				<ion-col col-3>
  					<ion-avatar>
  						<img [src]='barber.avatar_url' width="100%"/>
  					</ion-avatar>
  				</ion-col>
  				<ion-col col-8 offset-1>
  					<ion-row class="align-center">
		  				<ion-col>
							<div class="rating-box" (click)="pushReviewsPage(barber)">
								<span class="rating">
									<span [ngStyle]="{width: barber.rating_count * 20 + '%'}" ></span>
								</span>
							</div>
		  				</ion-col>
		  				<ion-col col-3 text-center>
		  					<button ion-button clear (click)="share()">
		  						<i class="fal fa-share-square"></i>
		  					</button>
		  				</ion-col>
		  			</ion-row>
					<ion-row>
						<ion-col>
							<h6>{{ business.name }}</h6>
						</ion-col>
					</ion-row>
  				</ion-col>
  			</ion-row>
  		</ion-grid>

  		<ion-grid *ngIf="barber" class="service-list" padding-horizontal class="service-list">
  			<ion-row *ngFor="let service of barber.services;">
  				<ion-col col-9>
  					<h3>{{service.title}}</h3>
  				</ion-col>
  				<ion-col col-3 text-right>
  					<a (click)="service.show_detail = !service.show_detail">See Detail</a>
  				</ion-col>
  				<ion-col col-12 *ngFor="let option of service.options">
  					<ion-row>
  						<ion-col col-3>
  							<strong>{{ option.format_duration }}</strong>
  						</ion-col>
  						<ion-col col-4 text-right>
  							<strong>{{option.price | currency:business.currency }}</strong>
  						</ion-col>
  						<ion-col col-5 text-right>
  							<button ion-button outline class='btn-appadd' [class.active]="isActive(option)" (click)="addToAppointment(option,service,$event)">
  								<span *ngIf="!isActive(option)">Add  <ion-icon ios="ios-add" md="md-add"></ion-icon></span>
  								<span *ngIf="isActive(option)">Added</span>
  							</button>
  						</ion-col>	
  					</ion-row>
  				</ion-col>
  				<ion-col col-12 *ngIf="service.show_detail">
  					<ion-slides [slidesPerView]="service.gallery.length > 1 ? 2 : 1">
	  					<ion-slide *ngFor="let image of service.gallery">
						<img [src]="image.url" />
						</ion-slide>
					</ion-slides>
					<p>{{ service.caption }}</p>
				</ion-col>
  			</ion-row>
  		</ion-grid>

	</ion-content>
	<ion-footer>
		<button *ngIf="appointment.services.length" ion-button icon-right full (click)="goToRezervPage()">Rezerv Now</button>
	</ion-footer>
  `
})
export class BarberDetail {
	loading:boolean = true;

	barber:any;
	business:any;
	appointment:any = {
		paymentmethod:'cash',
		business_id:null,
		on:null,
		subtotal:0.0,
		total:0.0,
		tax:0.0,
		tip:0.0,
		discount:0,
		note:null,
		duration:0,
		service_tax:0,
		is_reschedule:1,
		services:[]
	};

	constructor(private callNumber: CallNumber,
		public dataService: DataService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		private socialSharing: SocialSharing,
		public userService: UserProvider) {

		this.business = this.navParams.get('business');
		this.appointment.business_id = this.business.id;
		this.appointment.service_tax = this.business.service_tax;

		this.loadBarber(this.navParams.get('id'));
	}

	ionViewCanEnter(){
		let app = this.navParams.get('appointment');
		if(app){
			this.appointment = app;
		}
	}

	isActive(option){
		if(this.appointment.services.length){
			let t = this.appointment.services.find(x => x.id == option.id);
			if(t) return 1;
		}
	}
	goToRezervPage(){
		this.navCtrl.push(UserRezerv,{
			appointment:this.appointment,
			business:this.business
		});
	}
	loadBarber(id){
	  	this.loading = true;
	  	this.dataService.get('business/staff/'+id).subscribe((barber) => {
		    this.barber = barber;
		    this.loading = false;
	    }, (err) => {
	    	console.log(err);
	    });
	}
	share(){
		this.socialSharing.share(this.barber.name,
			this.barber.name
		).then(() => {}).catch(() => {});
	}
	addToAppointment(option,service,e){
		let item = option;
		item.title = service.title;
		item.tax = service.tax;
		item.staff = {
			id:this.barber.id,
			name:this.barber.name,
			avatar_url:this.barber.avatar_url,
		};

		let x = this.appointment.services.find(x => (x.service_id == item.service_id && x.id == item.id));
		if(x){
			this.removeItem(item);
		}else{
			let y = this.appointment.services.find(x => x.service_id == item.service_id);
			if(y){
				this.removeItem(item);
			}
			this.appointment.services.push(item);	
		}
	}
	pushReviewsPage(obj,type='barber') {
		this.navCtrl.push(UserBusinessReviews, { data:{
			id:obj.id,
			type:type,
			tite:obj.name,
		}});
	}
	removeItem(item){
		this.appointment.services = this.appointment.services.filter(x => x.service_id != item.service_id);
	}
	dialNumber(){
		this.callNumber.callNumber(this.barber.phone_number, true)
		  .then(() => console.log('Launched dialer!'))
		  .catch(() => console.log('Error launching dialer'));
	}
}
