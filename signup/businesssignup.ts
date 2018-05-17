import { Component,ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../providers/data';
import { ImageProvider } from '../../providers/image';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { FormService } from '../../providers/form';
import { AuthProvider } from '../../providers/auth';
import { BusinessIndex } from '../business/index';
import { LocationService } from '../../providers/location';
import { Keyboard } from '@ionic-native/keyboard';
import { AsYouType,CountryCode,format } from 'libphonenumber-js';

declare var google: any;
declare var $: any;

import * as moment from 'moment';

@Component({
    selector: 'business-signup',
    template: `
    <ion-content text-center>
        <button ion-button clear class='go-back' (click)="goBack()">
            <ion-icon name="ios-arrow-round-back"></ion-icon>
        </button>
        <div class='step-1' [hidden]="formStep != 1">
            <br/>
            <div padding-horizontal>
            <h2>Start your free trial now!</h2>
            <p>Try RezervNow for 30 days free of charge and see how it can help your business grow!</p>
            <p>Sign up with no credit card and no commitments- it takes just two minutes!</p>
            </div>

            <form #ownerform="ngForm" (ngSubmit)="sendCode(ownerform)">
                <input type="hidden" name='country' [ngModel]="country" />
                <ion-grid padding-horizontal>
                    <ion-row class="align-center">
                        <ion-col col-1 text-left>
                            <i class="fal fa-university"></i>
                        </ion-col>
                        <ion-col>
                            <input required autofocus
                            pattern="[A-Za-z ]*"
                            #name="ngModel" ngModel
                            name="name" type="text"  placeholder="Business Name"/>
                        </ion-col>
                    </ion-row>
                    <ion-row class="align-center">
                        <ion-col col-1 text-left>
                            <i class="fal fa-link"></i>
                        </ion-col>
                        <ion-col>
                            <input readonly 
                            value="{{ genrateUrl(ownerform) | lowercase}}"
                            title="Rezervnow Url"
                            name="url" type="text"  placeholder="Rezervnow Url"/>
                        </ion-col>
                    </ion-row>
                    <ng-container ngModelGroup="owner">
                        <ion-row class="align-center">
                            <ion-col col-1 text-left>
                                <i class="fal fa-user"></i>
                            </ion-col>
                            <ion-col col-6>
                                <input required 
                                #first_name="ngModel" 
                                minlength="4"
                                ngModel
                                name="first_name" type="text"  placeholder="First Name"/>
                            </ion-col>
                            <ion-col col-5>
                                <input required 
                                #last_name="ngModel" 
                                minlength="4"
                                ngModel
                                name="last_name" type="text"  placeholder="Last Name"/>
                            </ion-col>
                        </ion-row>
                        <ion-row class="align-center">
                            <ion-col col-1 text-left>
                                <i class="fal fa-envelope"></i>
                            </ion-col>
                            <ion-col>
                                <input type="email"
                                required 
                                #email="ngModel" 
                                [pattern]="emailRegex"
                                ngModel
                                name="email" placeholder="Email"/>
                            </ion-col>
                        </ion-row>
                        <ion-row class="align-center">
                            <ion-col col-1 text-left>
                                <i class="fal fa-phone"></i>
                            </ion-col>
                            <ion-col>
                                <input type="tel"
                                required 
                                [(ngModel)]='phone_number' (keyup)="formatNumber($event)"
                                name="phone_number" placeholder="XXXXX XXXXX"/>
                            </ion-col>
                        </ion-row>
                        <ion-row class="align-center">
                            <ion-col col-1 text-left>
                                <i class="fal fa-key"></i>
                            </ion-col>
                            <ion-col>
                                <input required 
                                #password="ngModel" 
                                minlength="6"
                                ngModel
                                name="password" type="password"  placeholder="Password"/>
                            </ion-col>
                        </ion-row>  
                    </ng-container>

                    <ion-row class="align-center">
                        <ion-col>
                            <button ion-button outline full>Next</button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
        </div>
        <div class='step-2' [hidden]="formStep != 2">
            <form novalidate (ngSubmit)="matchCode(confirmCode)" #confirmCode="ngForm" >
                <div class="c_code">
                    <ion-grid padding-horizontal text-center>
                        <ion-row>
                            <ion-col>
                                <h2>Enter the Confirmation Code</h2>
                                <p>
                                    A confirmation code has been send to:<br/>
                                    {{ phone_number }}<br/>
                                    <a (click)="sendCode(ownerform,true)">Resend Confirmation Code</a>
                                </p>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col col-2>
                                <input required  autofocus
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,0)"
                                name="c1" type="tel"  placeholder="X"/>
                            </ion-col>
                            <ion-col col-2>
                                <input required 
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,1)"
                                name="c2" type="tel"  placeholder="X"/>
                            </ion-col>
                            <ion-col col-2>
                                <input required 
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,2)"
                                name="c3" type="tel"  placeholder="X"/>
                            </ion-col>
                            <ion-col col-2>
                                <input required 
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,3)"
                                name="c4" type="tel"  placeholder="X"/>
                            </ion-col>
                            <ion-col col-2>
                                <input required 
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,4)"
                                name="c5" type="tel"  placeholder="X"/>
                            </ion-col>
                            <ion-col col-2>
                                <input required 
                                ngModel maxlength="1"
                                (keyup)="codeEnter($event,5)"
                                name="c6" type="tel"  placeholder="X"/>
                            </ion-col>
                        </ion-row>
                        <ion-row class="align-center">
                            <ion-col>
                                <button ion-button outline full type="submit">NEXT</button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </div>
                <br/>
                <button (click)="formStep = formStep-1" ion-button clear icon-left>
                        <ion-icon name="ios-arrow-back"></ion-icon> 
                        <label>Back</label>
                </button>
            </form>
        </div>
        <div class='step-3' [hidden]="formStep != 3">
            <div padding-horizontal>
                <h2>Upload your logo</h2>
                <p>Show clients what your business is all about with your logo or a photo of your premises- just make sure it includes your business’ name!</p>
            </div>

            <form #coverform="ngForm" (ngSubmit)="formStep = formStep+1">
                <ion-grid ngModelGroup="gallery">
                    <ion-row>
                        <ion-col>
                            <p>this photo will be displayed on your profile page</p>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <input type="hidden" #image="ngModel" [(ngModel)]="gallery.image" name="image"/>
                            <div (click)="addImage()" class="choose-image">
                                <img [hidden]="!gallery.url" [src]="gallery.url" />
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <button ion-button outline full type="submit">NEXT</button>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                             <button (click)="formStep = formStep-1" ion-button clear icon-left>
                                    <ion-icon name="ios-arrow-back"></ion-icon> 
                                    <label>Back</label>
                            </button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
        </div>
        <div class='step-4' [hidden]="formStep != 4">
            <p padding-horizontal>Please select the services your business offers</p>
            <form #bCategoryForm="ngForm" (ngSubmit)="bCategoryFormSubmit(bCategoryForm)">
                <ion-list no-lines>
                    <ion-item *ngFor="let category of businessCategories;index as i">
                        <ion-label>{{category.title}}</ion-label>
                        <ion-checkbox name="cats-{{i}}" [(ngModel)]="category.inwork" ></ion-checkbox>
                    </ion-item>
                </ion-list>
                <div padding-horizontal>
                    <button ion-button full outline>Next</button>
                </div>
            </form>
            <br/>
            <button (click)="formStep = formStep-1" ion-button clear icon-left>
                    <ion-icon name="ios-arrow-back"></ion-icon> 
                    <label>Back</label>
            </button>
        </div>
        <div class='step-5' [hidden]="formStep != 5">
            <p padding-horizontal>Please type in your business address or move the pin on the map and confirm the location.</p>
            <form #businessLocation="ngForm" (ngSubmit)="businessLocationSubmit(businessLocation)">
                <input id="pac-input" type="text" placeholder="Search Place"/>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <div #map id="map"></div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col>
                            <button ion-button full outline type="submit">Set Location</button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
            <br/>
            <button (click)="formStep = formStep-1" ion-button clear icon-left>
                    <ion-icon name="ios-arrow-back"></ion-icon> 
                    <label>Back</label>
            </button>
        </div>
        <div class='step-6' [hidden]="formStep != 6">

            <p padding-horizontal>Please enter the days and times that your business is open. Don’t forget to include Sundays, holidays, etc.</p>
            <widget-availability [availability]="availability" (availabilityEvent)="resetAvailability($event)"></widget-availability>
            <div padding-horizontal>
                <button ion-button full outline (click)="businessSignUp(ownerform,coverform)">Signup</button>
            </div>
        </div>

    </ion-content>
  `
})
//{{ f.controls.name?.errors | json }}
//f.controls.name?.required
export class BusinessSignup {
    @ViewChild('map') mapElement: ElementRef;
    map:any;
    address:any = {
        street_address:null,
        region:null,
        area:null,
        city:null,
        country:null,
        zipcode:null,
    };
    area_code:string = null; 

    gallery:any = {image:null,url:null};
    categories:Array<any> = [];
    availability:Array<any> = [];
    businessCategories:Array<any> = [];

    country:CountryCode = null;

    phone_number: string;
    ccode: number;
    formStep:number = 1;
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(public modalCtrl: ModalController,
        public dataService: DataService,
        public imageService: ImageProvider,
        public navCtrl: NavController,
        public locationService: LocationService,
        public authService: AuthProvider,
        private keyboard: Keyboard,
        private toastCtrl: ToastController) {

        this.dataService.get('category/list').subscribe(categories => { 
            this.businessCategories = categories;
        });

        this.locationService.getPlace().then((address)=>{
            this.address = address;
            this.country = address.country;
            this.loadMap({ lat: address.latitude, lng: address.longitude });
        },err => {

        });
    }

    sendCode(form,resend=false){
        let errors = FormService.validate(form);
        if(!errors.length && form.valid){
            let data = form.value.owner;

            data.phone_number = format(data.phone_number,this.country, 'International');

            this.dataService.withLoader();
            this.dataService.post('signupcode',data).subscribe(res => {
                this.ccode = res.code;
                if(!resend) this.formStep++;
                this.keyboard.show();
            },(err)=>{
                this.toastCtrl.create({message:err.error,duration: 2000}).present();
            });
        }else{
            this.toastCtrl.create({message:errors[0],duration: 2000,position:'top'}).present();
        }
    }

    bCategoryFormSubmit(form){
        if(this.businessCategories.filter(x => x.inwork == 1).length){
            this.formStep++;
        }
        else{
            this.toastCtrl.create({message:"Please select at least one category",duration: 2000}).present();
        }
    }
    businessLocationSubmit(form){
        var latlng = { lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng() };
        this.locationService._getPlace({ 'location': latlng }).then((address)=>{
            this.address = address;
            this.formStep++;
            console.log(JSON.stringify(address,null,4));
        },err=>{
            this.toastCtrl.create({message:'Unable to fetch location!',duration: 2000,position:'top'}).present();
        });
    }
    resetAvailability(availability){
        this.availability = availability;
    }

    codeEnter(event,index){
        if(index <= 4 && (event.keyCode == 229 ||(event.target.value.length && event.keyCode >= 48 && event.keyCode <= 57)) )
            $(event.target).parent().next().find('input').focus();
        else if(event.keyCode == 8 && !event.target.value.length && index > 0)
            $(event.target).parent().prev().find('input').focus();
    }
    genrateUrl(form){
        return form.value.name ? form.value.name.replace(/[^A-Z0-9]/ig, "")+'.rezervnow.com' : '';
    }
    
    matchCode(form){
        if(form.valid){
            var c = form.value;
            if((c.c1+c.c2+c.c3+c.c4+c.c5+c.c6) == this.ccode){
                this.formStep++;
            }
            else{
                this.toastCtrl.create({message:'Oops! OTP is Invalid.',duration: 2000}).present();
            }
        }
        else{
            this.toastCtrl.create({message:'OTP is Required!',duration: 2000}).present();
        }
    }
    addImage(){
        this.imageService.chooseImage().subscribe(res => {
            this.gallery.image = res.path;
            this.gallery.url = res.url;
        });
    }
    businessSignUp(form1,form2){
        if(FormService.validateAvailability(this.availability)){

            form1.value.owner.phone_number = format(form1.value.owner.phone_number,this.country, 'International');

            this.authService.bSignup(Object.assign( 
                form1.value,
                form2.value,
                {timezone:moment().format("Z")},
                {address:this.address},
                {availability:this.availability},
                {categories:this.businessCategories})
            ).then((user) => {
                this.navCtrl.setRoot(BusinessIndex);
            },(err) => {
                this.toastCtrl.create({message:err.error,duration: 2000}).present();
            });
        }else{
            this.toastCtrl.create({message:'Invalid Availability!',duration: 2000,position:'top'}).present();
        }
        
    }
    goBack() {
        this.navCtrl.pop();
    }
    loadMap(coords) {
        let mapOpts = {
            center: new google.maps.LatLng(41.850033, -87.6500523),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false,
        };

        if(coords){
            let latLng = new google.maps.LatLng(coords.lat,coords.lng);    
            mapOpts.center = latLng;
        }
        
        this.map = new google.maps.Map(this.mapElement.nativeElement,mapOpts);

        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        this.map.addListener('bounds_changed', ()=>{
            searchBox.setBounds(this.map.getBounds());
        });
        searchBox.addListener('places_changed', () => {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            this.map.fitBounds(bounds);
        });
    }
    formatNumber(ev:any){
        ev.target.value = new AsYouType(this.address.country).input(ev.target.value);
    }
}
