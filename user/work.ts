import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DataService } from '../../providers/data';

@Component({
	selector:'user-business-gallery',
  	template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{ data.title }} Work</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content>
  		<div *ngIf="posts.length">
	  		<ion-card *ngFor="let post of posts">
				<img src="{{post.image_url}}"/>
				<ion-card-content>
					<p>
						{{post.caption}}
					</p>
				</ion-card-content>
			</ion-card>
			<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
			   <ion-infinite-scroll-content></ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</div>
		<ng-container *ngIf="!loading && !posts.length">
  			<div class='no-result'>
				<div>
					<i class="fal fa-images"></i><br/>
					<p>No Work Posts found</p>
				</div>
			</div>
  		</ng-container>
	</ion-content>
  `
})
export class UserBusinessWork{
	data:any;
	posts:Array<any> = [];
	loading:boolean = true;
	next_page_url:any = null;
	constructor(public dataService: DataService,
		public photoViewer: PhotoViewer,
		params: NavParams) {	
		this.data = params.get('data');
		this.loadPosts();
	}
	loadPosts(){
		this.dataService.withLoader();
		this.dataService.post('user/work',this.data).subscribe((res)=>{
			this.posts = res.data;
			this.loading = false;
			this.next_page_url = res.next_page_url;
		},err =>{
			console.log(JSON.stringify(err));
		});
	}
	doInfinite(infiniteScroll) {
		if(this.next_page_url){
			var url = new URL(this.next_page_url);
			this.dataService.get('user/work?page='+url.searchParams.get("page")).subscribe((res) => {
				this.posts = this.posts.concat(res.data);
				this.next_page_url = res.next_page_url;
				infiniteScroll.complete();
		    },err => { infiniteScroll.complete(); });
		}else{
			infiniteScroll.complete();	
		}
	}
}
