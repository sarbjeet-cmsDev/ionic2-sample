import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user';
import { DataService } from '../../providers/data';
import { AuthProvider } from '../../providers/auth';

import { BusinessDetail } from './business';
import { UserBusinessWork } from './work';

@Component({	
	selector: 'user-favourites',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Your Favourites</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content>
  		<ng-container *ngIf='!user'>
  			<login-widget></login-widget>
  		</ng-container>
  		<ng-container *ngIf='user'>
  			<div padding-horizontal [hidden]="!loading">
				<ngx-content-loading [height]="130" *ngFor="let x of [1,2,3,4,5,6]">
					<svg:g ngx-rect width="33%" height="110" y="0" x="0" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="0" x="160" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="40" x="160" rx="0" ry="0"></svg:g>
					<svg:g ngx-rect width="66%" height="30" y="80" x="160" rx="0" ry="0"></svg:g>
				</ngx-content-loading>
			</div>
  		</ng-container>
		<ng-container *ngIf="!favourites.length && !loading">
			<div class='no-result'>
				<div>
					<i class="fal fa-heart"></i><br/>
					<p>No favourite Business Found!. Please add to favourites for book quickly</p>
				</div>
			</div>
		</ng-container>

		<ng-container *ngIf="favourites.length">
	  		<div class="list-area">
				<ion-grid>
					<ion-row *ngFor="let business of favourites">
						<ion-col class="business-cover" col-5>
							<img [src]="business.cover_image_url"/>
						</ion-col>
						<ion-col col-7 class='business-desc'>
							<div class='info'>
								<h4>{{business.name}}</h4>
								<div class="rating-box" (click)="pushReviewsPage(business)">
									<span class="rating">
										<span [ngStyle]="{width: business.rating_count * 20 + '%'}" ></span>
									</span>
									<span>{{business.rating_by}}</span>
								</div>
								<p>
									<span class="pull-right">{{business.distance}}mi</span>
								</p>
							</div>
							<ion-row class="action">
								<ion-col col-6>
									<button ion-button block color="light" (click)="pushWorkPage(business)">PHOTOS</button>
								</ion-col>
								<ion-col col-6>
									<button ion-button block (click)="pushBusinessDetail(business)">REZERV</button>
								</ion-col>
							</ion-row>
						</ion-col>
					</ion-row>
				</ion-grid>
			</div>
		</ng-container>
	</ion-content>
  `
})
export class Favourite {
	user:any = null;
	favourites:Array<any> = [];
	loading:boolean = true;
	constructor(public dataService: DataService,
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public authService: AuthProvider,
		public userService: UserProvider) {

		authService.user.subscribe(user => {
			if(user){
				this.user = user;
				this.loadFavourites();
			}
		});

		userService.refresh.subscribe(refresh => {
			if(refresh == 'favourite') { this.loadFavourites() };
		});
	}

	loadFavourites(){
		this.loading = true;
		this.dataService.get('user/favourite').subscribe((favourites) => {
			this.favourites = favourites;
			this.loading = false;
	    },err => {
	    	
	    });
	}
	pushBusinessDetail(business) {
		this.navCtrl.push(BusinessDetail, { id: business.id });
	}
	pushWorkPage(business) {
		this.navCtrl.push(UserBusinessWork, { data: {
			id:business.id,			
			type:'B',			
			title:business.name,			
		}});
	}
}
