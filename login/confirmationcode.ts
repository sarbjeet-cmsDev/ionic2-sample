import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth';


@Component({
  selector: 'page-confirmation-code',
  template: `
	<ion-content padding text-center>
		<h5>Enter the Confirmation Code</h5>

		<div padding class='msg' text-center>
			A confirmation code has been sent to:
			{{email}}
			<br/>
			<button (click)="resendCode()" ion-button clear icon-left>
					<ion-icon name="ios-arrow-forward"></ion-icon> 
					<label>Resend confirmation code</label>
			</button>
		</div>

		<form [formGroup]="codeConfirmationForm">

			<p class="err" *ngIf="codeConfirmationForm.invalid || errmsg">

				<span *ngIf="codeConfirmationForm.controls.code.errors?.required && (codeConfirmationForm.controls.code.dirty)">
					Code is required.
				</span>
				<span *ngIf="codeConfirmationForm.controls.code.errors?.pattern && (codeConfirmationForm.controls.code.dirty)">
					Code is invalid.
				</span>

				<span *ngIf="errmsg">{{errmsg}}</span>
			</p>
			<br/>
			<ion-list no-lines>
				<ion-item>
					<ion-input type="tel" formControlName="code" placeholder="Confirmation Code"></ion-input>
				</ion-item>
			</ion-list>
		</form>
		<br/>
		<button ion-button full (click)="validateCode()">Confirm</button>
		
	</ion-content>
  `
})

export class ConfirmationCode {
	email:string;
	errmsg: string;

	codeConfirmationForm:FormGroup;

	constructor(params: NavParams,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public authService: AuthProvider) {

		this.email = params.get('email');

		this.codeConfirmationForm = formBuilder.group({
		    code: ['',Validators.compose([
		    	Validators.pattern('[0-9]*'),
		    	Validators.required])]
		});
	}

	validateCode(){
		if(this.codeConfirmationForm.valid){

			const loading = this.loadingCtrl.create({
		    	content: 'Please wait...'
		  	});
		  	loading.present();

			// this.authService.validateCode(this.email, this.codeConfirmationForm.value).then((user) => {
			//     this.navCtrl.push(SignupPassword,{vendor:user});
			//     loading.dismiss();
		 //    }, (err) => {
		 //    	this.errmsg = err;
		 //    	loading.dismiss();
		 //    });
		}
	}
	resendCode(){
		const loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();

		// this.authService.sendComfirmationCode(this.email).then((data) => {
		//     loading.dismiss();
	 //    }, (err) => {
	 //    	loading.dismiss();
	 //    });
	}
}
