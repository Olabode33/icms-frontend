import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ExceptionIncidentsServiceProxy, CreateOrEditExceptionIncidentDto, CreateOrEditExceptionIncidentColumnDto, ExceptionIncidentAttachment } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from './exceptionIncident-exceptionType-lookup-table-modal.component';
import { ExceptionIncidentUserLookupTableModalComponent } from './exceptionIncident-user-lookup-table-modal.component';
import { ExceptionIncidentTestingTemplateLookupTableModalComponent } from './exceptionIncident-testingTemplate-lookup-table-modal.component';
import { ExceptionIncidentOrganizationUnitLookupTableModalComponent } from './exceptionIncident-organizationUnit-lookup-table-modal.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'createOrEditExceptionIncident',
    templateUrl: './create-or-edit-exceptionIncident.component.html',
    animations: [appModuleAnimation()]
})
export class CreateOrEditExceptionIncidentComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('exceptionIncidentExceptionTypeLookupTableModal', { static: true }) exceptionIncidentExceptionTypeLookupTableModal: ExceptionIncidentExceptionTypeLookupTableModalComponent;
    @ViewChild('exceptionIncidentUserLookupTableModal', { static: true }) exceptionIncidentUserLookupTableModal: ExceptionIncidentUserLookupTableModalComponent;
    @ViewChild('exceptionIncidentTestingTemplateLookupTableModal', { static: true }) exceptionIncidentTestingTemplateLookupTableModal: ExceptionIncidentTestingTemplateLookupTableModalComponent;
    @ViewChild('exceptionIncidentOrganizationUnitLookupTableModal', { static: true }) exceptionIncidentOrganizationUnitLookupTableModal: ExceptionIncidentOrganizationUnitLookupTableModalComponent;

    active = false;
    saving = false;

    uploadUrl = AppConsts.remoteServiceBaseUrl + '/DemoUiComponents/UploadFiles';

    exceptionIncident: CreateOrEditExceptionIncidentDto = new CreateOrEditExceptionIncidentDto();

    attachments=[];
    
    uploadedFiles=[];

    closureDate: Date;
    exceptionTypeName = '';
    userName = '';
    testingTemplateCode = '';
    organizationUnitDisplayName = '';
    additionalColumns = [];

    changeReviewDepartment = true;

    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,  
        private _exceptionIncidentsServiceProxy: ExceptionIncidentsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.uploadedFiles=[];
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    
    show(exceptionIncidentId?: number): void {
        this.closureDate = null;
        this.changeReviewDepartment = true;

        this.additionalColumns = [];
        this.uploadedFiles=[];

        if (!exceptionIncidentId) {
            this.exceptionIncident = new CreateOrEditExceptionIncidentDto();
            this.exceptionIncident.id = exceptionIncidentId;
            this.exceptionTypeName = '';
            this.userName = '';
            this.testingTemplateCode = '';
            this.organizationUnitDisplayName = '';

            this.active = true;
        } else {
            this._exceptionIncidentsServiceProxy.getExceptionIncidentForEdit(exceptionIncidentId).subscribe(result => {
                this.exceptionIncident = result.exceptionIncident;

                this.exceptionTypeName = result.exceptionTypeName;
                this.userName = result.userName;
              
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                

                result.exceptionIncident.incidentColumns.forEach(x => {
                    var item = {
                        colId: x.id,
                        value: x.value,
                        name: x.name
                    }

                    this.additionalColumns.push(item);
                });

            this.uploadedFiles=this.exceptionIncident.exceptionIncidentAttachment;
                this.active = true;
            });
        }
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

        this.exceptionIncident.exceptionIncidentAttachment=[];
        this.attachments.forEach(x => {
            this.exceptionIncident.exceptionIncidentAttachment.push(x);
        });


            this._exceptionIncidentsServiceProxy.createOrEdit(this.exceptionIncident)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this._router.navigate(['/app/main/exceptionIncidents/exceptionIncidents']);   
             });
    }


    resolve(): void {
        this._exceptionIncidentsServiceProxy.resolve(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this._router.navigate(['/app/main/exceptionIncidents/exceptionIncidents']);   
            });
    }


    closeApprove(): void {
        this._exceptionIncidentsServiceProxy.close(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this._router.navigate(['/app/main/exceptionIncidents/exceptionIncidents']);   
            });
    }


    reject(): void {
        this._exceptionIncidentsServiceProxy.reject(this.exceptionIncident)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this._router.navigate(['/app/main/exceptionincident/exceptionincident']);   
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
        this.message.info("Fetching additional data points.");
 
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



    onUpload(event): void {

        let resultArray = event.originalEvent.body.result;
        let files = event.files;

        for (let i = 0; i < resultArray.length; i++) {
            let attachment = new ExceptionIncidentAttachment();

            attachment.documentId = resultArray[i].id;
            attachment.fileName = files[i].name;
            attachment.fileFormat = files[i].type;

            this.attachments.push(attachment);
        }
    }

    onBeforeSend(event): void {
        event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
    }

    downloadResourceFile(attachment: ExceptionIncidentAttachment): string {
        return AppConsts.remoteServiceBaseUrl +
            '/File/DownloadBinaryFile?id=' +
            attachment.documentId +
            '&contentType=' +
            attachment.fileFormat +
            '&fileName=' +
            attachment.fileName;
    }

}
