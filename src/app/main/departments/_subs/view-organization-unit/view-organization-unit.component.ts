import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto, GetWorkingPaperNewForViewDto, GetExceptionIncidentForViewDto, TaskStatus, Status, WorkingPaperNewsServiceProxy, ExceptionIncidentsServiceProxy } from './../../../../../shared/service-proxies/service-proxies';
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
import * as moment from 'moment';


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

    rating = '' ;
    ratingCode = '' ;
    ratingHistory = [];

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
            }
        ]
        }
    ];


    filterText = '';
    codeFilter = '';
    maxTaskDateFilter: moment.Moment;
    minTaskDateFilter: moment.Moment;
    maxDueDateFilter: moment.Moment;
    minDueDateFilter: moment.Moment;
    taskStatusFilter = -1;
    maxCompletionDateFilter: moment.Moment;
    minCompletionDateFilter: moment.Moment;
    testingTemplateCodeFilter = '';
    organizationUnitDisplayNameFilter = '';
    userNameFilter = '';
    userName2Filter = '';
    projectId: number;

    constructor(
        injector: Injector,
        private _location: Location,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _workingPaperServiceProxy: WorkingPaperNewsServiceProxy,
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this._activatedRoute.paramMap.subscribe(params => {
            this._organizationUnitId = +params.get('departmentId');
            this.getDepartmentDetails();
            this.getWorkingPapers({ first: 0, sortField: undefined, rows: 10 });
            this.getExceptions({ first: 0, sortField: undefined, rows: 10 });
        });
    }

    getDepartmentDetails(): void {
        this._departmentsServiceProxy.getDepartmentForEdit(this._organizationUnitId).subscribe(result => {

            this.rating = result.ratingName;
            this.ratingCode = result.ratingCode;
            this.ratingHistory = result.ratingHistory;
            this.department = result.department;
            this.userName = result.userName;
            this.userName2 = result.userName2;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

            this.organizationUnit = { id: this._organizationUnitId, displayName: result.organizationUnitDisplayName };

            this.ouProcess.organizationUnit = this.organizationUnit;
            let series =  Array.from(new Set(result.ratingHistory.map((i) => {
                        return { value: Math.floor(Math.random() * 100) + 1, name: i.ratingDate.format() };
                    })));

            this.lineChartData = [
                        {
                            name: 'Rating history',
                            series: series
                        }
                    ];
        });
    }

    overrideDepartmentRating(): void {
        this.createOrEditDepartmentRatingModal.overrideDepartmentRating(this._organizationUnitId, this.department.name);
    }

    getWorkingPapers(event?): void {
        this._workingPaperServiceProxy.getAll(
            this.filterText,
            this.codeFilter,
            this.maxTaskDateFilter,
            this.minTaskDateFilter,
            this.maxDueDateFilter,
            this.minDueDateFilter,
            this.taskStatusFilter,
            this.maxCompletionDateFilter,
            this.minCompletionDateFilter,
            this.testingTemplateCodeFilter,
            this.organizationUnitDisplayNameFilter,
            this.userNameFilter,
            this.userName2Filter,
            this.projectId,
            this._organizationUnitId,
            '',
            this.primengTableHelper.getSkipCount(this.workingPaperPaginator, event),
            this.primengTableHelper.getMaxResultCount(this.workingPaperPaginator, event)
        ).subscribe(result => {
            this.totalWorkingPapers = result.totalCount;
            this.workingPapers = result.items;
        });
    }

    getExceptions(event?): void {
        this._exceptionIncidentsServiceProxy.getAll(
            this.filterText,
            this.maxTaskDateFilter,
            this.maxTaskDateFilter,
            this.taskStatusFilter,
            this.maxTaskDateFilter,
            this.maxTaskDateFilter,
            this.filterText,
            this.userNameFilter,
            this.testingTemplateCodeFilter,
            this.organizationUnitDisplayNameFilter,
            this.projectId,
            this._organizationUnitId,
            '',
            this.primengTableHelper.getSkipCount(this.exceptionsPaginator, event),
            this.primengTableHelper.getMaxResultCount(this.exceptionsPaginator, event)
        ).subscribe(result => {
            this.exceptions = result.items;
            this.exceptionsCount = result.totalCount;
            this.totalExceptions = result.totalCount;
        });
    }

    goBack(): void {
        this._location.back();
    }

    view(id: number): void {
        this._router.navigate(['app/main/workingPaperNews', id]);
    }

    edit(id: number): void {
        this._router.navigate(['app/main/workingPaperNews/edit', id]);
    }

    viewException(id: number): void {
        this.createOrEditExceptionIncidentModal.show(id);
    }

}
