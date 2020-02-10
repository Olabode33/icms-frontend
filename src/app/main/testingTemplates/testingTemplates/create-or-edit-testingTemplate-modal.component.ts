import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TestingTemplatesServiceProxy, CreateOrEditTestingTemplateDto, CreateorEditTestTemplateDetailsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
//import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplate-departmentRiskControl-lookup-table-modal.component';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/exceptionIncident-exceptionType-lookup-table-modal.component';

@Component({
    selector: 'createOrEditTestingTemplateModal',
    templateUrl: './create-or-edit-testingTemplate-modal.component.html'
})
export class CreateOrEditTestingTemplateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
//    @ViewChild('testingTemplateDepartmentRiskControlLookupTableModal', { static: true }) testingTemplateDepartmentRiskControlLookupTableModal: TestingTemplateDepartmentRiskControlLookupTableModalComponent;
    @ViewChild('exceptionIncidentExceptionTypeLookupTableModal', { static: true }) exceptionIncidentExceptionTypeLookupTableModal: ExceptionIncidentExceptionTypeLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    attributes = [];
    attributeQuestion = '';
    exceptionTypeId: number;


    testingTemplate: CreateOrEditTestingTemplateDto = new CreateOrEditTestingTemplateDto();

    departmentRiskControlCode = '';
    exceptionTypeName: string;
    departmentRiskControlId: number;

    constructor(
        injector: Injector,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
    }

    show(departmentRiskControlId?: number): void {

        if (departmentRiskControlId) {
            this.testingTemplate = new CreateOrEditTestingTemplateDto();
            this.testingTemplate.id = null;
            this.departmentRiskControlCode = '';
            this.testingTemplate.departmentRiskControlId = departmentRiskControlId;

            this.active = true;
            this.modal.show();
        }
        else {
            this.notify.warn("Please select a risk to attach the template to.");
            return;
        }
    }

    save(): void {
            this.saving = true;

        if (this.attributes.length == 0) {
            this.notify.error("Include at least one attribute to test.");
            return;
        }

        this.testingTemplate.attributes = [];

        this.attributes.forEach(x => {
            var item = new CreateorEditTestTemplateDetailsDto();

            item.testAttribute = x.name;

            this.testingTemplate.attributes.push(item);
        })

			
            this._testingTemplatesServiceProxy.createOrEdit(this.testingTemplate)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    //openSelectDepartmentRiskControlModal() {
    //    this.testingTemplateDepartmentRiskControlLookupTableModal.id = this.testingTemplate.departmentRiskControlId;
    //    this.testingTemplateDepartmentRiskControlLookupTableModal.displayName = this.departmentRiskControlCode;
    //    this.testingTemplateDepartmentRiskControlLookupTableModal.show();
    //}


    setDepartmentRiskControlIdNull() {
        this.testingTemplate.departmentRiskControlId = null;
        this.departmentRiskControlCode = '';
    }


    //getNewDepartmentRiskControlId() {
    //    this.testingTemplate.departmentRiskControlId = this.testingTemplateDepartmentRiskControlLookupTableModal.id;
    //    this.departmentRiskControlCode = this.testingTemplateDepartmentRiskControlLookupTableModal.displayName;
    //}


    close(): void {
        this.active = false;
        this.modal.hide();
    }


    addAttribute(): void {
        if (this.attributes.find(x => x.name == this.attributeQuestion) != undefined) {
            this.notify.info("This attribute has been added already.");
            return;
        }

        if (this.attributeQuestion == '') {
            this.notify.info("The attribute can not be blank.");
            return;
        }

        if (this.exceptionTypeId != null) {
            this.notify.info("Select an exception type.");
            return;
        }


        var item = {
            name: this.attributeQuestion
        };

        this.attributes.push(item);
        this.attributeQuestion = '';
    }




    openSelectExceptionTypeModal() {
        this.exceptionIncidentExceptionTypeLookupTableModal.show();
    }

    getNewExceptionTypeId() {
        this.testingTemplate.exceptionTypeId = this.exceptionIncidentExceptionTypeLookupTableModal.id;
        this.exceptionTypeName = this.exceptionIncidentExceptionTypeLookupTableModal.displayName;
    }


    removeColumn(item: any): void {
        var index = this.attributes.findIndex(x => x == item);
        this.attributes.splice(index, 1);
    }

}
