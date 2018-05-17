import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
@Component({
	template: `
		<ion-header>
			<ion-navbar>
				<ion-title>Add Service</ion-title>
			</ion-navbar>
		</ion-header>
		<ion-content>
			<div *ngIf="services.length">
				<ion-grid class='slist'>
					<ion-row *ngFor="let service of services" class="align-center">
						<ion-col col-4>
							<ion-label>{{service.title}}</ion-label>
						</ion-col>
						<ion-col>
							<ion-row class="align-center" padding-horizontal *ngFor="let option of service.options"  >
								<ion-col col-4 text-left>
									<label>{{ option.format_duration }}</label>
								</ion-col>
								<ion-col col-4 text-right>
									<label>{{option.price | currency:'USD'}}</label>
								</ion-col>
								<ion-col col-4 text-right>
									<button ion-button clear (click)="serviceSelected(service,option)">
										Add
									</button>
								</ion-col>
							</ion-row>
						</ion-col>
					</ion-row>
				</ion-grid>
			</div>
			<div class='no-result' *ngIf="!services.length">
				<div>
					<i class="fal fa-cut"></i><br/>
					<p>No More Service Available</p>
				</div>
			</div>
		</ion-content>	
	`
})
export class UserRezervService{
	services:Array<any> = [];
	appointment:any;
	constructor(public viewCtrl: ViewController,
		public navCtrl: NavController,
		public navParams: NavParams) {
		this.services = navParams.get('services');
		this.appointment = navParams.get('appointment');
	}
	serviceSelected(service,option){
		let item = option;
		item.title = service.title;	
		item.staff = this.appointment.services[0].staff;
		this.appointment.services.push(item);
		this.navCtrl.pop();
	}
}
