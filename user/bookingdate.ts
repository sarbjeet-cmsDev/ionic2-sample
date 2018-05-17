import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { DataService } from '../../providers/data';
import { DatePipe } from '@angular/common';
import _ from 'lodash';

@Component({
	selector:'booking-monthslot',
  template: `
  	<ion-header>
		<ion-navbar>
			<ion-title>Rezerv</ion-title>
		</ion-navbar>
	</ion-header>

  	<ion-content padding>
  		<div text-center>	
  			<h6 (click)="istimefilter = 1- istimefilter; getSlots();" no-margin>
  				<ion-icon name="time"></ion-icon>
  				Filter by time <ion-icon name="arrow-down"></ion-icon>
  			</h6> 

  			<div margin-top *ngIf="istimefilter">
				<ion-datetime displayformat="hh:mm A" pickerFormat="hh:mm A" (ionChange)="getSlots()" placeholder="HH:MM" [(ngModel)]="filterTime"></ion-datetime>
			</div>

			<h5>Expected Service time is {{ appointment.duration / 60 }} mintues.</h5>
			

		</div>
  		<ion-grid>
			<ion-row class="date-nav">
				<ion-col text-right>
					<button ion-button icon-only (click)="prevMonth()">
						 <ion-icon name="ios-arrow-back"></ion-icon>
					</button>
				</ion-col>
				<ion-col  text-center>
					<div class="date">
						{{today | date:'MMM yyyy'}}
					</div>
				</ion-col>
				<ion-col>
					<button ion-button icon-only (click)="nextMonth()">
						 <ion-icon name="ios-arrow-forward"></ion-icon>
					</button>
				</ion-col>
			</ion-row>		
		</ion-grid>

  		<div class='calendar'>
  			<div class='month'>
  				<div class='day h'>Su</div><div class='day h'>Mo</div><div class='day h'>Tu</div>
  				<div class='day h'>We</div><div class='day h'>Th</div><div class='day h'>Fr</div>
  				<div class='day h'>Sa</div>

	  			<div class='day' *ngFor="let day of days" (click)="daySelected(day)" 
	  				[class.prevmonth]=" ((day | date:'MM') != (today | date:'MM')) "
	  				[class.disabled]=" isDayAvailable(day) ">

	  				<span *ngIf="(day | date:'dd') == (myDay | date:'dd') && (day | date:'MM') == (myDay | date:'MM')">Today</span>
	  				{{day | date:'d'}}
	  			</div>
  			</div>
  		</div>
  		<div>
  			<p margin-top>*Click any available day to continue</p>
  		</div>
	</ion-content>
  `
})
export class Bookingdate {
    appointment:any;
    callback:any;
    days:any;
    istimefilter:number = 0;

    @ViewChild('bookedSlot') el:ElementRef;
    today:Date = new Date();
    myDay:Date = new Date();
    filterTime:any = null;
    slots:Array<any> = [];

	constructor(public dataService: DataService,
		public renderer: Renderer,
		public navCtrl: NavController,
		public viewCtrl: ViewController,
		public navParams: NavParams) {

		this.appointment = this.navParams.get('appointment');

		this.days = this.buildMonth();

		this.getSlots();
	}

 	daySelected(d){
 		var datePipe = new DatePipe('en-US');
    	var date = datePipe.transform(d, 'yyyy-MM-dd');
 		let x = this.slots.find(x => x.day == date);
 		if(x && x.is_available){
 			this.viewCtrl.dismiss({date:date});
 		}
	}

	isDayAvailable(day){
		let _day = day.getFullYear()+"-"+(String("00" +(day.getMonth()+1)).slice(-2))+"-"+String("00" +day.getDate()).slice(-2);
		
		let x = this.slots.find(x => x.day == _day);
		if(x)
			return x.is_available == 0;
		return true;
	}

	getSlots(){
		if(_.isNull(this.filterTime) && this.istimefilter)
			return;
		else{
			let month = this.today.getFullYear()+"-"+(this.today.getMonth()+1);
			this.dataService.withLoader();
			this.dataService.post('barber/mavailability',{
				staff_id:this.appointment.staff.id,
				duration:this.appointment.duration,
				month:month,
				time:this.filterTime,
				istimefilter:this.istimefilter,
			}).subscribe((slots)=>{
				this.slots = slots;
			}, err => {

			});
		}
	}

	prevMonth(){
		let z = new Date(this.today.getFullYear(), this.today.getMonth(),1);
		if(z >= new Date()){
			this.today = new Date(this.today.getFullYear(), this.today.getMonth()-1,1);
			this.getSlots();
			this.days = this.buildMonth();
		}
	}
	nextMonth(){
		this.today = new Date(this.today.getFullYear(), this.today.getMonth()+1,1);
		this.days = this.buildMonth();
		this.getSlots();
	}

	buildMonth(){
		var month = this.today.getMonth();
		var year = this.today.getFullYear();
		var days = [];

		var days_in_month = new Date(year, month+1, 0).getDate();
		var first_day_of_month = new Date(year, month, 1).getDay();
		var end_day_of_month = new Date(year, month, days_in_month ).getDay();

		var z = days_in_month + first_day_of_month;
		var x;
		if(first_day_of_month != 0)
			x = new Date(year, month - 1, ( new Date(year, month, 0).getDate() - first_day_of_month+1 ));
		else
			x = new Date(year, month, 1);
		if(end_day_of_month != 6)
			z += 6-end_day_of_month;

		while(z){
			days.push(new Date(x));
			x.setDate(x.getDate() + 1);
			z--;
		}
		return days;
	}


}
