import { Component, OnInit, ViewChild, Injector, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Paginator } from 'primeng/paginator';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProcessRisksComponent } from '@app/admin/processes/process-risk/process-risks.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { CreateOrEditDepartmentDto, GetWorkingPaperNewForViewDto, GetExceptionIncidentForViewDto, TaskStatus, DepartmentsServiceProxy, WorkingPaperNewsServiceProxy, ExceptionIncidentsServiceProxy, TokenAuthServiceProxy, ProcessesServiceProxy, CreateOrEditProcessDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';
import { CreateOrEditDepartmentRatingModalComponent } from '@app/main/departmentRatingHistory/departmentRatingHistory/create-or-edit-departmentRating-modal.component';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'app-view-process',
    templateUrl: './view-process.component.html',
    styleUrls: ['./view-process.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewProcessComponent extends AppComponentBase implements OnInit {

    @ViewChild('workingPaperPaginator', { static: true }) workingPaperPaginator: Paginator;
    @ViewChild('exceptionsPaginator', { static: true }) exceptionsPaginator: Paginator;
    @ViewChild('ouProcess', {static: true}) ouProcess: ProcessRisksComponent;
    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;
    @ViewChild('createOrEditDepartmentRatingModal', { static: true }) createOrEditDepartmentRatingModal: CreateOrEditDepartmentRatingModalComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    _organizationUnitId = -1;
    process: CreateOrEditProcessDto = new CreateOrEditProcessDto();
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
    statusEnum = status;

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

    residualRiskPercent = 0;
    inherentRiskPercent = 0;
    residualRiskScore = 0;
    inherentRiskScore = 0;
    residualRiskRating = '';
    inherentRiskRating = '';

    constructor(
        injector: Injector,
        private _location: Location,
        private _ProcessServiceProxy: ProcessesServiceProxy,
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
            this._organizationUnitId = +params.get('processId');
            this.getProcessDetails();
            this.getWorkingPapers({ first: 0, sortField: undefined, rows: 10 });
            this.getExceptions({ first: 0, sortField: undefined, rows: 10 });
        });
    }

    getProcessDetails(): void {
        this._ProcessServiceProxy.getProcessForEdit(this._organizationUnitId).subscribe(result => {
            console.log(result);
            // this.rating = result.ratingName;
            // this.ratingCode = result.ratingCode;
            // this.ratingHistory = result.ratingHistory;
            this.process = result.process;
            this.userName = result.userName;
            //this.userName2 = result.userName2;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

            this.organizationUnit = { id: this._organizationUnitId, displayName: result.organizationUnitDisplayName };

            this.ouProcess.organizationUnit = this.organizationUnit;
            this.residualRiskScore = this.ouProcess.getResidualRiskScore();
            this.inherentRiskScore = this.ouProcess.getInherentRiskScore();
            // let series =  Array.from(new Set(result.ratingHistory.map((i) => {
            //             return { value: Math.floor(Math.random() * 100) + 1, name: i.ratingDate.format() };
            //         })));

            // this.lineChartData = [
            //             {
            //                 name: 'Rating history',
            //                 series: series
            //             }
            //         ];
        });
    }

    overrideDepartmentRating(): void {
        this.createOrEditDepartmentRatingModal.overrideDepartmentRating(this._organizationUnitId, this.process.name);
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

    updateRiskScore(event: any): void {
        //console.log(event);
        this.residualRiskScore = event.residualRiskScore;
        this.inherentRiskScore = event.inherentRiskScore;

        this.residualRiskPercent = this.residualRiskScore / (event.riskCount * 25);
        this.inherentRiskPercent = this.inherentRiskScore / (event.riskCount * 25);

        this.residualRiskRating = this.getRiskRating(this.residualRiskPercent);
        this.inherentRiskRating = this.getRiskRating(this.inherentRiskPercent);
    }

    getRiskRating(riskPercent: number): string {
        if (riskPercent <= 0.3) {
            return 'Low Risk';
        }

        if (riskPercent <= 0.6) {
            return 'Medium Risk';
        }

        return 'High Risk';
    }

    getRiskRatingColor(riskPercent: number): string {
        if (riskPercent <= 0.3) {
            return '#2196F3';
        }

        if (riskPercent <= 0.6) {
            return '#FFC107';
        }

        return 'red';
    }

}
