import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController  } from 'ionic-angular';
import { FormService } from '../../providers/form';
import { TabsPage } from '../user/tabs';
import { AuthProvider } from '../../providers/auth';
import { DataService } from '../../providers/data';
import { LocationService } from '../../providers/location';
import { AsYouType, CountryCode, format } from 'libphonenumber-js';

@Component({
  selector: 'page-signup',
  template: `
	<ion-content text-center>
		<button ion-button clear class='go-back' (click)="goBack()">
			<ion-icon name="ios-arrow-round-back"></ion-icon>
		</button>
		<form #signupForm="ngForm" (ngSubmit)="sendCode(signupForm)">
			<ion-grid padding-horizontal>
				<div [hidden]="formstep != 1">
					<ion-row class="align-center" text-center>
						<ion-col>
							<h5>Fill Information for signup <br/>& explore your nearby</h5>
						</ion-col>
					</ion-row>
					<ion-row class="align-center">
		                <ion-col col-1 text-left>
		                    <i class="fal fa-user"></i>
		                </ion-col>
		                <ion-col col-6>
		                    <input required 
		                    #first_name="ngModel" 
		                    minlength="4"
		                    ngModel
		                    name="first_name" type="text"  placeholder="First Name"/>
		                </ion-col>
		                <ion-col col-5>
		                    <input required 
		                    #last_name="ngModel" 
		                    minlength="2"
		                    ngModel
		                    name="last_name" type="text"  placeholder="Last Name"/>
		                </ion-col>
		            </ion-row>
		            <ion-row class="align-center">
	                    <ion-col col-1 text-left>
	                        <i class="fal fa-envelope"></i>
	                    </ion-col>
	                    <ion-col>
	                        <input type="email"
	                        required 
	                        #email="ngModel" 
	                        [pattern]="emailRegex"
	                        ngModel
	                        name="email" placeholder="Email"/>
	                    </ion-col>
	                </ion-row>
	                <ion-row class="align-center">
	                    <ion-col col-1 text-left>
	                        <i class="fal fa-phone"></i>
	                    </ion-col>	     
	                    <ion-col>
	                        <input type="tel"
	                        required 
	                        #phone_number="ngModel" 
	                        ngModel (keyup)="_formatNumber($event)"
	                        name="phone_number" placeholder="XXXXX XXXXX"/>
	                        <input type="hidden" name='country' [ngModel]="country" />
	                    </ion-col>
	                </ion-row>
	                <ion-row class="align-center">
	                    <ion-col col-1 text-left>
	                        <i class="fal fa-key"></i>
	                    </ion-col>
	                    <ion-col>
	                        <input required 
	                        #password="ngModel" 
	                        minlength="6"
	                        ngModel
	                        name="password" type="password"  placeholder="Password"/>
	                    </ion-col>
	                </ion-row> 
	                <ion-row>
	                    <ion-col>
	                        <button ion-button outline full type="submit">
	                        	Next
	                        </button>
	                    </ion-col>
	                </ion-row>
				</div>
				<div class="step-2" [hidden]="formstep != 2">
	                <ion-row>
	                    <ion-col text-left>
	                    	<label>Please enter confirmation code:</label>
	                        <input required 
	                        #otp="ngModel" 
	                        minlength="6"
	                        ngModel
	                        [disabled]="formstep != 2"
	                        name="otp" type="password"  placeholder="OTP"/>
	                        <br/>
	                        <label (click)="sendCode(signupForm,1)">Resend code..</label>
	                    </ion-col>
	                </ion-row>  
	                <ion-row>
	                    <ion-col>
	                        <button (click)="doSignup(signupForm)" ion-button outline full type="button">Signup</button>
	                    </ion-col>
	                </ion-row>
	            </div>
			</ion-grid>
		</form>
	</ion-content>
  `
})
export class Signup {

	formstep = 1;
	public submitted: boolean = false;
	ccode: number = 0;
	emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	phoneRegex = /[0-9]{10}/;

	signupkey:boolean = true;
	country:CountryCode = null;

	referrer:boolean = false;

	constructor(public loadingCtrl: LoadingController,
	public navCtrl: NavController,
	public navParams: NavParams,
	public dataService: DataService,
	locationService: LocationService,
	public authService: AuthProvider,
	private toastCtrl: ToastController) {
		if(navParams.get('referrer')) this.referrer = true;
		locationService.getPlace().then((address)=>{
            this.country = address.country;

            //console.log(format({ country: this.country, phone:'98035 28785' }, 'International'))

            //console.log(getCountryCallingCode(this.country));
        },err=>{
        	
        });
	}

	_formatNumber(ev:any){
    	ev.target.value = new AsYouType(this.country).input(ev.target.value);
    }

	sendCode(form,resend = 0){
		let errors = FormService.validate(form);
		if((!errors.length && form.valid) || resend ) {
			this.dataService.withLoader();

			//console.log(format({ country: this.country, phone: form.value.phone_number }, 'International'))
			//form.value.phone_number = format({ country: this.country, phone: form.value.phone_number }, 'International');
			form.value.phone_number = format(form.value.phone_number,this.country, 'International');

			this.dataService.post('signupcode',form.value).subscribe((res)=>{
				this.ccode = res.code;
				this.formstep = 2;
			},(err)=>{
				this.toastCtrl.create({message:err.error,duration: 2000}).present();
			});
		}
		else{
            this.toastCtrl.create({message:errors[0],duration: 2000}).present();
        }
	}

	doSignup(form){
		let errors = FormService.validate(form);
		if(!errors.length && form.valid)
		{
			if(form.value.otp == this.ccode){
			  	//form.value.phone_number = format({ country: this.country, phone: form.value.phone_number }, 'International');
			  	form.value.phone_number = format(form.value.phone_number,this.country, 'International');
			  	// console.log(form.value.phone_number);

				this.authService.signup(Object.assign(form.value, {country:this.country})).then((data) => {
					if(this.referrer){
						this.navCtrl.pop();	
					}else{
						this.navCtrl.setRoot(TabsPage);
					}
			    }, (err) => {
			    	this.toastCtrl.create({message:err.error,duration: 2000}).present();
			    });
			}else{
				this.toastCtrl.create({message:'Oops! OTP is invalid!',duration: 2000}).present();
			}
		}
		else{
            this.toastCtrl.create({message:errors[0],duration: 2000}).present();
        }
	}

	goBack(){
		this.navCtrl.pop();
	}
    
}
