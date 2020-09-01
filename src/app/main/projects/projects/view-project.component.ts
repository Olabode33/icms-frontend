import { AssignWorkingPaperNewDto, GetExceptionIncidentForViewDto, Status, EntityDto, ExceptionIncidentsServiceProxy, ProjectOwner } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectsServiceProxy, GetProjectForViewDto, ProjectDto, CreateOrEditProjectDto, TaskStatus, WorkingPaperNewsServiceProxy, Frequency, GetWorkingPaperNewForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { WorkingPaperNewUserLookupTableModalComponent } from '@app/main/workingPaperNews/workingPaperNews/workingPaperNew-user-lookup-table-modal.component';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'viewProject',
    templateUrl: './view-project.component.html',
    animations: [appModuleAnimation()]
})
export class ViewProjectComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('exceptionsPaginator', { static: true }) exceptionsPaginator: Paginator;
    @ViewChild('workingPaperNewUserLookupTableModal', { static: true }) workingPaperNewUserLookupTableModal: WorkingPaperNewUserLookupTableModalComponent;
    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;

    active = false;
    saving = false;
    showGeneralInfoCard = false;
    showWorkingPapersCard = false;
    showExceptionsCard = false;
    loading = false;
    loadingWorkingPapers = false;
    loadingExceptions = false;

    openTaskCount = 0;
    openTaskPercent = 0;
    pendReviewCount = 0;
    pendReviewPercent = 0;
    completedTaskCount = 0;
    completedTaskPercent = 0;
    exceptionsCount = 0;
    exceptionsPercent = 0;
    taskStatusEnum = TaskStatus;
    statusEnum = Status;
    selectedModule: ProjectOwner;

    item: GetProjectForViewDto;
    project: CreateOrEditProjectDto = new CreateOrEditProjectDto();
    selectedWorkingPaper: GetWorkingPaperNewForViewDto = new GetWorkingPaperNewForViewDto();
    exceptions: GetExceptionIncidentForViewDto[] = new Array();

    organizationUnitDisplayName = '';
    organizationUnitDisplayName2 = '';

    //Chart options
    gaugeMin = 0;
    gaugeMax = 100;
    gaugeLargeSegments = 10;
    gaugeSmallSegments = 5;
    gaugeTextValue = '';
    gaugeUnits = 'completed';
    gaugeAngleSpan = 360;
    gaugeStartAngle = 0;
    gaugeShowAxis = false;
    gaugeValue = 50; // linear gauge value
    gaugePreviousValue = 70;
    animations = true;
    showText = true;
    margin = true;
    marginTop = 40;
    marginRight = 40;
    marginBottom = 40;
    marginLeft = 40;
    single = [
        {
            name: 'Completion Rate',
            value: 100
        }];

    colorScheme = {
        domain: ['#1bc5bd']
    };


    advancedFiltersAreShown = false;
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

    taskStatus = TaskStatus;
    frequencyEnum = Frequency;
    projectOwnerEnum = ProjectOwner;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _projectsServiceProxy: ProjectsServiceProxy,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy,
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy,
        private _router: Router
    ) {
        super(injector);
        this.item = new GetProjectForViewDto();
        this.item.project = new ProjectDto();
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(projectId: number): void {
        this.loading = true;
        this.projectId = projectId;
        this._projectsServiceProxy.getProjectForEdit(projectId).subscribe(result => {
           // console.log(result);
            this.project = result.project;

            this.organizationUnitDisplayName = result.organizationUnitDisplayName;
            this.organizationUnitDisplayName2 = result.organizationUnitDisplayName2;

            this.single = [
                {
                    name: 'Completion Rate',
                    value: result.completionLevel * 100
                }];
            this.openTaskCount = result.openWorkingPapers;
            this.openTaskPercent = result.openTaskPercent * 100;
            this.pendReviewCount = result.pendingReviews;
            this.pendReviewPercent = result.pendingReviewsPercent * 100;
            this.completedTaskCount = result.completedTaskCount;
            this.exceptionsCount = result.exceptionsCount;
            this.completedTaskPercent = result.completionLevel * 100;

            this.active = true;
            this.loading = false;
        });
        this.getWorkingPaperNews({ first: 0, sortField: undefined, rows: 10 });
        this.getException({ first: 0, sortField: undefined, rows: 10 });
    }

    valueFormatting(value: number): string {
        return `${Math.round(value).toLocaleString()}%`;
    }

    getWorkingPaperNews(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.loadingWorkingPapers = true;

        this._workingPaperNewsServiceProxy.getAll(
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
            -1,
            '',
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
           // console.log(result.items);
            this.loadingWorkingPapers = false;
        });
    }

    getException(event?: LazyLoadEvent): void {
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
            -1,
            '',
            this.primengTableHelper.getSkipCount(this.exceptionsPaginator, event),
            this.primengTableHelper.getMaxResultCount(this.exceptionsPaginator, event)
        ).subscribe(result => {
            this.exceptions = result.items;
            this.exceptionsCount = result.totalCount;
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    view(id: number): void {
        this._router.navigate(['app/main/workingPaperNews', id]);
    }

    edit(id: number): void {
        this._router.navigate(['app/main/workingPaperNews/edit', id]);
    }

    openAssignToUserModal(workingPaper: GetWorkingPaperNewForViewDto) {
        this.selectedWorkingPaper = workingPaper;
        this.workingPaperNewUserLookupTableModal.id = workingPaper.workingPaperNew.completedUserId;
        this.workingPaperNewUserLookupTableModal.displayName = workingPaper.assignedTo;
        this.workingPaperNewUserLookupTableModal.show();
    }

    getNewCompletedUserId() {
        this.selectedWorkingPaper.workingPaperNew.completedUserId = this.workingPaperNewUserLookupTableModal.id;
        this.selectedWorkingPaper.assignedTo = this.workingPaperNewUserLookupTableModal.displayName;

        let assignToUserDto = new AssignWorkingPaperNewDto();
        assignToUserDto.id = this.selectedWorkingPaper.workingPaperNew.id;
        assignToUserDto.userId = this.workingPaperNewUserLookupTableModal.id;
        this._workingPaperNewsServiceProxy.assignToUser(assignToUserDto).subscribe(() => {
            this.reloadPage();
        });
    }

    viewException(id: number): void {
        this.createOrEditExceptionIncidentModal.show(id);
    }

    goBack(): void {
        this._router.navigate(['/app/main/projects/projects']);
    }


    closeProject(): void {
        this.message.confirm(
            '',
            "Are you sure you want to close this project now?",
            (isConfirmed) => {
                if (isConfirmed) {
                    var item = new EntityDto();
                    item.id = this.project.id;

                    this._projectsServiceProxy.closeProject(item)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success("This project has been successfully closed.");
                        });
                }
            }
        );
    }

    activateProject(): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    let item = new EntityDto();

                    item.id = this.project.id;
                    this._projectsServiceProxy.activate(item)
                        .subscribe(() => {
                            this.show(this.project.id);
                            this.message.success('Successfully Activated');
                        });
                }
            }
        );
    }

}
