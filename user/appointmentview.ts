import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { UserProvider } from '../../providers/user';
import { UserRezerv } from './rezerv';
import { BusinessDetail } from './business';

import * as moment from 'moment';

@Component({
	selector:'user-appointments',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{ appointment?.increment_id }}</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content>
  		<ng-container *ngIf='appointment'>
	  		<ion-list no-lines>
				<ion-item-divider>Business Detail</ion-item-divider>
				<ion-item (click)='pushBusinessDetail(appointment.business.id)'>
					<ion-avatar item-start>
			      		<img [src]="appointment.business.logo_url"/>	
			    	</ion-avatar>
			    	<h2>{{ appointment.business.name }}</h2>
					<p>{{ appointment.business.formatted_address }}</p>
					<p item-end><i class="fal fa-external-link"></i></p>
			    </ion-item>
				<ion-item-divider>Services</ion-item-divider>	
				<ion-item *ngFor='let service of appointment.services'>
					<ion-avatar item-start>
			      		<img [src]="service.staff.avatar_url"/>	
			    	</ion-avatar>
			    	<h2>{{ service.title }}</h2>
					<p>{{ service.from | date:'shortTime' }}-{{ service.to | date:'shortTime' }}</p>
					<p>with {{ service.staff.name }}</p>
					<h2 item-end>{{ service.price | currency:appointment.business.currency }}</h2>
			    </ion-item>
			    <ion-item>
			    	<h2 text-right>Tax :{{ appointment.tax | currency:appointment.business.currency }}</h2>
			    	<h2 text-right>Discount :{{ appointment.discount | currency:appointment.business.currency }}</h2>
			    	<h2 text-right>Total :{{ appointment.total | currency:appointment.business.currency }}</h2>
			    </ion-item>
			    <ion-item>
			    	<ng-container *ngIf="appointment.status != 'canceled'">
				    	<button ion-button outline full color="danger" (click)="showConfirm(appointment)">
				    		Cancel Appointment
				    	</button>
			    	</ng-container>
			    	<ng-container *ngIf="appointment.status == 'confirmed'">
				    	<button ion-button outline full color="success" (click)="rescheduleAppointment(appointment)">
				    		Reschedule
				    	</button>
			    	</ng-container>

			    	<ng-container *ngIf="appointment.status == 'clientconfirm'">
				    	<button ion-button outline full color="success" (click)="confirm(appointment)">
				    		Confirm
				    	</button>
			    	</ng-container>

			    </ion-item>
		    </ion-list>
  		</ng-container>
	</ion-content>
  `
})
export class AppointmentView{
	appointment:any;
	constructor(public navCtrl: NavController,
		public modalCtrl: ModalController,
		navParams: NavParams,
		private toastCtrl: ToastController,
		public actionSheetCtrl: ActionSheetController,
		public alertCtrl: AlertController,
		public dataService: DataService,
		public userService: UserProvider) {

		let id = navParams.get('id');
		this.dataService.withLoader();
		this.dataService.get('user/appointment/'+id).subscribe(appointment => this.appointment = appointment);
	}
	showConfirm(appointment) {
		let confirm = this.alertCtrl.create({
		title: 'Are you sure?',
		message: 'Do you want to cancel appointment?',
		buttons: [
			{
				text: 'No',
				handler: () => {}
			},
			{
				text: 'Yes',
				handler: () => {
					this.CancelAppointment(appointment);
				}
			}]
		});
		confirm.present();
	}

	rescheduleAppointment(appointment){
		let setting = JSON.parse((appointment.business.settings.find(s => s.key =='booking_reschedule')).value);
		if(moment().toDate() < moment(appointment.from).subtract(setting.value,setting.unit).toDate()){
			this.navCtrl.push(UserRezerv,{appointment:appointment});	
		}
	}

	CancelAppointment(appointment){
		this.dataService.withLoader();
		this.dataService.delete("appointment/"+appointment.id).subscribe((res) => {
		    this.appointment.status = res.status;
		    this.userService.refresh.next('appointment');
	    }, (err) => {
	    	this.toastCtrl.create({message:err.error,duration: 2000,position:'top'}).present();
	    });
	}
	confirm(appointment){
		this.dataService.withLoader();
		this.dataService.put("appointment/"+appointment.id,{}).subscribe((res) => {
		    this.appointment.status = res.status;
		    this.userService.refresh.next('appointment');
	    }, (err) => {
	    	
	    });
	}
	pushBusinessDetail(id) {
		this.navCtrl.push(BusinessDetail, { id: id });
	}
}
