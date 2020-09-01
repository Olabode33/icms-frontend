import { Component, OnInit, Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
    selector: 'app-app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent extends AppComponentBase implements OnInit {

    _AppConsts = AppConsts;
    userName = '';

    action: any;
    filteredActions: { link: string, action: string, module: string }[] = new Array();
    actions: { link: string, action: string, module: string }[] = new Array();

    constructor(
        injector: Injector,
        private _router: Router
    ) {
        super(injector);
        this.actions = [
            {link: '/app/admin/organization-units', action: 'RCSA Management', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/lossEvents', action: 'Loss Database', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/admin/organization-units', action: 'Business units', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/admin/processes', action: 'Processes', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/risks/risks', action: 'Risks', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/controls/controls', action: 'Controls', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/projects/projects', action: 'Projects', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/exceptionIncidents/exceptionIncidents', action: 'Exceptions', module: AppConsts.ModuleKeyValueInternalControl},
            {link: '/app/main/home/oprisk', action: 'Operational Risk', module: AppConsts.ModuleKeyValueOpRisk},
            {link: '/app/main/home', action: 'Internal Audit', module: AppConsts.ModuleKeyValueInternalAudit},
            {link: '/app/main/home', action: 'Internal Control', module: AppConsts.ModuleKeyValueInternalControl}
        ];
    }

    ngOnInit() {
        this.userName = this.appSession.user.name;
    }

    setSelectedModule(module: string) {
        localStorage.setItem(AppConsts.SelectedModuleKey, module);
    }

    filterActions(event): void {
        this.filteredActions = new Array();
        let search = event.query.toLowerCase();
        this.filteredActions = this.actions.filter(obj => obj.action.toLowerCase().search(search) !== -1);
    }

    selectAction(event): void {
        this.setSelectedModule(event.module);
        this._router.navigate([event.link]);
    }

}
