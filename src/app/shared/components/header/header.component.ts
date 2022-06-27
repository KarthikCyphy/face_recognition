import { Component, OnInit, Output, EventEmitter, Inject, NgZone } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from 'src/app-core/auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app-core/services/http.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

var body = document.getElementsByTagName("body")[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public menuItems: Menu[];
  public items: Menu[];
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public openNav: boolean = false
  public right_sidebar: boolean = false
  public text: string;
  public elem;
  public isOpenMobile: boolean = false
  public convoyStatus: string;
  public currentTimeStatus: any;

  lightListData: any = [];

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    @Inject(DOCUMENT) private document: any,
    public authService: AuthService,
    private modalService: NgbModal,
    private httpService : HttpService,
    private toastService: ToastrService,
    private commonUIComponent: CommonUiService,
    private loaderService: LoaderService,
    private router: Router,
    public ngZone: NgZone,

    ) {
  }

  ngOnDestroy() {
    this.removeFix();
  }

  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  collapseSidebar() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  public changeLanguage(lang) {
  }

  searchTerm(term: any) {
    term ? this.addFix() : this.removeFix();
    // if (term.length >= 3) return
     this.menuItems = [];
    let items = [];
    term = term.toLowerCase();
    if(this.authService.userData.roles[0] == 'Admin' && this.router.url != '/app/vehicles'){
      this.ngZone.run(() => {
        this.router.navigate(['/app/vehicles']);
      });
    }
    if(term.length >= 3){
      this.httpService.post('vvadmin/searchvehicle', { "requestParams" : this.commonUIComponent.rawVehicleNumberFormatte(term) }).subscribe(
        async ( response: any) => {
          if(await response.success){ 
            this.removeFix();
            if(response.success && response.returnObject){
              let data = {
                'returnObject': response.returnObject,
                'searchKey' : term
              }
              this.commonUIComponent.sendGlobalSearch(data);
            }else
              this.toastService.error('Data not found.');
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }else{
      this.removeFix();
      this.commonUIComponent.sendGlobalSearch({});
    }
    this.items.filter(menuItems => {
      if (menuItems.title.toLowerCase().includes(term) && menuItems.type === 'link') {
        items.push(menuItems);
      }
      if (!menuItems.children) return false
      menuItems.children.filter(subItems => {
        if (subItems.title.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = menuItems.icon
          items.push(subItems);
        }
        if (!subItems.children) return false
        subItems.children.filter(suSubItems => {
          if (suSubItems.title.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon
            items.push(suSubItems);
          }
        })
      })
      this.checkSearchResultEmpty(items)
      this.menuItems = items
    });
  }

  checkSearchResultEmpty(items) {
    if (!items.length)
      this.searchResultEmpty = true;
    else
      this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    body.classList.add("offcanvas");
  }

  removeFix() {
    this.searchResult = false;
    body.classList.remove("offcanvas");
    // this.text = "";
  }

  clearSearch() {
    this.removeFix();
    this.text = "";
    this.commonUIComponent.sendGlobalSearch({});
  }
  
  ngOnInit() {
    this.elem = document.documentElement;
    this.navServices.items.subscribe(menuItems => {
      this.items = menuItems
    });
    this.commonUIComponent.sendGlobalSearch({});
    if(this.authService.userData.roles[0] == 'Operator')
      this.navServices.collapseSidebar = true;
    else
      this.navServices.collapseSidebar = false;
    
    this.httpService.post('vvverification/ilpr/wh/getconvoystatus', { "requestParams": {} }).subscribe(
      async ( response: any) => {
        if(await response.success)
          this.convoyStatus = response.returnObject;        
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });

    this.httpService.post('vvadmin/getalllightcontrollers', {"requestParams" : {}}).subscribe(
      async ( response: any) => {
        if(await response.success)
          this.lightListData = response.returnObject;
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });

    if(this.currentTimeStatus == undefined){
      this.currentTimeStatus = setInterval(() => {
        this.checkDayChangeTimer(); 
      }, 1000);
    }    
  }

  checkDayChangeTimer(){
    var today = new Date();
    let currentDataTime = (moment(new Date(today.setHours(today.getHours()))).format('HH:mm:ss'));
    if(currentDataTime == '00:00:00'){
      if(window.location.hash.includes('app/dashboard') || window.location.hash.includes('app/home'))
        window.location.reload();
    }    
  }

  changeConvoyStatus(convoyStatus) {
    let url = convoyStatus == 'CONVOY_STARTED' ? 'stopconvoy' : 'startconvoy';
    let lightURL = convoyStatus == 'CONVOY_STARTED' ? 'sendsignaloff' : 'sendsignalwithbuzzeron';
    this.httpService.post('vvverification/ilpr/wh/'+ url, { "requestParams": {} }).subscribe(
      async ( response: any) => {
        if(await response.success)
          this.convoyStatus = response.returnObject;      
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });
    this.triggerLightAPI(lightURL);
  }

  triggerLightAPI(lightURL: string) {
    this.lightListData.forEach((value) => {
      let inputData = {
        "ipaddress" : value.ipAddress,
        "port": value.port,
        "signalName": 'yellow'
      }
      this.httpService.post('vvlightcontroller/' + lightURL, { "requestParams": inputData }).subscribe(
        (response: any) => {
          // this.loaderService.hide();
        },
        (error) => { //error() callback
          // this.httpService.serverErrorMethod(error);
      });   
    });    
  }

  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  openChangePasswordModal(content) {
    this.modalService.open(content, { centered: true });
  }  
}
