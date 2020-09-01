import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcessUserLookupTableModalComponent } from '../lookups/process-user-lookup-table-modal.component';
import { ProcessOrganizationUnitLookupTableModalComponent } from '../lookups/process-organizationUnit-lookup-table-modal.component';
import { CreateOrEditProcessDto, ProcessesServiceProxy } from '@shared/service-proxies/service-proxies';
import { IOrganizationUnitOnEdit } from '@app/admin/organization-units/create-or-edit-unit-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-process-modal',
  templateUrl: './create-edit-process-modal.component.html',
  styleUrls: ['./create-edit-process-modal.component.css']
})
export class CreateEditProcessModalComponent extends AppComponentBase  {

    @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
    @ViewChild('organizationUnitDisplayName', {static: true}) organizationUnitDisplayNameInput: ElementRef;

    @Output() unitCreated: EventEmitter<any> = new EventEmitter<any>();
    @Output() unitUpdated: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    @ViewChild('processUserLookupTableModal', { static: true }) processUserLookupTableModal: ProcessUserLookupTableModalComponent;
    @ViewChild('processOrganizationUnitLookupTableModal', { static: true }) processOrganizationUnitLookupTableModal: ProcessOrganizationUnitLookupTableModalComponent;

    process: CreateOrEditProcessDto = new CreateOrEditProcessDto();

    userName = '';
    organizationUnitDisplayName = '';

    parentProcess = '';

    organizationUnit: IOrganizationUnitOnEdit = {};

    constructor(
        injector: Injector,
        private _processesServiceProxy: ProcessesServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    show(processId?: number, parentId?: number, displayName?: string): void {
        console.log(this.process, parentId, displayName);
        if (!processId) {
            this.process = new CreateOrEditProcessDto();
            this.process.id = processId;
            this.process.parentId = parentId;
            this.userName = '';
            this.organizationUnitDisplayName = '';

            this.active = true;
            this.modal.show();
            this._changeDetector.detectChanges();
        } else {
            this._processesServiceProxy.getProcessForEdit(processId).subscribe(result => {
                this.process = result.process;
                this.process.parentId = parentId;
                this.userName = result.userName;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;

                this.active = true;
                this.modal.show();
                this._changeDetector.detectChanges();
            });
        }
    }

    save(): void {
        this.saving = true;


        this._processesServiceProxy.createOrEdit(this.process)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(null);
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    openSelectUserModal() {
        this.processUserLookupTableModal.id = this.process.ownerId;
        this.processUserLookupTableModal.displayName = this.userName;
        this.processUserLookupTableModal.show();
    }
    openSelectOrganizationUnitModal() {
        this.processOrganizationUnitLookupTableModal.id = this.process.departmentId;
        this.processOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.processOrganizationUnitLookupTableModal.show();
    }


    setOwnerIdNull() {
        this.process.ownerId = null;
        this.userName = '';
    }
    setDepartmentIdNull() {
        this.process.departmentId = null;
        this.organizationUnitDisplayName = '';
    }


    getNewOwnerId() {
        this.process.ownerId = this.processUserLookupTableModal.id;
        this.userName = this.processUserLookupTableModal.displayName;
    }
    getNewDepartmentId() {
        this.process.departmentId = this.processOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.processOrganizationUnitLookupTableModal.displayName;
    }

}
