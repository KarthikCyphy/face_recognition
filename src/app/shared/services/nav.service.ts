import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false
	public fullScreen = false;

	constructor() {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/app/dashboard', title: 'Dashboard', type: 'link', icon: 'home', active: true, 
		},
		{
			path: '/app/liveview', title: 'Live view', type: 'link', icon: 'airplay', active: false,
		},
		{
			path: '/app/offline', title: 'Offline', type: 'link', icon: 'upload', active: false, 
		},
		{
			path: '/app/enrolment', title: 'Person Enrolment', type: 'link', icon: 'user', active: false, 
		},
	]


	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
