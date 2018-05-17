import { Component } from '@angular/core';
import { NavController,ViewController,NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data';


@Component({
	selector:'user-profile',
  	template: `
  	<ion-content padding>
  		<ion-grid>
  			<ion-row>
  				<ion-col>
  					<ion-input [(ngModel)]="otp"></ion-input>
  				</ion-col>
  			</ion-row>
  			<ion-row>
  				<ion-col>
  					<button ion-button (click)="sendotp()">Resend OTP</button>
  				</ion-col>
  				<ion-col>
  					<button ion-button (click)="submit(otp)">Submit</button>
  				</ion-col>
  			</ion-row>
  			<ion-row *ngIf='err'>
  				<ion-col>
  					{{ err }}
  				</ion-col>
  			</ion-row>
  		</ion-grid>
	</ion-content>
  `
})
export class UserProfileOtp {
	data:any= {};
	code:any = {};
	err:string = null;
	constructor(public dataService: DataService,
		public viewCtrl: ViewController,
		navParams: NavParams,
		public navCtrl: NavController,) {
		this.data = navParams.get('data');
		this.code = navParams.get('code');
	}
	sendotp(){
		this.dataService.withLoader();
		this.dataService.post('sendcode',this.data).subscribe(res=>{
			this.code = res.code;
		},err=>{

		});
	}
	submit(otp){
		console.log(otp);
		if(otp == this.code){
			this.viewCtrl.dismiss({success:true});
		}else{
			this.err = 'Invalid OTP';
		}
	}
}
