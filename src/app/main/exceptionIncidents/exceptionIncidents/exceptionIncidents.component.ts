import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionIncidentsServiceProxy, ExceptionIncidentDto , Status } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditExceptionIncidentModalComponent } from './create-or-edit-exceptionIncident-modal.component';
import { ViewExceptionIncidentModalComponent } from './view-exceptionIncident-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './exceptionIncidents.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExceptionIncidentsComponent extends AppComponentBase {

    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;
    @ViewChild('viewExceptionIncidentModalComponent', { static: true }) viewExceptionIncidentModal: ViewExceptionIncidentModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxDateFilter : moment.Moment;
		minDateFilter : moment.Moment;
    statusFilter = -1;
    maxClosureDateFilter : moment.Moment;
		minClosureDateFilter : moment.Moment;
        exceptionTypeNameFilter = '';
        userNameFilter = '';
        testingTemplateCodeFilter = '';
        organizationUnitDisplayNameFilter = '';

    status = Status;



    constructor(
        injector: Injector,
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
    }

    getExceptionIncidents(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._exceptionIncidentsServiceProxy.getAll(
            this.filterText,
            this.maxDateFilter,
            this.minDateFilter,
            this.statusFilter,
            this.maxClosureDateFilter,
            this.minClosureDateFilter,
            this.exceptionTypeNameFilter,
            this.userNameFilter,
            this.testingTemplateCodeFilter,
            this.organizationUnitDisplayNameFilter,
            -1, -1,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.totalRecordsCount = result.items.length;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createExceptionIncident(): void {
        //this.createOrEditExceptionIncidentModal.show();
        this._router.navigate(['/app/main/exceptionIncidents/exceptionIncidents/createOrEdit']);
    }

    deleteExceptionIncident(exceptionIncident: ExceptionIncidentDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._exceptionIncidentsServiceProxy.delete(exceptionIncident.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._exceptionIncidentsServiceProxy.getExceptionIncidentsToExcel(
        this.filterText,
            this.maxDateFilter,
            this.minDateFilter,
            this.statusFilter,
            this.maxClosureDateFilter,
            this.minClosureDateFilter,
            this.exceptionTypeNameFilter,
            this.userNameFilter,
            this.testingTemplateCodeFilter,
            this.organizationUnitDisplayNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }

    view(id:number): void {
        this._router.navigate(['/app/main/exceptionIncidents/exceptionIncidents/createOrEdit'], { queryParams: { id: id } });
    }
}
