import { Injector, Component, ViewEncapsulation, Inject } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    templateUrl: './default-brand.component.html',
    selector: 'default-brand',
    encapsulation: ViewEncapsulation.None
})
export class DefaultBrandComponent extends AppComponentBase {

    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-' + this.currentTheme.baseSettings.menu.asideSkin + '.svg';
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document,
        private _router: Router
    ) {
        super(injector);
        if (this._router.url.indexOf('/app/main/landing') >= 0 ) {
            this.document.body.classList.add('kt-aside--minimize');
        } else {
            this.document.body.classList.remove('kt-aside--minimize');
        }
    }

    toggleLeftAside(): void {
        this.document.body.classList.toggle('kt-aside--minimize');
    }
}
