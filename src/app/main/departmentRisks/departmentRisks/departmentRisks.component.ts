import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentRisksServiceProxy, DepartmentRiskDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDepartmentRiskModalComponent } from './create-or-edit-departmentRisk-modal.component';
import { ViewDepartmentRiskModalComponent } from './view-departmentRisk-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './departmentRisks.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DepartmentRisksComponent extends AppComponentBase {

    @ViewChild('createOrEditDepartmentRiskModal', { static: true }) createOrEditDepartmentRiskModal: CreateOrEditDepartmentRiskModalComponent;
    @ViewChild('viewDepartmentRiskModalComponent', { static: true }) viewDepartmentRiskModal: ViewDepartmentRiskModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
        departmentNameFilter = '';
        riskNameFilter = '';




    constructor(
        injector: Injector,
        private _departmentRisksServiceProxy: DepartmentRisksServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getDepartmentRisks(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._departmentRisksServiceProxy.getAll(
            this.filterText,
            this.codeFilter,
            this.departmentNameFilter,
            this.riskNameFilter,
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

    createDepartmentRisk(): void {
        this.createOrEditDepartmentRiskModal.show();
    }

    deleteDepartmentRisk(departmentRisk: DepartmentRiskDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._departmentRisksServiceProxy.delete(departmentRisk.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._departmentRisksServiceProxy.getDepartmentRisksToExcel(
        this.filterText,
            this.codeFilter,
            this.departmentNameFilter,
            this.riskNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
