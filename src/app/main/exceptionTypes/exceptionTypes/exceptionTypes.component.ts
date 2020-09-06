import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { ExceptionTypesServiceProxy, ExceptionTypeDto , Severity, ExceptionRemediationTypeEnum } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy, ExceptionTypesServiceProxy, ExceptionTypeDto, ExceptionRemediationTypeEnum, Severity } from '@shared/service-proxies/service-proxies';
import { CreateOrEditExceptionTypeModalComponent } from './create-or-edit-exceptionType-modal.component';
import { ViewExceptionTypeModalComponent } from './view-exceptionType-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './exceptionTypes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExceptionTypesComponent extends AppComponentBase {

    @ViewChild('createOrEditExceptionTypeModal', { static: true }) createOrEditExceptionTypeModal: CreateOrEditExceptionTypeModalComponent;
    @ViewChild('viewExceptionTypeModalComponent', { static: true }) viewExceptionTypeModal: ViewExceptionTypeModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
    nameFilter = '';
    severityFilter = -1;

    severity = Severity;

    remediationTypeEnum = ExceptionRemediationTypeEnum;

    constructor(
        injector: Injector,
        private _exceptionTypesServiceProxy: ExceptionTypesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getExceptionTypes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._exceptionTypesServiceProxy.getAll(
            this.filterText,
            this.codeFilter,
            this.nameFilter,
            this.severityFilter,
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

    createExceptionType(): void {
        this.createOrEditExceptionTypeModal.show();
    }

    deleteExceptionType(exceptionType: ExceptionTypeDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._exceptionTypesServiceProxy.delete(exceptionType.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._exceptionTypesServiceProxy.getExceptionTypesToExcel(
        this.filterText,
            this.codeFilter,
            this.nameFilter,
            this.severityFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
