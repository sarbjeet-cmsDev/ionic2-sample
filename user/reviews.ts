import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import { DataService } from '../../providers/data';

@Component({	
	selector: 'business-reviews',
	template: `
	<ion-header>
		<ion-navbar>
			<ion-title>{{ data.title }} Reviews & Rating</ion-title>
		</ion-navbar>
	</ion-header>
	<ion-content padding>
		<h3 text-center>{{rating_count |  number : '1.1'}}</h3>
		<div text-center class="rating-box">
			<span class="rating">
				<span [ngStyle]="{width: (rating_count * 20) + '%'}" ></span>
			</span>
		</div>
		<p text-center>Based on {{rating_by}} user rating</p>

		<div *ngIf="reviews.length">

			<ion-grid class="review-list">
				<ion-row *ngFor="let review of reviews" class='align-center'>
					<ion-col col-3>
						<img [src]='review.user.avatar_url' width="100%"/>
					</ion-col>
					<ion-col col-9>
						<i>{{ review.review }}</i><br/>
						<strong>To:{{ review.staff.name }}</strong>	<br/>
						<i><small>By {{ review.user.name }}</small></i>
						<small>On {{ review.created_at | date:'d MMM yyyy' }}</small>
					</ion-col>
				</ion-row>
			</ion-grid>

			<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
			   <ion-infinite-scroll-content></ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</div>
	</ion-content>
  `
})

export class UserBusinessReviews {
	data:any = null;
	rating_by:number = 0;
	rating_count:number = 0;
	reviews:Array<any> = [];
	next_page_url:any = null;
	constructor(public navCtrl: NavController,
		public dataService: DataService,
		public navParams: NavParams) {
		this.data = navParams.get('data');
		this.dataService.withLoader();
		this.dataService.get(this.data.type+'/rating/'+this.data.id).subscribe((res)=>{
			this.rating_by = res.rating_by;
			this.rating_count = res.rating_count;
			this.reviews = res.data;
			this.next_page_url = res.next_page_url;
		})
	}
	doInfinite(infiniteScroll) {
		if(this.next_page_url){
			var url = new URL(this.next_page_url);
			this.dataService.get(this.data.type+'/rating/'+this.data.id+'?page='+url.searchParams.get("page")).subscribe((res) => {
				this.reviews = this.reviews.concat(res.data);
				this.next_page_url = res.next_page_url;
				infiniteScroll.complete();
		    },err => { infiniteScroll.complete(); });
		}else{
			infiniteScroll.complete();	
		}
	}
}
