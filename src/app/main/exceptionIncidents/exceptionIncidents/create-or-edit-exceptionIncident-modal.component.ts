import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ExceptionIncidentsServiceProxy, CreateOrEditExceptionIncidentDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from './exceptionIncident-exceptionType-lookup-table-modal.component';
import { ExceptionIncidentUserLookupTableModalComponent } from './exceptionIncident-user-lookup-table-modal.component';
import { ExceptionIncidentTestingTemplateLookupTableModalComponent } from './exceptionIncident-testingTemplate-lookup-table-modal.component';
import { ExceptionIncidentOrganizationUnitLookupTableModalComponent } from './exceptionIncident-organizationUnit-lookup-table-modal.component';

@Component({
    selector: 'createOrEditExceptionIncidentModal',
    templateUrl: './create-or-edit-exceptionIncident-modal.component.html'
})
export class CreateOrEditExceptionIncidentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('exceptionIncidentExceptionTypeLookupTableModal', { static: true }) exceptionIncidentExceptionTypeLookupTableModal: ExceptionIncidentExceptionTypeLookupTableModalComponent;
    @ViewChild('exceptionIncidentUserLookupTableModal', { static: true }) exceptionIncidentUserLookupTableModal: ExceptionIncidentUserLookupTableModalComponent;
    @ViewChild('exceptionIncidentTestingTemplateLookupTableModal', { static: true }) exceptionIncidentTestingTemplateLookupTableModal: ExceptionIncidentTestingTemplateLookupTableModalComponent;
    @ViewChild('exceptionIncidentOrganizationUnitLookupTableModal', { static: true }) exceptionIncidentOrganizationUnitLookupTableModal: ExceptionIncidentOrganizationUnitLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    exceptionIncident: CreateOrEditExceptionIncidentDto = new CreateOrEditExceptionIncidentDto();

    closureDate: Date;
    exceptionTypeName = '';
    userName = '';
    testingTemplateCode = '';
    organizationUnitDisplayName = '';


    constructor(
        injector: Injector,
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy
    ) {
        super(injector);
    }

    show(exceptionIncidentId?: number): void {
    this.closureDate = null;

        if (!exceptionIncidentId) {
            this.exceptionIncident = new CreateOrEditExceptionIncidentDto();
            this.exceptionIncident.id = exceptionIncidentId;
            this.exceptionTypeName = '';
            this.userName = '';
            this.testingTemplateCode = '';
            this.organizationUnitDisplayName = '';

            this.active = true;
            this.modal.show();
        } else {
            this._exceptionIncidentsServiceProxy.getExceptionIncidentForEdit(exceptionIncidentId).subscribe(result => {
                this.exceptionIncident = result.exceptionIncident;

                if (this.exceptionIncident.closureDate) {
					this.closureDate = this.exceptionIncident.closureDate.toDate();
                }
                this.exceptionTypeName = result.exceptionTypeName;
                this.userName = result.userName;
                this.testingTemplateCode = result.testingTemplateCode;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
        if (this.closureDate) {
            if (!this.exceptionIncident.closureDate) {
                this.exceptionIncident.closureDate = moment(this.closureDate).startOf('day');
            }
            else {
                this.exceptionIncident.closureDate = moment(this.closureDate);
            }
        }
        else {
            this.exceptionIncident.closureDate = null;
        }
            this._exceptionIncidentsServiceProxy.createOrEdit(this.exceptionIncident)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectExceptionTypeModal() {
        this.exceptionIncidentExceptionTypeLookupTableModal.id = this.exceptionIncident.exceptionTypeId;
        this.exceptionIncidentExceptionTypeLookupTableModal.displayName = this.exceptionTypeName;
        this.exceptionIncidentExceptionTypeLookupTableModal.show();
    }
    openSelectUserModal() {
        this.exceptionIncidentUserLookupTableModal.id = this.exceptionIncident.raisedById;
        this.exceptionIncidentUserLookupTableModal.displayName = this.userName;
        this.exceptionIncidentUserLookupTableModal.show();
    }
    openSelectTestingTemplateModal() {
        this.exceptionIncidentTestingTemplateLookupTableModal.id = this.exceptionIncident.testingTemplateId;
        this.exceptionIncidentTestingTemplateLookupTableModal.displayName = this.testingTemplateCode;
        this.exceptionIncidentTestingTemplateLookupTableModal.show();
    }
    openSelectOrganizationUnitModal() {
        this.exceptionIncidentOrganizationUnitLookupTableModal.id = this.exceptionIncident.organizationUnitId;
        this.exceptionIncidentOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.exceptionIncidentOrganizationUnitLookupTableModal.show();
    }


    setExceptionTypeIdNull() {
        this.exceptionIncident.exceptionTypeId = null;
        this.exceptionTypeName = '';
    }
    setRaisedByIdNull() {
        this.exceptionIncident.raisedById = null;
        this.userName = '';
    }
    setTestingTemplateIdNull() {
        this.exceptionIncident.testingTemplateId = null;
        this.testingTemplateCode = '';
    }
    setOrganizationUnitIdNull() {
        this.exceptionIncident.organizationUnitId = null;
        this.organizationUnitDisplayName = '';
    }


    getNewExceptionTypeId() {
        this.exceptionIncident.exceptionTypeId = this.exceptionIncidentExceptionTypeLookupTableModal.id;
        this.exceptionTypeName = this.exceptionIncidentExceptionTypeLookupTableModal.displayName;
    }
    getNewRaisedById() {
        this.exceptionIncident.raisedById = this.exceptionIncidentUserLookupTableModal.id;
        this.userName = this.exceptionIncidentUserLookupTableModal.displayName;
    }
    getNewTestingTemplateId() {
        this.exceptionIncident.testingTemplateId = this.exceptionIncidentTestingTemplateLookupTableModal.id;
        this.testingTemplateCode = this.exceptionIncidentTestingTemplateLookupTableModal.displayName;
    }
    getNewOrganizationUnitId() {
        this.exceptionIncident.organizationUnitId = this.exceptionIncidentOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.exceptionIncidentOrganizationUnitLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
