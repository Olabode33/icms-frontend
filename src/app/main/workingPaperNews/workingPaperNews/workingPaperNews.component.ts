import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkingPaperNewsServiceProxy, WorkingPaperNewDto, TaskStatus } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditWorkingPaperNewModalComponent } from './create-or-edit-workingPaperNew-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './workingPaperNews.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class WorkingPaperNewsComponent extends AppComponentBase {

    @ViewChild('createOrEditWorkingPaperNewModal', { static: true }) createOrEditWorkingPaperNewModal: CreateOrEditWorkingPaperNewModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

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



    constructor(
        injector: Injector,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
    }

    getWorkingPaperNews(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

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
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createWorkingPaperNew(): void {
        this.createOrEditWorkingPaperNewModal.show();
    }

    deleteWorkingPaperNew(workingPaperNew: WorkingPaperNewDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._workingPaperNewsServiceProxy.delete(workingPaperNew.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    view(id: number): void {
        this._router.navigate(['app/main/workingPaperNews', id]);
    }

    edit(id: number): void {
        this._router.navigate(['app/main/workingPaperNews/edit', id]);
    }
}
