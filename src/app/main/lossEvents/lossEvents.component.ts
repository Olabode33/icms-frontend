﻿import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LossEventsServiceProxy, LossEventDto, LossEventTypeEnums, Status, LossCategoryEnums } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';


import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './lossEvents.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LossEventsComponent extends AppComponentBase {




    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxAmountFilter: number;
    maxAmountFilterEmpty: number;
    minAmountFilter: number;
    minAmountFilterEmpty: number;
    lossTypeFilter = -1;
    statusFilter = -1;
    userNameFilter = '';
    organizationUnitDisplayNameFilter = '';

    lossEventTypeEnums = LossEventTypeEnums;
    status = Status;
    lossCategoryEnums = LossCategoryEnums;



    constructor(
        injector: Injector,
        private _lossEventsServiceProxy: LossEventsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
    }

    getLossEvents(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._lossEventsServiceProxy.getAll(
            this.filterText,
            this.maxAmountFilter == null ? this.maxAmountFilterEmpty : this.maxAmountFilter,
            this.minAmountFilter == null ? this.minAmountFilterEmpty : this.minAmountFilter,
            this.lossTypeFilter,
            this.statusFilter,
            this.userNameFilter,
            this.organizationUnitDisplayNameFilter,
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

    createLossEvent(): void {
        this._router.navigate(['/app/main/lossEvents/createOrEdit']);
    }


    deleteLossEvent(lossEvent: LossEventDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._lossEventsServiceProxy.delete(lossEvent.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._lossEventsServiceProxy.getLossEventsToExcel(
            this.filterText,
            this.maxAmountFilter == null ? this.maxAmountFilterEmpty : this.maxAmountFilter,
            this.minAmountFilter == null ? this.minAmountFilterEmpty : this.minAmountFilter,
            this.lossTypeFilter,
            this.statusFilter,
            this.userNameFilter,
            this.organizationUnitDisplayNameFilter,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
