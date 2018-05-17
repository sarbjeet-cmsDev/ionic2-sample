import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/user';

import { Home } from './home';

@Component({
	selector:'appointment-success',
  template: `
  	<ion-content padding text-center>
  		<div padding class='logo'>
		    <img src="assets/icon/logo.png"/>
		</div>

  		<h1>All set!</h1>

  		<h5>Don't worry your payment stays with us until your service is complete</h5>

  		<p>if you or cancels before your appointment you get your money back immediately.</p>

		<button ion-button color="secondary" (click)="goToHome()" outline>Ok GOT IT</button>

	</ion-content>
  `
})
export class AppointmentSuccess {


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public userService: UserProvider) {

	}

	ngOnInit(): void {
		
	}
	goToHome(){
		this.navCtrl.setRoot(Home);
	}
}
