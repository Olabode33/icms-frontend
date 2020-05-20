import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Location } from '@angular/common';
import { DepartmentsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { DeptProcessRiskControlComponent } from '@app/admin/processes/dept-process-risk-control/dept-process-risk-control.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';


@Component({
    selector: 'app-view-organization-unit',
    templateUrl: './view-organization-unit.component.html',
    styleUrls: ['./view-organization-unit.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewOrganizationUnitComponent extends AppComponentBase implements OnInit {

    @ViewChild('ouProcess', {static: true}) ouProcess: DeptProcessRiskControlComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    _organizationUnitId = -1;
    department: CreateOrEditDepartmentDto = new CreateOrEditDepartmentDto();
    userName = '';
    userName2 = '';
    organizationUnitDisplayName = '';
    supervisingTeamtDisplayName = '';

    lastReview: {name: string, by: string, date: string, status: string, score: number}[] = new Array();
    fakeExceptions: {type: string, by: string, date: string, severity: string, state: string, status: string}[] = new Array();

    constructor(
        injector: Injector,
        private _location: Location,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        this.lastReview = [
            {
                name: 'Apply resolution to incidence',
                by: 'Adekunle Cranel',
                date: 'May 5, 2020',
                status: 'Pending Review',
                score: 0.88
            },
            {
                name: 'Minify risk spreading',
                by: 'Fadugba Ogunusi',
                date: 'May 4, 2020',
                status: 'Approved',
                score: 0.91
            },
            {
                name: 'Quarantine affected machines',
                by: 'James Olukayode',
                date: 'April 30, 2020',
                status: 'Approved',
                score: 0.78
            },
            {
                name: 'Additional security arrangements exist ',
                by: 'Babalola Ayobami',
                date: 'April 29, 2020',
                status: 'Approved',
                score: 0.62
            },
            {
                name: 'Call over of transactions posted on Finacle',
                by: 'Babalola Ayobami',
                date: 'April 27, 2020',
                status: 'Approved',
                score: 0.92
            },
            {
                name: 'Biometric verification',
                by: 'Chukwuma Emeka',
                date: 'April 27, 2020',
                status: 'Approved',
                score: 0.8
            },
        ];
        this.fakeExceptions = [
            {
                type: 'Amount on ticket does not match',
                by: 'Adekunle Cranel',
                date: 'May 5, 2020',
                severity: 'High',
                state: 'Pending Resolution',
                status: 'Open'
            },
            {
                type: 'Income leakage',
                by: 'Fadugba Ogunusi',
                date: 'May 3, 2020',
                severity: 'High',
                state: 'Escalated',
                status: 'Open'
            },
            {
                type: 'CCTV not working',
                by: 'James Olukayode',
                date: 'May 3, 2020',
                severity: 'Low',
                state: 'Pending Closure',
                status: 'Open'
            },
            {
                type: 'Transaction fees not collected',
                by: 'Adekunle Cranel',
                date: 'May 2, 2020',
                severity: 'Medium',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Inappropriate Access to Assets',
                by: 'Babalola Ayobami',
                date: 'May 1, 2020',
                severity: 'High',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Control Override',
                by: 'Chukwuma Emeka',
                date: 'May 1, 2020',
                severity: 'Low',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Amount on ticket does not match',
                by: 'Fatima Abdul',
                date: 'May 1, 2020',
                severity: 'Medium',
                state: 'Closed',
                status: 'Closed'
            },
        ];
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

            this.organizationUnit = { id: this._organizationUnitId, displayName: result.organizationUnitDisplayName };

            this.ouProcess.organizationUnit = this.organizationUnit;
        });
    }

    goBack(): void {
        this._location.back();
    }

}
