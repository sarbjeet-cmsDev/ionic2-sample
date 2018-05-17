import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
@Component({
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>Select Staff</ion-title>
				<ion-buttons end>
					<button ion-button icon-only (click)="back()">
						<ion-icon name="ios-close"></ion-icon>
					</button>
	            </ion-buttons>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<div  *ngIf="staff.length">
				<ng-container *ngFor="let member of staff">
					<ion-item *ngIf="member.is_working"  (click)="staffSelected(member)">
					    	<ion-avatar item-start>
						      <img [src]="member?.avatar_url">
						    </ion-avatar>
						    <h2>{{ member?.name }}</h2>
						    <p class="danger">{{ member.availabilty.message }}</p>
				    </ion-item>
			    </ng-container>
			</div>
		</ion-content>	
	`
})
export class UserRezervStaff{
	staff:Array<any> = [];
	constructor(public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams) {
		this.staff = navParams.get('staff');
	}
	staffSelected(staff){
		if(staff.availabilty.isAvailable){
			this.viewCtrl.dismiss(staff);
		}
	}
	back(){
		this.viewCtrl.dismiss();
	}
}
