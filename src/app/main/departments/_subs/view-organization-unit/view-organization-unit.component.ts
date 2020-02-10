import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Location } from '@angular/common';
import { DepartmentsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-view-organization-unit',
    templateUrl: './view-organization-unit.component.html',
    styleUrls: ['./view-organization-unit.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewOrganizationUnitComponent extends AppComponentBase implements OnInit {

    _organizationUnitId = -1;
    department: CreateOrEditDepartmentDto = new CreateOrEditDepartmentDto();
    userName = '';
    userName2 = '';
    organizationUnitDisplayName = '';
    supervisingTeamtDisplayName = '';

    constructor(
        injector: Injector,
        private _location: Location,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
    }

    ngOnInit() {
        this._activatedRoute.paramMap.subscribe(params => {
            this._organizationUnitId = +params.get('departmentId');
            this.getDepartmentDetails();
        });
    }

    getDepartmentDetails(): void {
        this._departmentsServiceProxy.getDepartmentForEdit(this._organizationUnitId).subscribe(result => {
            console.log(result);
            this.department = result.department;
            this.userName = result.userName;
            this.userName2 = result.userName2;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

        });
    }

    goBack(): void {
        this._location.back();
    }

}
