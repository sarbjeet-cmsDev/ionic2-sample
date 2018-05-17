import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Profile } from './profile';
import { Home } from './home';
import { Favourite } from './favourite';
import { Appointments } from './appointments';
import { Notifications } from './notifications';
import { BusinessDetail } from './business';
import { UserProvider } from '../../providers/user';

@Component({
    providers: [UserProvider],
    template: `
        <ion-tabs #userTabs>
            <ion-tab [root]="business" tabUrlPath="home" [rootParams]="referrer" tabIcon="ios-search-outline"></ion-tab>
            <ion-tab [root]="tab2Root" tabUrlPath="favourite" tabIcon="ios-heart-outline"></ion-tab>
            <ion-tab [root]="tab3Root" tabUrlPath="appointment" tabIcon="ios-list-outline"></ion-tab>
            <ion-tab [root]="tab4Root" tabUrlPath="notification" tabIcon="ios-notifications-outline"></ion-tab>
            <ion-tab [root]="tab5Root" tabUrlPath="profile" tabIcon="ios-person-outline"></ion-tab>
        </ion-tabs>
    `
})
export class TabsPage {
    referrer:string = null;
    business = Home;
    tab2Root = Favourite;
    tab3Root = Appointments;
    tab4Root = Notifications;
    tab5Root = Profile;

    constructor(public navCtrl: NavController,
        userService: UserProvider,
        public navParams: NavParams){
        this.referrer = navParams.data;
    }
}
