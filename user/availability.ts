import { Component } from '@angular/core';
import { NavController, NavParams,  } from 'ionic-angular';

@Component({
	selector:'u-b-availability',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{ business.name }}</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content>
  		<ion-grid padding-horizontal>
  			<ion-row class='align-center'>
  				<ion-col col-4>
	  				<strong>Week Day</strong>
	  			</ion-col>
	  			<ion-col col-8>
	  				<ion-row>
	  					<ion-col col-5>
	  						<strong>Opening</strong>
	  					</ion-col>		
	  					<ion-col col-2>-</ion-col>
	  					<ion-col col-5>
	  						<strong>Closing</strong>
	  					</ion-col>		
	  				</ion-row>
	  			</ion-col>
  			</ion-row>
	  		<ion-row *ngFor="let day of business.availability">
	  			<ion-col col-4>
	  				<strong>{{ day.day }}</strong>
	  			</ion-col>
	  			<ion-col col-8>
	  				<div *ngIf="day.is_available; else elseBlock">
		  				<ion-row *ngFor="let avl of day.slots">
		  					<ion-col col-5>
		  						{{ ('2018-01-01 ' + avl.open) | date:'hh:mm a'}}
		  					</ion-col>		
		  					<ion-col col-2>-</ion-col>
		  					<ion-col col-5>
		  						{{ ('2018-01-01 ' + avl.close) | date:'hh:mm a'}}
		  					</ion-col>		
		  				</ion-row>
		  			</div>
		  			<ng-template #elseBlock>
		  				<strong>Not Available</strong>
		  			</ng-template>

	  			</ion-col>
	  		</ion-row>
  		</ion-grid>
	</ion-content>
  `
})
export class UserBusinessAvailability {
	business:any={};

	constructor(public navCtrl: NavController,
		navParams: NavParams) {

		this.business = navParams.get('business');
	}
}
