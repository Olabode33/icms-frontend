import { Injector, Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { DOCUMENT } from '@angular/common';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';

@Component({
    templateUrl: './default-layout.component.html',
    selector: 'default-layout',
    animations: [appModuleAnimation()]
})
export class DefaultLayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    menuCanvasOptions: OffcanvasOptions = {
        baseClass: 'kt-aside',
        overlay: true,
        closeBy: 'kt_aside_close_btn',
        toggleBy: {
            target: 'kt_aside_mobile_toggler',
            state: 'kt-header-mobile__toolbar-toggler--active'
        }
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    selectedModule = '';

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        this.getDisplayStyle();
        this.getSelectedModule();
    }

    ngAfterViewInit() {
        this.getDisplayStyle();
        this.getSelectedModule();
    }

    getSelectedModule() {
        switch (localStorage.getItem(AppConsts.SelectedModuleKey)) {
            case AppConsts.ModuleKeyValueInternalControl:
                this.selectedModule = 'INTERNAL CONTROL';
                break;
            case AppConsts.ModuleKeyValueInternalAudit:
                this.selectedModule = 'INTERNAL AUDIT';
                break;
            case AppConsts.ModuleKeyValueOpRisk:
                this.selectedModule = 'OP RISK';
                break;
            case AppConsts.ModuleKeyValueGeneral:
                this.selectedModule = 'GENERAL';
                break;
            default:
                this.selectedModule = '';
                break;
        }
    }

    getDisplayStyle() {
        if (this._router.url.indexOf('/app/main/landing') >= 0 ) {
            this.document.body.classList.add('kt-aside--minimize');
        } else {
            this.document.body.classList.remove('kt-aside--minimize');
        }
    }
}
