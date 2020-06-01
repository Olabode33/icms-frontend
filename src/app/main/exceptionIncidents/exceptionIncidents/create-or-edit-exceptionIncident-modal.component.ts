import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ExceptionIncidentsServiceProxy, CreateOrEditExceptionIncidentDto, CreateOrEditExceptionIncidentColumnDto } from '@shared/service-proxies/service-proxies';
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
    additionalColumns = [];


    changeReviewDepartment = true;

    constructor(
        injector: Injector,
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy
    ) {
        super(injector);
    }

    show(exceptionIncidentId?: number): void {
        this.closureDate = null;
        this.changeReviewDepartment = true;

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

                this.exceptionTypeName = result.exceptionTypeName;
                this.userName = result.userName;
              
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.additionalColumns = [];

                result.exceptionIncident.incidentColumns.forEach(x => {
                    var item = {
                        colId: x.id,
                        value: x.value,
                        name: x.name
                    }

                    this.additionalColumns.push(item);
                });
                this.active = true;
                this.modal.show();
            });
        }
    }

    logException(departmentId: number, ouName: string, workingPaperId: string): void {
        this.exceptionIncident = new CreateOrEditExceptionIncidentDto();
        this.exceptionIncident.id = null;
        this.exceptionIncident.organizationUnitId = departmentId;
        this.exceptionIncident.workingPaperId = workingPaperId;
        this.exceptionTypeName = '';
        this.userName = '';
        this.testingTemplateCode = '';
        this.organizationUnitDisplayName = ouName;
        this.closureDate = null;

        this.changeReviewDepartment = false;
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;
        this.exceptionIncident.incidentColumns = [];

        this.additionalColumns.forEach(x => {
            var item = new CreateOrEditExceptionIncidentColumnDto();
            item.exceptionIncidentId = null;
            item.exceptionTypeColumnId = x.colId;
            item.value = x.value;

            this.exceptionIncident.incidentColumns.push(item);
        });


            this._exceptionIncidentsServiceProxy.createOrEdit(this.exceptionIncident)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }


    resolve(): void {
        this._exceptionIncidentsServiceProxy.resolve(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }


    closeApprove(): void {
        this._exceptionIncidentsServiceProxy.close(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }


    reject(): void {
        this._exceptionIncidentsServiceProxy.reject(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
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
        this.exceptionIncidentUserLookupTableModal.id = this.exceptionIncident.causedById;
        this.exceptionIncidentUserLookupTableModal.displayName = this.userName;
        this.exceptionIncidentUserLookupTableModal.show();
    }
    openSelectTestingTemplateModal() {
    //    this.exceptionIncidentTestingTemplateLookupTableModal.id = this.exceptionIncident.testingTemplateId;
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
        this.exceptionIncident.causedById = null;
        this.userName = '';
    }
    setTestingTemplateIdNull() {
     //   this.exceptionIncident.testingTemplateId = null;
        this.testingTemplateCode = '';
    }
    setOrganizationUnitIdNull() {
        this.exceptionIncident.organizationUnitId = null;
        this.organizationUnitDisplayName = '';
    }


    getNewExceptionTypeId() {
        this.exceptionIncident.exceptionTypeId = this.exceptionIncidentExceptionTypeLookupTableModal.id;
        this.exceptionTypeName = this.exceptionIncidentExceptionTypeLookupTableModal.displayName;


        this.getColumns(this.exceptionIncident.exceptionTypeId);
    }
    getNewRaisedById() {
        this.exceptionIncident.causedById = this.exceptionIncidentUserLookupTableModal.id;
        this.userName = this.exceptionIncidentUserLookupTableModal.displayName;
    }
    getNewTestingTemplateId() {
    //    this.exceptionIncident.testingTemplateId = this.exceptionIncidentTestingTemplateLookupTableModal.id;
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


    getColumns(id: number): void {
        this.notify.info("Fetching additional data points.");
 
        this._exceptionIncidentsServiceProxy.getExceptionColumnsForIncident(id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(result => {
                this.additionalColumns = [];

                result.forEach(x => {
                    var item = {
                        colId: x.id,
                        value: null,
                        dataFieldType: x.dataFieldType,
                        name: x.name
                    }

                    this.additionalColumns.push(item);
                });


            });
    }


}
