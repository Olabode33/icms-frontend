import { Component, ViewChild, Injector, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {ProjectsServiceProxy, ProjectOrganizationUnitLookupTableDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    selector: 'projectOrganizationUnitLookupTableModal',
    styleUrls: ['./project-organizationUnit-lookup-table-modal.component.less'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './project-organizationUnit-lookup-table-modal.component.html'
})
export class ProjectOrganizationUnitLookupTableModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    filterText = '';
    id: number;
    displayName: string;
    reviewType = 0;
    title = '';
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _projectsServiceProxy: ProjectsServiceProxy
    ) {
        super(injector);
    }

    show(reviewType: number): void {
        this.active = true;
        this.paginator.rows = 5;
        this.reviewType = reviewType;
        this.getAll();
        this.modal.show();
    }

    getAll(event?: LazyLoadEvent) {
        if (!this.active) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        if (this.reviewType == 0) {
            this._projectsServiceProxy.getAllOrganizationUnitForLookupTable(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            ).subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });

            this.title = "Select department";
        } else {

            this.title = "Select process";
            this._projectsServiceProxy.getAllProcesses(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            ).subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
        }

    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    setAndSave(organizationUnit: ProjectOrganizationUnitLookupTableDto) {
        this.id = organizationUnit.id;
        this.displayName = organizationUnit.displayName;
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
}
