import { Component, ViewChild } from '@angular/core';
import { NavController,NavParams, ToastController } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { UserProvider } from '../../providers/user';
import { FormService } from '../../providers/form';
import { AppointmentSuccess } from './appointmentsuccess';
import * as moment from 'moment';

@Component({
	selector:'u-order-confirm-2',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Payment</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content padding>
  		<ion-grid radio-group [(ngModel)]="appointment.paymentmethod">
  			<ion-row>
  				<ion-col>
  					<label>Cash</label>
  				</ion-col>
  				<ion-col col-3 text-right>
  					<ion-radio value="cash"></ion-radio>
  				</ion-col>
  			</ion-row>
  			<ion-row>
  				<ion-col>
  					<label>Credit Card</label>
  				</ion-col>
  				<ion-col col-3 text-right>
  					<ion-radio value="card"></ion-radio>
  				</ion-col>
  			</ion-row>
  			<form #cardForm="ngForm" [hidden]="appointment.paymentmethod != 'card'">
	  			<ion-row>
	  				<ion-col col-12>
	  					<input type='text' name='name' required ngModel placeholder='Name on Card' />
	  				</ion-col>
	  				<ion-col col-12>
	  					<input type='text' name='number' required ngModel placeholder='Card Number' />
	  				</ion-col>
	  				<ion-col col-6>
	  					<input mbsc-date name='expiry' theme="ios" required ngModel dateWheels='MM yy'  dateFormat='MM yy' placeholder="MM/YYYY" />
	  				</ion-col>
	  				<ion-col col-6>
	  					<input type='text' name='cvc' required ngModel placeholder='CVV' />
	  				</ion-col>
	  			</ion-row>
  			</form>
  		</ion-grid>
	</ion-content>
	<ion-footer>
		<button ion-button icon-right full (click)='placeAppointment()'>Place Appointment</button>
	</ion-footer>
  `
})
export class AppointmentPayment {
	@ViewChild('cardForm') card:any;
	appointment:any;
	business:any;
	constructor(public dataService: DataService,
		public navCtrl: NavController,
		public userService: UserProvider,
		private toastCtrl: ToastController,
		public navParams: NavParams) {
		this.appointment = this.navParams.get('appointment');
		this.business = this.navParams.get('business');
	}

	placeAppointment(){
		if(this.appointment.paymentmethod == 'card'){
			let errors = FormService.validate(this.card);
			if(!errors.length && this.card.valid){
				this.appointment.card = {
					name: this.card.value.name,
					number: this.card.value.number,
					exp_month: moment(this.card.value.expiry).get('month'),
					exp_year: moment(this.card.value.expiry).get('year'),
					cvc: this.card.value.cvc
				};
				this.doAppointment(this.appointment);
			}else{
	            this.toastCtrl.create({message:errors[0],duration: 2000,position:'top'}).present();
	        }
		}else{
			this.doAppointment(this.appointment);
		}
	}

	doAppointment(appointment){
		this.dataService.withLoader();
		this.dataService.post('user/appointment',appointment).subscribe((res)=>{
			this.userService.refresh.next('appointment');
   			this.navCtrl.push(AppointmentSuccess);
		},err => {
			this.toastCtrl.create({message:err.error,duration: 2000,position:'top'}).present();
		});
	}

}
