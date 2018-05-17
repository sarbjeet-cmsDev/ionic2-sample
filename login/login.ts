import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { FormService } from '../../providers/form';

import { AuthProvider } from '../../providers/auth';
import { LocationService } from '../../providers/location';
import { ForgetPassword } from './forgetpassword';
import { TabsPage } from '../user/tabs';
import { BusinessIndex } from '../business/index';
import { Decision } from '../start/decision';

import { BlockedPage } from '../start/block';
import { BusinessSettingSubscription } from '../business/setting/subscription';

@Component({
  selector: 'page-login',
  template: `
	<ion-content text-center>
		<button ion-button clear class='go-back' (click)="goBack()">
			<ion-icon name="ios-arrow-round-back"></ion-icon>
		</button>
		<div>
			<form #loginForm="ngForm">
				<ion-grid>
					<ion-row text-center class='mrg-bot-20'>
						<ion-col>
							<img src="assets/icon/logo.png"/>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col>
							<input name="email" [(ngModel)]="email" required  type="email" placeholder="Email" [pattern]="emailRegex" />
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col>
							<input type="password" name='password' [(ngModel)]="password" required  placeholder="*******"/>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col>
							<button ion-button outline full (click)="doLogin(loginForm)">Login</button>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col>
							<button [navPush]="pushAccountDecisionPage" ion-button clear icon-left>
									<ion-icon name="ios-arrow-forward"></ion-icon> 
									<label>Create Account</label>
							</button>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col>
							<button [navPush]="pushForgetPasswordPage" ion-button clear icon-left>
									<ion-icon name="ios-arrow-forward"></ion-icon> 
									<label>Forgot Password?</label>
							</button>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col>
							<button ion-button class="fb" medium type="button" icon-left (click)="fblogin()">
								<ion-icon name="logo-facebook"></ion-icon>
								Login with Facebook
							</button>
						</ion-col>
					</ion-row>				
				</ion-grid>
			</form>
		</div>
		
	</ion-content>
  `
})

export class Login {
	pushAccountDecisionPage:any = Decision;
	pushForgetPasswordPage:any = ForgetPassword;
	emailRegex:any = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
	errmsg: string;
	country:any;
	constructor(public loadingCtrl: LoadingController,
			public navCtrl: NavController,
			public authService: AuthProvider,
			private toastCtrl: ToastController,
			private fb: Facebook,
			locationService: LocationService) {

		locationService.place.subscribe((location)=>{
			if(location)
				this.country = location.country;
		});
	}

	doLogin(form){
		let errors = FormService.validate(form);

		if(!errors.length && form.valid){
            const loading = this.loadingCtrl.create({
		    	content: 'Please wait...'
		  	});
		  	loading.present();
			this.authService.login(form.value).then((user) => {
				if(user.role == 'client'){
					this.navCtrl.push(TabsPage);
				}else{
					this.navCtrl.push(BusinessIndex);
				}
			   	loading.dismiss();
		    }, (err) => {
		    	loading.dismiss();
		    	if(err.error == 'NOSUBSCRIPTION'){
	    			this.navCtrl.push(BusinessSettingSubscription,{referer:true});
	        	}else if(err.error == 'BLOCKED'){
	    			this.navCtrl.push(BlockedPage);
	        	}else{
	        		this.toastCtrl.create({message:err.error,duration: 2000}).present();
	        	}
		    });
        }else{
            this.toastCtrl.create({message:errors[0],duration: 2000}).present();
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
		        	avatar:profile.picture_large.data.url,
		        	country:this.country
		        }).then((user) => {
		        	if(user.role == 'client'){
						this.navCtrl.push(TabsPage);
					}else{
						this.navCtrl.push(BusinessIndex);
					}
			    }, (err) => {
			    	if(err.error == 'NOSUBSCRIPTION'){
		    			this.navCtrl.push(BusinessSettingSubscription,{referer:true});
		        	}else if(err.error == 'BLOCKED'){
		    			this.navCtrl.push(BlockedPage);
		        	}else{
		        		this.toastCtrl.create({message:err.error,duration: 2000}).present();
		        	}
			    });
		    });
	  	})
		.catch(e => {

		});
    }
    goBack(){
		this.navCtrl.pop();			
	}
}
