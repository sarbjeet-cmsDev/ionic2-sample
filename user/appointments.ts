import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { UserProvider } from '../../providers/user';
import { AppointmentView } from './appointmentview';
import { AuthProvider } from '../../providers/auth';

@Component({
	selector:'user-appointments',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Appointments</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content>
  		<ng-container *ngIf='!user'>
  			<login-widget></login-widget>
  		</ng-container>
  		<ng-container *ngIf='user'>
  			<div padding-horizontal [hidden]="!loading">
				<ngx-content-loading [height]="130" *ngFor="let x of [1,2,3,4,5,6]">
					<svg:g ngx-rect width="33%" height="110" y="0" x="0" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="0" x="160" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="40" x="160" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="80" x="160" rx="0" ry="0"></svg:g>
				</ngx-content-loading>
			</div>
  		</ng-container>
  		<ng-container *ngIf="!appointments.length && !loading">
			<div class='no-result'>
				<div>
					<i class="fal fa-heart"></i><br/>
					<p>No favourite Business Found!. You Don't have any appointment yet</p>
				</div>
			</div>
		</ng-container>
		<ng-container *ngIf="appointments.length">
	  		<ion-list>
	  			<ion-item *ngFor="let appointment of appointments" (click)="viewAppointment(appointment)">
	  				<ion-avatar item-start>
	  					<img [src]="appointment.business.logo_url"/>
	  				</ion-avatar>
	  				<h5>{{ appointment.increment_id }} <span class='status {{ appointment.status }}'>{{ appointment.status | uppercase }}</span></h5>
	  				<p>At {{appointment.business.name}} <br/>On {{ appointment.from | date:'medium' }}</p>
	  				<h2 item-end>{{ appointment.total | currency:appointment.business.currency }}</h2>
	  			</ion-item>
			</ion-list>
		</ng-container>
		<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
		   <ion-infinite-scroll-content></ion-infinite-scroll-content>
		</ion-infinite-scroll>
	</ion-content>
  `
})
export class Appointments {	
	user:any;
	loading:boolean = true;
	appointments:Array<any> = [];
	next_page_url:any;

	constructor(public navCtrl: NavController,
		public modalCtrl: ModalController,
		public actionSheetCtrl: ActionSheetController,
		public alertCtrl: AlertController,
		public dataService: DataService,
		public authService: AuthProvider,
		public userService: UserProvider) {

		userService.refresh.subscribe(refresh => {
			if(refresh == 'appointment') this.getAppointments();
		})

		authService.user.subscribe(user => {
			if(user){
				this.user = user;
				this.getAppointments();
			}
		});
		
	}
	viewAppointment(appointment){
		this.navCtrl.push(AppointmentView, { id: appointment.id });					
	}

	getAppointments(){
		this.loading = true;
		this.dataService.get('user/appointment').subscribe(res => {
			this.appointments = res.data;
	    	this.next_page_url = res.next_page_url;
	    	this.loading = false;
		});
	}
	doInfinite(infiniteScroll) {
		if(this.next_page_url){
			this.dataService.get('user/appointment').subscribe((res) => {
			    this.appointments.push(...res.data);
		    	this.next_page_url = res.next_page_url;
		    	infiniteScroll.complete();
		    }, (err) => {
		    	infiniteScroll.complete();
		    	console.log(err);
		    });
		}
		else infiniteScroll.complete();
	}
}
