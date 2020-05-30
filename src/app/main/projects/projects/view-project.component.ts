import { AssignWorkingPaperNewDto } from './../../../../shared/service-proxies/service-proxies';
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

@Component({
    selector: 'viewProject',
    templateUrl: './view-project.component.html',
    animations: [appModuleAnimation()]
})
export class ViewProjectComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('workingPaperNewUserLookupTableModal', { static: true }) workingPaperNewUserLookupTableModal: WorkingPaperNewUserLookupTableModalComponent;

    active = false;
    saving = false;
    showGeneralInfoCard = true;
    showWorkingPapersCard = true;
    loading = false;
    loadingWorkingPapers = false;

    openTaskCount = 0;
    openTaskPercent = 0;
    pendReviewCount = 0;
    pendReviewPercent = 0;
    taskStatusEnum = TaskStatus;

    item: GetProjectForViewDto;
    project: CreateOrEditProjectDto = new CreateOrEditProjectDto();
    selectedWorkingPaper: GetWorkingPaperNewForViewDto = new GetWorkingPaperNewForViewDto();

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
        domain: ['#FFC107']
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

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _projectsServiceProxy: ProjectsServiceProxy,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy,
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
            console.log(result);
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

            this.active = true;
            this.loading = false;
        });
        this.getWorkingPaperNews({ first: 0, sortField: undefined, rows: 10 });
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
            '',
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
   
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.loadingWorkingPapers = false;
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
        this.workingPaperNewUserLookupTableModal.displayName = workingPaper.userName;
        this.workingPaperNewUserLookupTableModal.show();
    }

    getNewCompletedUserId() {
        this.selectedWorkingPaper.workingPaperNew.completedUserId = this.workingPaperNewUserLookupTableModal.id;
        this.selectedWorkingPaper.userName = this.workingPaperNewUserLookupTableModal.displayName;

        let assignToUserDto = new AssignWorkingPaperNewDto();
        assignToUserDto.id = this.selectedWorkingPaper.workingPaperNew.id;
        assignToUserDto.userId = this.workingPaperNewUserLookupTableModal.id;
        this._workingPaperNewsServiceProxy.assignToUser(assignToUserDto).subscribe(() => {
            this.reloadPage();
        });
    }
}
