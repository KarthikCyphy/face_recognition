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
			path: '/app/dashboard', title: 'Dashboard', type: 'link', icon: 'home', active: false, 
		},
		{
			path: '/app/home', title: 'Home', type: 'link', icon: 'home', active: false, 
		},
		{
			path: '/app/gate', title: 'Gates', type: 'link', icon: 'airplay', active: true,
		},
		{
			path: '/app/light', title: 'Light Controllers', type: 'link', icon: 'zap', active: false, 
		},
		{
			path: '/app/camera', title: 'Cameras', type: 'link', icon: 'camera', active: false, 
		},		
		{
			path: '/app/vehicles', title: 'Vehicles', type: 'link', icon: 'truck', active: false, 
		},		
		{
			title: 'Reports', icon: 'bar-chart-2', type: 'sub', active: false, children: [
				{ path: '/app/reports', title: 'Frequency Reports', type: 'link' },
			]
		},
	]


	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
