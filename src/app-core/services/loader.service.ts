import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoaderService {

    isLoading = new BehaviorSubject(true);
    showLoadingText = new BehaviorSubject<string>('');
    getLoadingText = this.showLoadingText.asObservable();
    loaderInCount = 0;

    constructor() { }

    show() {
        this.isLoading.next(true);
        this.loaderInCount = this.loaderInCount+1;
    }

    hide() {
        if(this.loaderInCount == 1)
            this.isLoading.next(false);
        this.loaderInCount = this.loaderInCount - 1;
    }

    sendLoadingText(message: string) {
        this.showLoadingText.next(message);
    }

}
