import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsServiceProxy, ProjectDto, EntityDto, ProjectOwner } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';


import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './planning.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PlanningComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('calendar', {static: true}) calendarComponent: FullCalendarComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    maxStartDateFilter: moment.Moment;
    minStartDateFilter: moment.Moment;
    maxEndDateFilter: moment.Moment;
    minEndDateFilter: moment.Moment;
    maxBudgetedStartDateFilter: moment.Moment;
    minBudgetedStartDateFilter: moment.Moment;
    maxBudgetedEndDateFilter: moment.Moment;
    minBudgetedEndDateFilter: moment.Moment;
    titleFilter = '';
    organizationUnitDisplayNameFilter = '';
    organizationUnitDisplayName2Filter = '';
    viewCommencedProjectFilter: boolean;
    projectOwner: ProjectOwner;
    _entityTypeFullName = 'ICMSDemo.Projects.Project';
    entityHistoryEnabled = false;

    //Calendar options
    calenderPlugins = [dayGridPlugin, bootstrapPlugin, listPlugin];
    calendarWeekends = true;
    calendarEvents = [];
    calendarHeader = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    };
    calendarButtonText = {
        today:    'Today',
        month:    'Month',
        week:     'Week',
        day:      'Day',
        list:     'List'
    };

    constructor(
        injector: Injector,
        private _projectsServiceProxy: ProjectsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.entityHistoryEnabled = this.setIsEntityHistoryEnabled();
        this.getModule();
        this.getProjects({ first: 0, sortField: undefined, rows: 10 });
    }

    private setIsEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return this.isGrantedAny('Pages.Administration.AuditLogs') && customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getModule(): void {
        switch (localStorage.getItem(AppConsts.SelectedModuleKey)) {
            case AppConsts.ModuleKeyValueInternalControl:
                this.projectOwner = ProjectOwner.InternalControl;
                break;
            case AppConsts.ModuleKeyValueInternalAudit:
                this.projectOwner = ProjectOwner.InternalAudit;
                break;
            case AppConsts.ModuleKeyValueOpRisk:
                this.projectOwner = ProjectOwner.OperationRisk;
                break;
            case AppConsts.ModuleKeyValueGeneral:
                this.projectOwner = ProjectOwner.General;
                break;
            default:
                this.projectOwner = ProjectOwner.General;
                break;
        }
    }

    getProjects(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._projectsServiceProxy.getAll(
            this.filterText,
            this.maxStartDateFilter,
            this.minStartDateFilter,
            this.maxEndDateFilter,
            this.minEndDateFilter,
            this.maxBudgetedStartDateFilter,
            this.minBudgetedStartDateFilter,
            this.maxBudgetedEndDateFilter,
            this.minBudgetedEndDateFilter,
            this.titleFilter,
            this.organizationUnitDisplayNameFilter,
            this.organizationUnitDisplayName2Filter,
            this.viewCommencedProjectFilter,
            this.projectOwner,'',
            //this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;

            this.calendarEvents = new Array();
            result.items.forEach(element => {
                let event = {
                    id: element.project.id,
                    title: element.project.title + ' - ' + element.organizationUnitDisplayName2,
                    start: element.project.budgetedStartDate.format('YYYY-MM-DD'),
                    end: element.project.budgetedEndDate.format('YYYY-MM-DD'),
                    textColor: '#fff',
                    borderColor: element.project.commenced ? '#4CAF50' : '#f64e60',
                    backgroundColor: element.project.commenced ? '#4CAF50' : '#f64e60'
                };

                this.calendarEvents = this.calendarEvents.concat(event);
            });

            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createProject(): void {
        this._router.navigate(['/app/main/projects/projects/createOrEdit']);
    }



    deleteProject(project: ProjectDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._projectsServiceProxy.delete(project.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }


    activateProject(project: ProjectDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    let item = new EntityDto();

                    item.id = project.id;
                    this._projectsServiceProxy.activate(item)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success('Successfully Activated');
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._projectsServiceProxy.getProjectsToExcel(
            this.filterText,
            this.maxStartDateFilter,
            this.minStartDateFilter,
            this.maxEndDateFilter,
            this.minEndDateFilter,
            this.maxBudgetedStartDateFilter,
            this.minBudgetedStartDateFilter,
            this.maxBudgetedEndDateFilter,
            this.minBudgetedEndDateFilter,
            this.titleFilter,
            this.organizationUnitDisplayNameFilter,
            this.organizationUnitDisplayName2Filter,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    eventClick(event): void {
        this._router.navigate(['/app/main/projects/projects/view'], { queryParams: { id: event.event.id } });
    }
}
