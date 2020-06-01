import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto, GetWorkingPaperNewForViewDto, GetExceptionIncidentForViewDto, TaskStatus, Status, DepartmentRatingHistoryServiceProxy } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Location } from '@angular/common';
import { DepartmentsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeptProcessRiskControlComponent } from '@app/admin/processes/dept-process-risk-control/dept-process-risk-control.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { Paginator } from 'primeng/paginator';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';
import { CreateOrEditDepartmentRatingModalComponent } from '@app/main/departmentRatingHistory/departmentRatingHistory/create-or-edit-departmentRating-modal.component';


@Component({
    selector: 'app-view-organization-unit',
    templateUrl: './view-organization-unit.component.html',
    styleUrls: ['./view-organization-unit.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewOrganizationUnitComponent extends AppComponentBase implements OnInit {

    @ViewChild('workingPaperPaginator', { static: true }) workingPaperPaginator: Paginator;
    @ViewChild('exceptionsPaginator', { static: true }) exceptionsPaginator: Paginator;
    @ViewChild('ouProcess', {static: true}) ouProcess: DeptProcessRiskControlComponent;
    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;
    @ViewChild('createOrEditDepartmentRatingModal', { static: true }) createOrEditDepartmentRatingModal: CreateOrEditDepartmentRatingModalComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    _organizationUnitId = -1;
    department: CreateOrEditDepartmentDto = new CreateOrEditDepartmentDto();
    userName = '';
    userName2 = '';
    organizationUnitDisplayName = '';
    supervisingTeamtDisplayName = '';
    exceptionsCount = 0;

    totalWorkingPapers = 0;
    workingPapers: GetWorkingPaperNewForViewDto[] = new Array();
    totalExceptions = 0;
    exceptions: GetExceptionIncidentForViewDto[] = new Array();

    taskStatusEnum = TaskStatus;
    statusEnum = Status;

    colorScheme = {
        domain: ['#1bc5bd']
    };
    lineChartData = [
        {
          name: 'Rating history',
          series: [
            {
              value: 28,
              name: '2020-Jan-14'
            },
            {
              value: 61,
              name: '2020-Feb-18'
            },
            {
              value: 26,
              name: '2020-Mar-21'
            },
            {
              value: 66,
              name: '2020-Apr-17'
            },
            {
              value: 48,
              name: '2020-May-14'
            },
          ]
        }
    ];

    constructor(
        injector: Injector,
        private _location: Location,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _departmentRatingHistory: DepartmentRatingHistoryServiceProxy
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

            this.department = result.department;
            this.userName = result.userName;
            this.userName2 = result.userName2;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

            this.organizationUnit = { id: this._organizationUnitId, displayName: result.organizationUnitDisplayName };

            this.ouProcess.organizationUnit = this.organizationUnit;
        });
    }

    overrideDepartmentRating(): void {
        this.createOrEditDepartmentRatingModal.overrideDepartmentRating(this._organizationUnitId, this.department.name);
    }

    getRatingHistory(): void {
        this._departmentRatingHistory.getAll('', '', '', '', 0, 100).subscribe(result => {
            let series =  Array.from(new Set(result.items.filter(x => x.departmentRating.organizationUnitId === this._organizationUnitId).map((i) => {
                return { value: 26, name: i.departmentRating.ratingDate.toLocaleString() };
            })));

            // this.lineChartData = [
            //     {
            //       name: 'Rating history',
            //       series: series
            //     }
            // ];
        });
    }

    getWorkingPapers(): void {
        //
    }

    getExceptions(): void {
        //
    }

    goBack(): void {
        this._location.back();
    }

    view(id: number): void {
        this._router.navigate(['app/main/workingPaperNews', id]);
    }

    viewException(id: number): void {
        this.createOrEditExceptionIncidentModal.show(id);
    }

}
