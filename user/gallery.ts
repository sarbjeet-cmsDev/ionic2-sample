import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DataService } from '../../providers/data';

@Component({
	selector:'user-business-gallery',
  	template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>{{ business.name }} Gallery</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content>
  		<ion-grid *ngIf='gallery.length'>
			<ion-row>
				<ion-col  col-4 *ngFor='let img of gallery'>
					<img (click)="viewImage(img)" src="{{img.image_url}}"/>
				</ion-col>
			</ion-row>
		</ion-grid>
		<ng-container *ngIf="!loading && !gallery.length">
  			<div class='no-result'>
				<div>
					<i class="fal fa-images"></i><br/>
					<p>No Gallery found</p>
				</div>
			</div>
  		</ng-container>
	</ion-content>
  `
})
export class UserBusinessGallery{
	business:any;
	gallery:Array<any> = [];
	loading:boolean = true;

	constructor(public dataService: DataService,
		public photoViewer: PhotoViewer,
		params: NavParams) {
		
		this.business = params.get('business');
		this.loadGallery();

	}
	loadGallery(){
		this.dataService.withLoader();
		this.dataService.get('user/bgallery/'+this.business.id).subscribe((res)=>{
			this.gallery = res;
			this.loading = false;
		});
	}
	viewImage(img){
		this.photoViewer.show(img.image_url, 'My image title', {share: false});
	}

}
