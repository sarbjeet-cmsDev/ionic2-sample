import { Component  } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import _ from 'lodash';

@Component({
    selector:'filters',
  template: `
    <ion-header>
        <ion-navbar>
            <ion-title>Advanced filter</ion-title>
            <ion-buttons end>
                <button ion-button icon-only (click)="apply()">
                    Apply
                </button>
            </ion-buttons>
        </ion-navbar>
    </ion-header>
  	<ion-content>
        <ion-list>
            <!--<ion-item>
                <ion-label>Maximum Distance</ion-label>
                <ion-input [(ngModel)]="filter.distance.value"></ion-input>mi
            </ion-item>
            <ion-item>
                <ion-label>Only Show Who is Available Now</ion-label>
                <ion-toggle checked="false"></ion-toggle>
            </ion-item>-->

            <ion-item color="white">
                <ion-label>Sort by Alphabatical Order</ion-label>
                <ion-icon *ngIf="filter.alphabatical.is_show" name="ios-arrow-up" item-end (click)="filter.alphabatical.is_show = !filter.alphabatical.is_show"></ion-icon>
                <ion-icon *ngIf="!filter.alphabatical.is_show" name="ios-arrow-down" item-end (click)="filter.alphabatical.is_show = !filter.alphabatical.is_show"></ion-icon>
            </ion-item>
            <div radio-group [(ngModel)]="filter.alphabatical.value" *ngIf="filter.alphabatical.is_show">
                <ion-item>
                    <ion-label>A-Z</ion-label>
                    <ion-radio value="asc"></ion-radio>
                </ion-item>
                <ion-item>
                    <ion-label>Z-A</ion-label>
                    <ion-radio value="desc"></ion-radio>
                </ion-item>
            </div>
            <ion-item color="white">
                <ion-label>Sort by Reviews</ion-label>
                <ion-icon *ngIf="filter.reviews.is_show" name="ios-arrow-up" item-end (click)="filter.reviews.is_show = !filter.reviews.is_show"></ion-icon>
                <ion-icon *ngIf="!filter.reviews.is_show" name="ios-arrow-down" item-end (click)="filter.reviews.is_show = !filter.reviews.is_show"></ion-icon>
            </ion-item>
            <div radio-group [(ngModel)]="filter.reviews.value" *ngIf="filter.reviews.is_show">
                <ion-item>
                    <ion-label>High to Low</ion-label>
                    <ion-radio value="desc"></ion-radio>
                </ion-item>
                <ion-item>
                    <ion-label>Low to High</ion-label>
                    <ion-radio value="asc"></ion-radio>
                </ion-item>
            </div>

            <ion-item color="white">
                <ion-label>Sort by Pricing</ion-label>
                <ion-icon *ngIf="filter.price.is_show" name="ios-arrow-up" item-end (click)="filter.price.is_show = !filter.price.is_show"></ion-icon>
                <ion-icon *ngIf="!filter.price.is_show" name="ios-arrow-down" item-end (click)="filter.price.is_show = !filter.price.is_show"></ion-icon>
            </ion-item>
            <div radio-group [(ngModel)]="filter.price.value" *ngIf="filter.price.is_show">
                <ion-item>
                    <ion-label>Price Low to High</ion-label>
                    <ion-radio value="asc"></ion-radio>
                </ion-item>
                <ion-item>
                    <ion-label>Price High to Low</ion-label>
                    <ion-radio value="desc"></ion-radio>
                </ion-item>
            </div>

            <ion-item color="white">
                <ion-label>By Categories</ion-label>
                <ion-icon *ngIf="filter.category.is_show" name="ios-arrow-up" item-end (click)="filter.category.is_show = !filter.category.is_show"></ion-icon>
                <ion-icon *ngIf="!filter.category.is_show" name="ios-arrow-down" item-end (click)="filter.category.is_show = !filter.category.is_show"></ion-icon>
            </ion-item>
            <div radio-group [(ngModel)]="filter.category.value" *ngIf="filter.category.is_show">
                <ion-item *ngFor="let category of categories" >
                    <ion-label>{{ category.title }}</ion-label>
                    <ion-radio value="{{ category.id }}"></ion-radio>
                </ion-item>
            </div>

        
        </ion-list>
	</ion-content>
  `
})
export class Filter {
    filter:any;
    categories:any;
    constructor(params: NavParams,
        public navCtrl: NavController) {
        this.filter = _.cloneDeep(params.get('filter'));
        this.categories = params.get('categories');
    }
    apply() {
        this.navCtrl.getPrevious().data.filter = this.filter;
        this.navCtrl.pop();
    }
}
