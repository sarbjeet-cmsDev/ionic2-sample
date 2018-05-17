import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';
import _ from 'lodash';
@Component({
	selector:'user-appointments',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Notification</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content>
  		<ng-container *ngIf='user'>
	  		<ion-list>
				<ion-item>
					<ion-label>Notification</ion-label>
					<ion-toggle (ionChange)="updateSetting(settings.notification)" [(ngModel)]="settings.notification.value"></ion-toggle>
				</ion-item>
				<ion-item>
					<ion-label>Sound</ion-label>
					<ion-toggle (ionChange)="updateSetting(settings.notification_sound)" [(ngModel)]="settings.notification_sound.value"></ion-toggle>
				</ion-item>
				<ion-item>
					<ion-label>Vibrate</ion-label>
					<ion-toggle (ionChange)="updateSetting(settings.notification_vibrate)" [(ngModel)]="settings.notification_vibrate.value"></ion-toggle>
				</ion-item>
		    </ion-list>
  		</ng-container>
	</ion-content>
  `
})
export class UserNotification{
	user:any;
	settings:any;
	constructor(public navCtrl: NavController,
		public dataService: DataService,
		public authService: AuthProvider) {

		authService.user.subscribe(user => {
			this.user = user;
		});

		this.settings = _.keyBy(this.user.setting.map(s => {
			s.value = parseInt(s.value);
			return s;
		}),'key');

	}
	updateSetting(setting){
		this.dataService.withLoader();
		this.dataService.post('user/notification',setting).subscribe(user => {
			this.authService.user.next(user);
		});
	}
}
