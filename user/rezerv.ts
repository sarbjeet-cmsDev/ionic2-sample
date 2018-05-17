import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DataService } from '../../providers/data';
import { UserProvider } from '../../providers/user';
import { reorderArray } from 'ionic-angular';
import { AppointmentConfirm } from './appointmentconfirm';
import { UserRezervStaff } from './rezervstaff';
import { UserRezervService } from './rezervservice';
import * as moment from 'moment';
import _ from 'lodash';

@Component({
	selector:'user-rezerv',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Rezerv</ion-title>
		</ion-navbar>
	</ion-header>
  	<ion-content>
  		<mbsc-input hidden [(ngModel)]="appointmentDate" dateFormat="D d M, yy" (onSet)="onDateChange($event.inst.getVal())"  theme="ios" #bookingCalender="mobiscroll" mbsc-calendar></mbsc-input>
  		<ion-grid padding-horizontal >
  			<ion-row class="next-prev-day">
  				<ion-col col-2>
  					<button ion-button clear (click)="prevDay()"><i class="fal fa-angle-left"></i></button>
  				</ion-col>	
  				<ion-col>
  					<strong text-center (click)="bookingCalender.instance.show()">{{ appointmentDate | date:'fullDate' }}</strong>
  				</ion-col>
  				<ion-col col-2>
  					<button ion-button clear (click)="nextDay()"><i class="fal fa-angle-right"></i></button>
  				</ion-col>
  			</ion-row>
  		</ion-grid>

  		<div padding-horizontal class="slots-block">
  			<div *ngIf="slots.length" class="slots" [ngStyle]="{'width.px':slots.length*84}">
  				<div *ngFor="let slot of slots">
  					<ng-container *ngIf='slot.is_available'>
	  					<button ion-button outline (click)="setServiceTime(slot.open)">
	  						{{ slot.open | date:'shortTime' }}
	  					</button>
  					</ng-container>
  				</div>
  			</div>
  			<ng-container *ngIf="!slots.length">
  				<div text-center>
  					<i class="fal fa-calendar-alt"></i><br/>
  					SORRY, THERE ARE NO AVAILABLE SLOTS ON {{ appointmentDate | date:'mediumDate'}}. PLEASE SELECT ANOTHER DAY.
  				</div>
  			</ng-container>
  		</div>
		<ion-grid>
			<ion-row class='align-center'>
				<ion-col offset-3 text-center>
					<strong>Appointment Services</strong>
				</ion-col>
				<ion-col col-3 text-center>
					<button ion-button clear (click)="addService()">
						<i class="fal fa-plus"></i> 
					</button>
				</ion-col>
			</ion-row>
			<ion-list reorder="true" (ionItemReorder)="reorderItems($event)">
			    <ion-item *ngFor="let service of appointment.services;let i = index">
			    	<ion-avatar item-start (click)="changeStaff(i)">
			    		<img class="small" [src]="service.staff?.avatar_url" />
			    	</ion-avatar>
			    	<small color='danger' *ngIf="service.waitingtime">Waiting Time: {{ service.waitingtime }}</small>
			    	<h3>{{service.title}} <small>with {{ service.staff?.name }}</small></h3>
			    	<p>
  						<ng-container *ngIf="service.from">
  							{{ service?.from | date:'shortTime' }} - {{ service?.to | date:'shortTime' }}
  						</ng-container>
  						<ng-container *ngIf="!service.from">
  						Not Available
  						</ng-container>
  					</p>
  					<a *ngIf="i > 0" (click)='removeService()'>Remove</a>
			    </ion-item>
			</ion-list>
  			<ion-row>
  				<ion-col>
  					<small text-right class="hint">tap on avatar to change barber.</small>
  				</ion-col>
  			</ion-row>
  			<ion-row>
  				<ion-col>
  					<textarea [(ngModel)]="appointment.note" placeholder="Leave a note..."></textarea>
  				</ion-col>
  			</ion-row>

  		</ion-grid>
	</ion-content>
	<ion-footer>
		<button [hidden]="!isCheckoutValid()" ion-button icon-right full  (click)="goToConfirmPage()">Rezerv Now <ion-icon name="ios-arrow-forward"></ion-icon></button>
	</ion-footer>
  `
})
export class UserRezerv {
	@ViewChild('bookingCalender') bookingcalender: any;

    businessServices:Array<any> = [];
    business:any = null;
    booking:Array<any> = [];
    appointmentDate:any = moment().toDate();
	slots:Array<any> = [];
	appointment:any;
	minBookingTime:Date;
	maxBookingTime:Date;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public dataService: DataService,
		public userService: UserProvider,
		public modalCtrl: ModalController,) {

		this.appointment = this.navParams.get('appointment');
		console.log(this.appointment);

		//EDIT MODE
		if(this.appointment.id && this.appointment.id > 0){
			this.appointmentDate = moment(this.appointment.from).toDate();
			this.loadBusiness(this.appointment.business_id).subscribe(business => {
				this.business = business;
				this.minBookingTime = this.getMinBookTime();
				this.maxBookingTime = this.getMaxBookTime();
				this.initRezerv();
			});
		}
		else{
			this.business = this.navParams.get('business');	
			this.minBookingTime = this.getMinBookTime();
			this.maxBookingTime = this.getMaxBookTime();
		}
	}
	isCheckoutValid(){
		return (this.appointment.services.filter(i => i.error == true)).length == 0;
	}
	loadBusiness(id){
		this.dataService.withLoader();
		return this.dataService.get('business/load/'+id);
	}
	ionViewWillEnter(){
		if(this.business){
			this.initRezerv();		
		}
	}
	initRezerv(){
		let day = this.business.availability.find( d => d.day_of_week == moment(this.appointmentDate).day());
		if(day && !day.is_available){
			this.setServiceTime(null);
			this.slots = [];
		}
		else if(day.is_available){
			this.getBooking().subscribe(booking =>{
				this.booking = booking;
				let slots = this.getDayFreeSlot();
				if(slots.length){
					this.slots = slots;
					if(this.appointment.services[0].from){
						this.setServiceTime(this.appointment.services[0].from);
					}
					else{
						this.setServiceTime(this.slots[0].open);
					}
				}else{
					this.slots = [];
					this.setServiceTime(null);
				}
			});
		}
	}
	getDayFreeSlot(){ //Create Slot button to fit first item
		let staff = this.getStaff(this.appointment.services[0].staff.id);
		let booking = this.booking.filter(b => b.staff_id == staff.id);
		let slots = this.getSlots(staff.availability,booking);
		let serviceduration = this.appointment.services[0].duration;
		let response = [];
		for(let x = 0; x < slots.length; x++){
			let y = 0;
			if(slots[x].is_available == 1 && moment(slots[x].open).isAfter(this.minBookingTime) && moment(slots[x].close).isBefore(this.maxBookingTime)){
				for(let j = x; j < slots.length;j++){
					if(slots[j].is_available == 1){
						y += moment(slots[j].close).diff(slots[j].open,'seconds');
						continue;
					}
					break;
				}
				if(y >= serviceduration){
					response.push(slots[x]);
					y=0;
					continue;
				}
			}
		}
		return response;
	}
	getBooking(){
		this.dataService.withLoader();
		return this.dataService.get('availability/'+this.business.id+'/'+moment(this.appointmentDate).format('YYYY-MM-DD')).map(booking => {
			if(this.appointment.id) booking = booking.filter(b => b.appointment_id != this.appointment.id);
			return booking;
		});
	}
	getStaff(id){
		return this.business.staff.find(s => s.id == id);
	}
	onDateChange(date){
		this.appointmentDate = moment(date).toDate();
		this.initRezerv();
	}
	setServiceTime(from){
		if(this.appointment.services.length){
			let index =0;
			for(let service of this.appointment.services){
				if(index == 0){
					service.from = from;
				}
				else if(index > 0){
					service.from = this.appointment.services[index-1].to;
				}
				if(service.from){
					service.from = moment(this.appointmentDate).clone().set({
						hour:moment(service.from).get('hour'),
						minutes:moment(service.from).get('minutes')
					});
					service.waitingtime = null;
					let a = this.getAvailabilty(this.getStaff(service.staff.id),service);
					if(a.isAvailable){
						service.error = false;
						service.from = a.from;
						service.to = moment(service.from).add(service.duration,'seconds').toDate();
						if(index != 0){
							let w = moment(service.from).diff(this.appointment.services[index-1].to,'seconds');
							service.waitingtime = Math.floor(w / (60 * 60)) +"h"+Math.floor((w % (60 * 60)) / 60)+"min";
						}
						index++;
						continue;
					}
				}
				service.from = null;
				service.to = null;
				service.error = true;
				index++;
			}
		}			
	}
	changeStaff(index){
		let service = _.cloneDeep(this.appointment.services[index]);
		if(index != 0){
			service.from = this.appointment.services[index-1].to;
		}
		let staff = this.business.staff.map( staff => {
			staff.availabilty = this.getAvailabilty(staff,service);
			return staff;
		});
		let staffModal = this.modalCtrl.create(UserRezervStaff, {staff:staff});
		staffModal.onDidDismiss(staff => {
			if(staff){
				this.appointment.services[index].staff = staff;
				this.initRezerv();
			}
		});
		staffModal.present();
	}
	addService(){
		let cartServices = this.appointment.services.map(i => { return i.service_id; });
		this.navCtrl.push(UserRezervService,{
			services:this.business.services.filter(s => cartServices.indexOf(s.id) == -1),
			appointment:this.appointment
		});

		// let cartServices = this.appointment.services.map(i => { return i.service_id; });
		// let serviceModal = this.modalCtrl.create(UserRezervService,{
		// 	services:this.business.services.filter(s => cartServices.indexOf(s.id) == -1)
		// });
		// serviceModal.onDidDismiss(service => {
		// 	if(service){ 
		// 		service.staff = this.appointment.services[0].staff;
		// 		this.appointment.services.push(service);
		// 		this.initRezerv();
		// 	}
		// });
		// serviceModal.present();
	}
	removeService(index){
		this.appointment.services.splice(index,1);
		this.setServiceTime(this.appointment.services[0].from);
	}
	reorderItems(indexes) {
		let oldstart = this.appointment.services[0].from;
	    this.appointment.services = reorderArray(this.appointment.services, indexes);
	    let slots = this.getDayFreeSlot();
	    if(slots.length){
	    	this.slots = slots;
	    	this.setServiceTime(oldstart);	
	    }else{
	    	this.slots = [];
	    	this.setServiceTime(null);
	    }
	}
	getSlots(availability,booking){
		let slots = [];
		let day = availability.find( d => d.day_of_week == moment(this.appointmentDate).day());
		if(day && day.is_available){
			const [openhours, openminutes] = day.slots[0].open.split(':');
			let dayOpen = moment(this.appointmentDate).set({hour:openhours,minute:openminutes });
			const [closehours, closeminutes] = day.slots[day.slots.length-1].close.split(':');
			let dayClose = moment(this.appointmentDate).set({hour:closehours,minute:closeminutes });
			while(dayOpen < dayClose){
				let open = dayOpen.format('YYYY-MM-DD HH:mm:00');
				let close = moment(open).add(15,'minutes').format('YYYY-MM-DD HH:mm:00');
				let is_available = 1;
				for(let b of booking){
					if(moment(open).isBetween(b.from,b.to) || moment(close).isBetween(b.from,b.to)){
						is_available = 0;break;
					}
				}
				slots.push({
					open:open,
					close:close,
					is_available:is_available
				});
				dayOpen = dayOpen.add(15,'minutes');
			}
		}
		return slots;
	}
	getMinBookTime(){
		let booking_before_setting = this.business.bookingsettings.find(s=> s.key == 'booking_before');
		if(booking_before_setting){
			let booking_before = JSON.parse(booking_before_setting.value);
			return moment().add(booking_before.value,booking_before.unit).toDate();
		}	
		return null;
	}
	getMaxBookTime(){
		let booking_upto_setting = this.business.bookingsettings.find(s=> s.key == 'booking_upto');
		if(booking_upto_setting){
			let booking_upto = JSON.parse(booking_upto_setting.value);	
			return moment().add(booking_upto.value,booking_upto.unit).toDate();
		}	
		return null;
	}
	
	goToConfirmPage(){
		if(this.appointment.id){
			this.dataService.withLoader();
			this.dataService.put('user/appointment',this.appointment).subscribe(appointment => {
				this.userService.refresh.next('appointment');
				this.navCtrl.pop();
			});
		}else{
			this.appointment.on = this.appointment.services[0].from;
			this.navCtrl.push(AppointmentConfirm,{
				appointment:this.appointment,
				business:this.business
			});
		}
	}

	getAvailabilty(staff,service){
		let response = {isAvailable:false,message:'Not Available',error:true,from:null};
		let staffday = staff.availability.find( d => d.day_of_week == moment(this.appointmentDate).day());
		if(!staffday || !staffday.is_available) return {isAvailable:false,message:"Not Working Today",error:true,from:null};

		const [openhours, openminutes] = staffday.slots[0].open.split(':');
		let dayOpen = moment(this.appointmentDate).set({hour:openhours,minute:openminutes,second:0 }).format('YYYY-MM-DD HH:mm:00');
		const [closehours, closeminutes] = staffday.slots[staffday.slots.length-1].close.split(':');
		let dayClose = moment(this.appointmentDate).set({hour:closehours,minute:closeminutes,second:0 }).format('YYYY-MM-DD HH:mm:01');

		let sfrom;
		if(!service.from){
			sfrom = moment(dayOpen);
		}else{
			sfrom = moment(service.from);
		}
		let sto = sfrom.clone().add(service.duration,'seconds').set({second:0});

		if(sfrom.isBefore(dayOpen)) return {isAvailable:false,message:"Available from "+dayOpen,error:true,from:null};
		if(sto.isAfter(dayClose)) return {isAvailable:false,message:"Available Upto "+dayClose,error:true,from:null};

		let booking = this.booking.filter(b => b.staff_id == staff.id && moment(b.from).isSame(sfrom, 'day'));
		let emptyTimeSlot = [];

		if(booking.length){
			for(let c = 0;c < booking.length;c++){
				if( c == 0 ){ 
					emptyTimeSlot.push({open:dayOpen,close:booking[c].from});
				}
				if( c != 0 ){
					emptyTimeSlot.push({open:moment(booking[c-1].to).format('YYYY-MM-DD HH:mm:00'),close:booking[c].from});
				}
				if( c == booking.length-1 ){ 
					emptyTimeSlot.push({open:moment(booking[c].to).format('YYYY-MM-DD HH:mm:00'),close:dayClose});
				}
			}
			if(emptyTimeSlot.length){
				for(let emptyslot of emptyTimeSlot){
					if(sfrom.isSameOrAfter(emptyslot.open) && sto.isSameOrBefore(emptyslot.close)){
						response = {
							isAvailable:true,
							message:'Available',
							from:sfrom.toDate(),
							error:false
						};
						break;
					}
					let slotDuration = moment(emptyslot.close).diff(emptyslot.open, 'seconds');
					if(slotDuration >= service.duration && moment(emptyslot.open).isAfter(sfrom)){
						response = {
							isAvailable:true,
							message:'Available From '+moment(emptyslot.open).format('hh:mm a'),
							from:moment(emptyslot.open).toDate(),
							error:false
						};
						break;
					}
				}		
			}
		}else{
			response = {
				isAvailable:true,
				message:'Available',
				from:sfrom.toDate(),
				error:false
			};
		}
		return response;
	}

	nextDay(){
		this.appointmentDate = moment(this.appointmentDate).add(1,'day').toDate();
		this.initRezerv();
	}
	prevDay(){
		this.appointmentDate = moment(this.appointmentDate).subtract(1,'day').toDate();
		this.initRezerv();
	}
}
