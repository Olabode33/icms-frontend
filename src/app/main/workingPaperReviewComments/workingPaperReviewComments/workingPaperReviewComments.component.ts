import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { WorkingPaperReviewCommentsServiceProxy, WorkingPaperReviewCommentDto , Status, Severity } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditWorkingPaperReviewCommentModalComponent } from './create-or-edit-workingPaperReviewComment-modal.component';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './workingPaperReviewComments.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class WorkingPaperReviewCommentsComponent extends AppComponentBase {
    
    
    @ViewChild('createOrEditWorkingPaperReviewCommentModal', { static: true }) createOrEditWorkingPaperReviewCommentModal: CreateOrEditWorkingPaperReviewCommentModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    priorityFilter = '';
    statusFilter = -1;
    maxExpectedCompletionDateFilter : moment.Moment;
		minExpectedCompletionDateFilter : moment.Moment;
        userNameFilter = '';
        workingPaperCodeFilter = '';
        userName2Filter = '';

    status = Status;
    severity = Severity;



    constructor(
        injector: Injector,
        private _workingPaperReviewCommentsServiceProxy: WorkingPaperReviewCommentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getWorkingPaperReviewComments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._workingPaperReviewCommentsServiceProxy.getAll(
            this.filterText,
            this.priorityFilter,
            this.statusFilter,
            this.maxExpectedCompletionDateFilter,
            this.minExpectedCompletionDateFilter,
            this.userNameFilter,
            this.workingPaperCodeFilter,
            this.userName2Filter,
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

    createWorkingPaperReviewComment(): void {
        this.createOrEditWorkingPaperReviewCommentModal.show();        
    }


    deleteWorkingPaperReviewComment(workingPaperReviewComment: WorkingPaperReviewCommentDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._workingPaperReviewCommentsServiceProxy.delete(workingPaperReviewComment.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._workingPaperReviewCommentsServiceProxy.getWorkingPaperReviewCommentsToExcel(
        this.filterText,
            this.priorityFilter,
            this.statusFilter,
            this.maxExpectedCompletionDateFilter,
            this.minExpectedCompletionDateFilter,
            this.userNameFilter,
            this.workingPaperCodeFilter,
            this.userName2Filter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
