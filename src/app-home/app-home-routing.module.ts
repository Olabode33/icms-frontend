import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { NgModule } from '@angular/core';
import { AppHomeRouteGuard } from './auth/app-home-route-guard';
import { AppHomeComponent } from './app-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppHomeComponent,
                canActivate: [AppHomeRouteGuard],
                canActivateChild: [AppHomeRouteGuard],
                children: [
                    { path: '', redirectTo: 'home' },
                    { path: 'home', component: AppHomeComponent, data: {  } },
                    { path: '**', redirectTo: 'home' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppHomeRoutingModule {
    constructor(
        private router: Router,
        private _uiCustomizationService: AppUiCustomizationService
    ) {
        router.events.subscribe((event: NavigationEnd) => {
            setTimeout(() => {
                this.toggleBodyCssClass(event.url);
            }, 0);
        });
    }

    toggleBodyCssClass(url: string): void {
        if (!url) {
            this.setAccountModuleBodyClassInternal();
            return;
        }

        if (url.indexOf('/players/') >= 0) {
            this.setAccountModuleBodyClassInternal();
        } else {
            document.body.className = this._uiCustomizationService.getAppModuleBodyClass();
        }
    }

    setAccountModuleBodyClassInternal(): void {
        let currentBodyClass = document.body.className;

        let classesToRemember = '';

        if (currentBodyClass.indexOf('swal2-toast-shown') >= 0) {
            classesToRemember += ' swal2-toast-shown';
        }

        document.body.className = this._uiCustomizationService.getAccountModuleBodyClass() + ' ' + classesToRemember;
    }
}
