import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentRiskControlsServiceProxy, DepartmentRiskControlDto , Frequency } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDepartmentRiskControlModalComponent } from './create-or-edit-departmentRiskControl-modal.component';
import { ViewDepartmentRiskControlModalComponent } from './view-departmentRiskControl-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './departmentRiskControls.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DepartmentRiskControlsComponent extends AppComponentBase {

    @ViewChild('createOrEditDepartmentRiskControlModal', { static: true }) createOrEditDepartmentRiskControlModal: CreateOrEditDepartmentRiskControlModalComponent;
    @ViewChild('viewDepartmentRiskControlModalComponent', { static: true }) viewDepartmentRiskControlModal: ViewDepartmentRiskControlModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    frequencyFilter = -1;
        departmentRiskCodeFilter = '';
        controlCodeFilter = '';

    frequency = Frequency;

    _entityTypeFullName = 'ICMSDemo.DepartmentRiskControls.DepartmentRiskControl';
    entityHistoryEnabled = false;

    constructor(
        injector: Injector,
        private _departmentRiskControlsServiceProxy: DepartmentRiskControlsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.entityHistoryEnabled = this.setIsEntityHistoryEnabled();
    }

    private setIsEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getDepartmentRiskControls(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._departmentRiskControlsServiceProxy.getAll(
            this.filterText,
            this.frequencyFilter,
            -1,
            this.departmentRiskCodeFilter,
            this.controlCodeFilter,
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

    createDepartmentRiskControl(): void {
        this.createOrEditDepartmentRiskControlModal.show();
    }

    showHistory(departmentRiskControl: DepartmentRiskControlDto): void {
        this.entityTypeHistoryModal.show({
            entityId: departmentRiskControl.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteDepartmentRiskControl(departmentRiskControl: DepartmentRiskControlDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._departmentRiskControlsServiceProxy.delete(departmentRiskControl.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._departmentRiskControlsServiceProxy.getDepartmentRiskControlsToExcel(
        this.filterText,
            this.frequencyFilter,
            this.departmentRiskCodeFilter,
            this.controlCodeFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
