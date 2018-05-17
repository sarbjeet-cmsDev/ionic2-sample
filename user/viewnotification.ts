import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FormService } from '../../providers/form';
import { DataService } from '../../providers/data';

@Component({
	selector:'user-notifications',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{ notification.title }}</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content class="business">
	  	<p padding [innerHTML]="content"></p>

	  	<form *ngIf="notification.type == 'review'" #reviewForm="ngForm">
		  	<ion-grid class="review-form">
		  		<ion-row text-center>
		  			<ion-col>
		  				<input required type="hidden" name="rating" [(ngModel)]="rating" />
		  				<input required type="hidden" name="id" [(ngModel)]="notification.id" />
		  				<input required type="hidden" name="order_id" [(ngModel)]="notification.order_id" />

		  				<div class="takerating-box">
							<span class="rating">
								<span (click)='alertRating($event);rating = 1'></span>
								<span (click)='alertRating($event);rating = 2'></span>
								<span (click)='alertRating($event);rating = 3'></span>
								<span (click)='alertRating($event);rating = 4'></span>
								<span (click)='alertRating($event);rating = 5'></span>
							</span>
						</div>
		  			</ion-col>
		  		</ion-row>
		  		<ion-row>
		  			<ion-col>
		  				<ion-textarea required name="review" [(ngModel)]="review" placeholder='Review...'></ion-textarea>
		  			</ion-col>
		  		</ion-row>
		  		<ion-row>
		  			<ion-col>
		  				<ion-textarea name="recommend" [(ngModel)]="recommend" placeholder='Recommendation...'></ion-textarea>
		  			</ion-col>
		  		</ion-row>
		  		<ion-row>
		  			<ion-col text-center>
		  				<button ion-button outline type="button" (click)="submitReview(reviewForm)">Submit</button>
		  			</ion-col>
		  		</ion-row>
		  	</ion-grid>
	  	</form>
	</ion-content>
  `
})
export class ViewNotification {	

	notification:any;
	content:any;


	constructor(public navParams: NavParams,
		public dataService: DataService,
		public navCtrl: NavController,
		private _sanitizer: DomSanitizer) {

		this.notification = this.navParams.get("notification");
		this.content = this._sanitizer.bypassSecurityTrustHtml(this.notification.content);
		
	}

	dismiss(){
		this.navCtrl.pop();
	}

	submitReview(form){
		let errors = FormService.validate(form);
		if(!errors.length && form.valid){
			this.dataService.post('rating',form.value).subscribe(res => {
				this.navCtrl.pop();
			});
		}
	}

	alertRating(ev){
		let index = Array.from(ev.target.parentNode.children).indexOf(ev.target);
		let t = ev.target.parentNode.children.length - 1;
		while(t >= 0){
			if(t > index){
				ev.target.parentNode.children[t].classList.remove("activated");
			}else{
				ev.target.parentNode.children[t].classList.add("activated");
			}
			t--;
		}
	}
}
