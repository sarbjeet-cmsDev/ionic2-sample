import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user';
import { ViewNotification } from './viewnotification';
import { AppointmentView } from './appointmentview';
import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';

@Component({
	selector:'user-notifications',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Notifications</ion-title>
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
  		<ng-container *ngIf="!notifications.length && !loading">
			<div class='no-result'>
				<div>
					<i class="fal fa-heart"></i><br/>
					<p>No Notification Found</p>
				</div>
			</div>
		</ng-container>
  		<ng-container *ngIf="notifications.length">
	  		<ion-list>
				<ion-item *ngFor="let notification of notifications" (click)="viewNotification(notification)">
					{{notification.title}}
					<ion-icon name="ios-arrow-forward-outline" item-end></ion-icon>
				</ion-item>
			</ion-list>
			<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
			   <ion-infinite-scroll-content></ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</ng-container>		
	</ion-content>
  `
})
export class Notifications {	
	user:any;
	loading:boolean = true;
	page:number = 0;
	notifications:Array<any> = [];
	next_page_url:any;

	constructor(public dataService: DataService,
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public authService: AuthProvider,
		public userService: UserProvider) {

		authService.user.subscribe(user => {
			if(user){
				this.user = user;
				this.getNotification();
			}
		});
	}
	getNotification(){
		this.loading = true;
		this.dataService.get('user/notifications').subscribe(res => {
			this.notifications = res.data;
	    	this.next_page_url = res.next_page_url;
	    	this.page = res.current_page;
	    	this.loading = false;
		});
	}
	doInfinite(infiniteScroll) {
		if(this.next_page_url){
			this.page += 1;
			this.dataService.get('user/notifications?page='+this.page).subscribe((res) => {
			    this.notifications.push(...res.data);
		    	this.next_page_url = res.next_page_url;
		    	this.page = res.current_page;
		    	infiniteScroll.complete();
		    }, (err) => {
		    	infiniteScroll.complete();
		    });
		}else{
			infiniteScroll.complete();
		}
	}
	viewNotification(notification){
		if(notification.type == 'A'){
			this.viewAppointment(notification.reference_id);
		}
		else{
			this.navCtrl.push(ViewNotification,{notification:notification});
		}	
	}
	viewAppointment(id){
		this.navCtrl.push(AppointmentView,{id:id});
	}

}
