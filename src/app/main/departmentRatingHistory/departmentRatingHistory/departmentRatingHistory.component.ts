﻿import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { DepartmentRatingHistoryServiceProxy, DepartmentRatingDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDepartmentRatingModalComponent } from './create-or-edit-departmentRating-modal.component';

import { ViewDepartmentRatingModalComponent } from './view-departmentRating-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './departmentRatingHistory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DepartmentRatingHistoryComponent extends AppComponentBase {
    
    @ViewChild('createOrEditDepartmentRatingModal', { static: true }) createOrEditDepartmentRatingModal: CreateOrEditDepartmentRatingModalComponent;
    @ViewChild('viewDepartmentRatingModalComponent', { static: true }) viewDepartmentRatingModal: ViewDepartmentRatingModalComponent;    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
        organizationUnitDisplayNameFilter = '';
        ratingNameFilter = '';




    constructor(
        injector: Injector,
        private _departmentRatingHistoryServiceProxy: DepartmentRatingHistoryServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getDepartmentRatingHistory(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._departmentRatingHistoryServiceProxy.getAll(
            this.filterText,
            this.organizationUnitDisplayNameFilter,
            this.ratingNameFilter,
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

    createDepartmentRating(): void {
        this.createOrEditDepartmentRatingModal.show();        
    }


    deleteDepartmentRating(departmentRating: DepartmentRatingDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._departmentRatingHistoryServiceProxy.delete(departmentRating.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._departmentRatingHistoryServiceProxy.getDepartmentRatingHistoryToExcel(
        this.filterText,
            this.organizationUnitDisplayNameFilter,
            this.ratingNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
