import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AuthProvider } from '../../providers/auth';
import { Signup } from './signup';

@Component({
  	selector: 'login-widget',
  	template: `
	<ion-content text-center>
		<form #loginForm="ngForm">
			<ion-list no-lines>
				<ion-item text-center>
					<img src="assets/icon/logo_.png" width="200px"/>
				</ion-item>
				<ion-item>
					<input name="email" [(ngModel)]="email" required  type="email" placeholder="Email" [pattern]="emailRegex" />
				</ion-item>
				<ion-item>
					<input type="password" name='password' [(ngModel)]="password" required  placeholder="*******"/>
				</ion-item>
				<ion-item text-center>
					<button ion-button outline full (click)="doLogin(loginForm)">Login</button>
					<button ion-button clear type="button" (click)="goToSingup()">
						Signup
					</button>
				</ion-item>
				<ion-item text-center>
					<button ion-button type="button" icon-left (click)="fblogin()">
						<ion-icon name="logo-facebook"></ion-icon>
						Login with Facebook
					</button>
				</ion-item>
			</ion-list>
		</form>
	</ion-content>
  `
})
export class LoginWidget{
	@Output('loginEvent') loginEvent = new EventEmitter();
	constructor(public navCtrl: NavController,
		private toastCtrl: ToastController,
		private fb: Facebook,
		public authService: AuthProvider) {

	}
	goToSingup(){
		this.navCtrl.push(Signup,{referrer:true});
	}
	
	doLogin(form){
		if(form.valid){
			this.authService.login(form.value).then(user=>{
				this.loginEvent.emit(user);
			},err => {
				this.toastCtrl.create({
				    message: err.error,
				    duration: 3000,
				    position: 'top'
				}).present();
			});
		}
	}
	fblogin(){
    	this.fb.login(['public_profile', 'user_friends', 'email'])
	  	.then((res: FacebookLoginResponse) => {
			this.fb.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
				this.authService.fbsignup({
		        	first_name:profile.first_name,
		        	last_name:profile.last_name,
		        	email:profile.email,
		        	avatar:profile.picture_large.data.url
		        }).then((user) => {
		        	this.loginEvent.emit(user);
			    }, (err) => {
			    	console.log(err.error)
			    	this.toastCtrl.create({message:err.error,duration: 10000}).present();
			    });
		    });
	  	})
		.catch(e => {

		});
    }
}
