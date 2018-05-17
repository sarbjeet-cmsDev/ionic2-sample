import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';
import { ActionSheetController, LoadingController  } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';
import { ImageProvider } from '../../providers/image';
import { SupportTopic } from '../support/topic';

import { Start } from '../start/start';
import { Password } from '../common/password';
import { EditProfile } from './editprofile';
import { UserNotification } from './notification';

import { App } from 'ionic-angular';


@Component({
	selector:'user-profile',
  	template: `
  	<ion-content>
  		<ng-container *ngIf='!user'>
  			<login-widget></login-widget>
  		</ng-container>
  		<ng-container *ngIf="user" >
  			<div text-center>
				<ion-avatar>
					<img src="{{user.avatar_url}}" width="100px" (click)="uploadProfile()">
				</ion-avatar>

				<h4>{{user.name}}</h4>
				<h6>{{user.email}}</h6>

				<ion-list no-lines>
					<ion-item text-center>
						<span (click)="presentPasswordModal()"><ion-icon name="ios-cog"></ion-icon> Reset Password</span>
					</ion-item>
					<ion-item text-center>
						<span (click)="presentProfileModal()"><ion-icon name="ios-cog"></ion-icon> Edit Profile</span>
					</ion-item>

					<ion-item text-center>
						<span [navPush]="pushUserNotification"><ion-icon name="ios-notifications-outline"></ion-icon> Notification</span>
					</ion-item>

					<ion-item text-center>
						<span [navPush]="pushSupportTopic"><ion-icon name="ios-help-circle-outline"></ion-icon> Help</span>
					</ion-item>

					<ion-item text-center>
						<span (click)="logout()">Logout</span>
					</ion-item>
				</ion-list>
			</div>
		</ng-container>
	</ion-content>
  `
})
export class Profile {
	user:any;
	pushSupportTopic:any = SupportTopic;
	pushUserNotification:any = UserNotification;

	constructor(private app:App,
		public loadingCtrl: LoadingController,
		public dataService: DataService,
		public imageService: ImageProvider,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		public actionSheetCtrl: ActionSheetController,
		public authService: AuthProvider) {
		
		authService.user.subscribe(user => {
			if(user){
				this.user = user;
			}
		});
	}

	presentPasswordModal() {
		this.navCtrl.push(Password,{user:this.user});
	}
	presentProfileModal() {
		this.navCtrl.push(EditProfile);
	}
	uploadProfile(){
		this.imageService.chooseImage().subscribe(res => {
			this.user.avatar_url = res.url;
			this.dataService.withLoader();
			this.dataService.post('user/profile/avatar',{path:res.path}).subscribe((user)=>{
				this.authService.user.next(user);
			},(err)=>{ });
		});
	}
	logout(){
		this.authService.logout().then((res)=>{
			this.app.getRootNav().setRoot(Start);	
		});
	}
}
