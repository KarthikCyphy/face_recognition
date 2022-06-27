import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'src/app-core/services/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit, OnDestroy {

    componentSubscriptions: Subscription = new Subscription();
    isLoading: Subject<boolean> = this.loaderService.isLoading;
    displayLoadingText: string;

    constructor(
        private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.componentSubscriptions.add(this.loaderService.getLoadingText.subscribe(data => {
            if (data) {
                this.displayLoadingText = data;
            } else {
                this.displayLoadingText = null;
            }
        }));
    }

    ngOnDestroy(): void {
        this.componentSubscriptions.unsubscribe();
    }

}
