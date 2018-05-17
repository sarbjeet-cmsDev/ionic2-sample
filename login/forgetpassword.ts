import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth';
import { DataService } from '../../providers/data';
import { LocationService } from '../../providers/location';
import { Login } from './login';
import { FormService } from '../../providers/form';
import { AsYouType } from 'libphonenumber-js';

@Component({
  selector: 'page-forgetpassword',
  template: `
	<ion-content text-center>
		<button ion-button clear class='go-back' (click)="goBack()">
			<ion-icon name="ios-arrow-round-back"></ion-icon>
		</button>
		<div [hidden]="formStep != 1">
			<form #emailForm="ngForm" (ngSubmit)="sendCode(emailForm)">
				<div>
				    <h5>We will email you a confirmation code.</h5>
				</div>
		 		<ion-list no-lines>
					<ion-item>
						<input type="text" name="phone_number" (keyup)="formatNumber($event)" #phone_number="ngModel" ngModel required placeholder="Phone Number"/>
					</ion-item>
					<ion-item text-center>
						<button ion-button full outline type="submit">NEXT</button>
					</ion-item>
				</ion-list>	
			</form>
		</div>
		<div [hidden]="formStep != 2">
			<form #codeConfirmationForm="ngForm" (ngSubmit)="matchCode(codeConfirmationForm)">
				<div>
				    <h5>Please fill OTP to reset password.</h5>
				</div>
				<ion-list no-lines>
					<ion-item>
						<input type="password" name="code" [(ngModel)]="code" placeholder="Confirmation Code"/>
					</ion-item>
					<ion-item>
						<button ion-button full outline type="submit">NEXT</button>
					</ion-item>
					<ion-item text-center>
						<button (click)="formStep = formStep-1" ion-button clear icon-left>
								<ion-icon name="ios-arrow-back"></ion-icon> 
								<label>Back</label>
						</button>
					</ion-item>
				</ion-list>
			</form>
		</div>
		<div [hidden]="formStep != 3">
			<form #resetForm="ngForm" (ngSubmit)="resetPassword(resetForm,emailForm)">
				<div>
				    <h5>New Password</h5>
				</div>
				<ion-list no-lines>
					<ion-item>
						<input type="password" name="password" [(ngModel)]="password" minlength="6" required placeholder="Password"/>
					</ion-item>
					<ion-item>
						<input type="password" name="confirm_password" required [(ngModel)]="confirm_password" placeholder="Confirm Password"/>
					</ion-item>
					<ion-item>
						<button ion-button full outline type="submit">Reset Password</button>
					</ion-item>
					<ion-item text-center>
						<button (click)="formStep = formStep-1" ion-button clear icon-left>
								<ion-icon name="ios-arrow-back"></ion-icon> 
								<label>Back</label>
						</button>
					</ion-item>
				</ion-list>
			</form>
		</div>
	</ion-content>
  `
})

export class ForgetPassword {

	formStep:number = 1;
	ccode: number;
	constructor(public navCtrl: NavController,
	public dataService: DataService,
	public authService: AuthProvider,
	locationService: LocationService,
	public alertCtrl:AlertController,
	private toastCtrl: ToastController) {

	}

	matchCode(form){
		if(form.valid){
			if(form.value.code == this.ccode)
				this.formStep++;
			else{
				this.toastCtrl.create({message:'Oops! OTP is invalid!',duration: 2000}).present();
			}
		}else{
			this.toastCtrl.create({message:'OTP is Required!',duration: 2000}).present();
		}
	}
	sendCode(form){
		let errors = FormService.validate(form);
		if(!errors.length && form.valid){
			this.dataService.withLoader();
			this.dataService.post('fpsendcode',form.value).subscribe((res)=>{
				this.ccode = res.code;
				this.formStep++;
			},(err)=>{
				this.toastCtrl.create({message:err.error,duration: 2000}).present();
			});
		}
		else{
			this.toastCtrl.create({message:errors[0],duration: 2000}).present();
		}
	}
	resetPassword(form,emailForm){
		let errors = FormService.validate(form);
		if(!errors.length && form.valid)
		{
			if(form.value.password == form.value.confirm_password){
				this.dataService.withLoader();
				this.dataService.post('resetpwd',Object.assign(form.value,emailForm.value)).subscribe((res)=>{
					this.alertCtrl.create({
				      title: 'Success',
				      message: 'Password updated please lgonm?',
				      buttons: [
				        {
				          text: 'login',
				          handler: () => {
				          	this.navCtrl.setRoot(Login);
				          }
				        }
				      ]
				    }).present();

				},(err)=>{
					this.toastCtrl.create({message:err.error,duration: 2000}).present();
				});
			}
			else{
				this.toastCtrl.create({message:"Oops! Password didn't match!",duration: 2000}).present();
			}

		}else{
            this.toastCtrl.create({message:errors[0],duration: 2000}).present();
        }
	}
	formatNumber(ev:any){
        ev.target.value = new AsYouType().input(ev.target.value);
    }
    goBack(){
		this.navCtrl.pop();			
	}

}
