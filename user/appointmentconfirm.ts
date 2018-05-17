import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { UserProvider } from '../../providers/user';
import { AuthProvider } from '../../providers/auth';
import { AppointmentSuccess } from './appointmentsuccess';
import { AppointmentPayment } from './appointmentpayment';

@Component({
	selector:'u-order-confirm-2',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Rezerv</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content padding>
  		<ng-container *ngIf='!user'>
  			<login-widget></login-widget>
  		</ng-container>

  		<ng-container *ngIf='user'>
	  		<h2 no-margin>Appointment Detail</h2>
	  		<h4 no-margin>{{appointment.on | date:'MMMM d, yyyy'}} at {{appointment.on | date:'h:mm a'}}</h4>
	  		
	  		<ion-grid *ngIf="appointment" class='service-list' padding-vertical>
	  			<ion-row *ngFor="let option of appointment.services">
	  				<ion-col col-5>
	  					<h5>{{option.title}}</h5>
	  				</ion-col>
	  				<ion-col col-4>
	  					<small>{{ option.format_duration }}</small>
	  				</ion-col>
	  				<ion-col col-3 text-right>
	  					<h5>{{option.price | currency:business.currency }}</h5>
	  				</ion-col>
	  			</ion-row>
	  			<ion-row class='align-center'>
	  				<ion-col col-2>
	  					<ion-label>TIP</ion-label>
	  				</ion-col>
	  				<ion-col>
	  					<ion-segment (ionChange)="alterTip($event)">
						    <ion-segment-button value="0">NO TIP</ion-segment-button>
						    <ion-segment-button value="15">15%</ion-segment-button>
						    <ion-segment-button value="20">20%</ion-segment-button>
						    <ion-segment-button value="25">25%</ion-segment-button>
						</ion-segment>
	  				</ion-col>
	  			</ion-row>
	  		</ion-grid>
			<div class="clear" margin-top>
				<h5 text-right>Tip: {{ appointment.tip | currency:business.currency }}</h5>
				<h5 text-right>Tax: {{ appointment.tax | currency:business.currency }}</h5>
				<h2> 
					<span float-left>Total</span> 
					<span float-right>{{ appointment.total | currency:business.currency }}</span> 
				</h2>
			</div>
		</ng-container>

	</ion-content>
	<ion-footer>
		<button ion-button icon-right full (click)="saveAppointment()">Confirm<ion-icon name="ios-arrow-forward"></ion-icon></button>
	</ion-footer>
  `
})
export class AppointmentConfirm {
	user:any;
	business:any;
	appointment:any;

	constructor(public dataService: DataService,
		public userService: UserProvider,
		public authService: AuthProvider,
		public navCtrl: NavController,
		public navParams: NavParams) {
		authService.user.subscribe(user => {
			this.user = user;
		});
		this.appointment = this.navParams.get('appointment');
		this.business = this.navParams.get('business');

		let subtotal = 0, tax = 0;
		for(let item of this.appointment.services){
			subtotal += item.price;
			if(item.tax > 0) tax += item.price * (item.tax)/100;
		}
		this.appointment.subtotal = subtotal;
		this.appointment.tax = tax;
		this.appointment.total = subtotal + tax;
	}
	alterTip(ev:any){
		this.appointment.tip = this.appointment.subtotal * ev.value / 100;
		this.appointment.total = this.appointment.tip + this.appointment.subtotal + this.appointment.tax;
	}
	saveAppointment(){
		if(this.business.is_online_payment){
			this.navCtrl.push(AppointmentPayment,{
				appointment:this.appointment,
				business:this.business
			});
		}
		else{
			this.dataService.post('user/appointment',this.appointment).subscribe((res)=>{
				this.userService.refresh.next('appointment');
				this.navCtrl.push(AppointmentSuccess);
			});
		}
	}
}
