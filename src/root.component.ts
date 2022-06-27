import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from './app-core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
})
export class RootComponent implements OnInit, OnDestroy {

  title = 'Vehicle Monitoring System';
  componentSubscriptions: Subscription = new Subscription();

  constructor(
    private loaderService: LoaderService,
    public router: Router) {
    this.componentSubscriptions.add(router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (event instanceof NavigationEnd) {
        this.loaderService.hide();
      }
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.unsubscribe();
  }

}
