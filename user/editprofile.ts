import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';
import { FormService } from '../../providers/form';
@Component({
	selector:'user-edit-profile',
  	template: `
  	<ion-header>
  	<ion-navbar>
		<ion-title>Edit Profile</ion-title>
	</ion-navbar>
	</ion-header>
  	<ion-content>
  		<div [hidden]="fromStep != 1">
	  		<form #userForm="ngForm" *ngIf='user'>
	  			<ion-list no-lines>
	  				<ion-item-divider>Personal Information</ion-item-divider>
	  				<ion-item>
	  					<input type="text" name="first_name" required minlength="4" pattern='[A-Za-z]*' [(ngModel)]="user.first_name" placeholder="First Name"/>
	  				</ion-item>
	  				<ion-item>
	  					<input type="text" name="last_name" required minlength="4" pattern='[A-Za-z]*' [(ngModel)]="user.last_name" placeholder="Last Name"/>
	  				</ion-item>
	  				<ion-item>
	  					<ion-label>Date of Birth</ion-label>
	  					<ion-datetime displayFormat="MM/DD/YYYY" placeholder="MM/DD/YYYY" name="dob" [(ngModel)]="user.dob"></ion-datetime>
	  				</ion-item>
	  				<ion-item>
	  					<input type="tel" name="phone_number" [ngModel]="user.phone_number" placeholder="Phone Number"/>
	  				</ion-item>
	  				<ion-item>
	  					<input type="text" name="email" [ngModel]="user.email" placeholder="Email"/>
	  				</ion-item>
	  				<ion-item-divider>Address</ion-item-divider>
	  				<div ngFormGroup="address">
	  					<ion-item>
		  					<input type="text" name="street_address" [(ngModel)]="user.address.street_address" placeholder="Street Address"/>
		  				</ion-item>
		  				<ion-item>
		  					<input type="text" name="city" pattern='[A-Za-z ]*' [(ngModel)]="user.address.city" placeholder="City"/>
		  				</ion-item>
		  				<ion-item>
		  					<input type="text" name="region" pattern='[A-Za-z ]*'  [(ngModel)]="user.address.region" placeholder="Region"/>
		  				</ion-item>
		  				<ion-item>
		  					<input type="text" name="zipcode" [pattern]="zipPattern" [(ngModel)]="user.address.zipcode" placeholder="Zip Code"/>
		  				</ion-item>
	  				</div>
	  				<ion-item>
	  					<button ion-button full outline (click)="update(userForm)">Save</button>
	  				</ion-item>
	  			</ion-list>
			</form>
		</div>
		<div [hidden]="fromStep != 2">
			<form #otpForm="ngForm" (ngSubmit)="submitOTP(otpForm)">
				<ion-list no-lines>
					<ion-item>
						<ion-label>Please Enter OTP.</ion-label>
					</ion-item>
					<ion-item>
						<input type="password" required name="otp" #otp="ngModel" ngModel placeholder="Enter OTP"/>
					</ion-item>
					<ion-item>
						<button ion-button full outline>Save</button>
					</ion-item>
				</ion-list>
			</form>
		</div>
	</ion-content>
  `
})
export class EditProfile {
	userForm:any;
	fromStep:number = 1;
	user:any;
	ccode:number = 0;
	zipPattern:any = new RegExp('^\\d{5}(-\\d{4})?$');

	constructor(public dataService: DataService,
		public navCtrl: NavController,
		public authService: AuthProvider,
		private toastCtrl: ToastController,
		public popoverCtrl: PopoverController) {
		authService.user.subscribe(user => {
			this.user = user;
		});
	}
	update(form){
		let errors = FormService.validate(form);
		if(!errors.length && form.valid)
		{
			if(form.value.phone_number != this.user.phone_number || form.value.email != this.user.email){
				this.userForm = form;
				let data:any = {};
				if(form.value.phone_number != this.user.phone_number){
					data.phone_number = form.value.phone_number;
					this.userForm.value.email = this.user.email;
				}
				else{
					this.userForm.value.phone_number = this.user.phone_number;
					data.email = form.value.email;
				}
				this.dataService.post('sendcode',data).subscribe(res=>{
					this.ccode = res.code;
					this.fromStep += 1;
				},err=>{
					this.toastCtrl.create({message:err.message,duration: 2000}).present();
				});
			}
			else{
				this.submitData(form)
			}
		}else{
            this.toastCtrl.create({message:errors[0],duration: 2000}).present();
        }
	}
	submitOTP(form){
		if(this.ccode == form.value.otp){
			this.submitData(this.userForm)
		}else{
			this.toastCtrl.create({message:'Incorrect OTP!',duration: 2000}).present();
		}
	}
	submitData(form){
		this.dataService.withLoader();
		this.dataService.post('user/profile',form.value).subscribe((user)=>{
			this.authService.user.next(user);
			if(user.token) this.authService.updateToken(user.token);
			this.navCtrl.pop();
		},(err)=>{
			this.toastCtrl.create({message:err.error,duration: 2000}).present();
		});
	}
}
