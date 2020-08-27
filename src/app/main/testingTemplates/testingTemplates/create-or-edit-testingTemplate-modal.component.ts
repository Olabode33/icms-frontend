import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TestingTemplatesServiceProxy, CreateOrEditTestingTemplateDto, CreateorEditTestTemplateDetailsDto, ProjectOwner } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
//import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplate-departmentRiskControl-lookup-table-modal.component';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/exceptionIncident-exceptionType-lookup-table-modal.component';
import { AppConsts } from '@shared/AppConsts';

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
    availableWeight = 100;
    weight = 100;

    testingTemplate: CreateOrEditTestingTemplateDto = new CreateOrEditTestingTemplateDto();

    departmentRiskControlCode = '';
    exceptionTypeName: string;
    departmentRiskControlId: number;

    projectOwnerEnum = ProjectOwner;

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
            this.getModule();

            this.active = true;
            this.modal.show();
        }
        else {
            this.notify.warn("Please select a risk to attach the template to.");
            return;
        }
    }

    getModule(): void {
        switch (localStorage.getItem(AppConsts.SelectedModuleKey)) {
            case AppConsts.ModuleKeyValueInternalControl:
                this.testingTemplate.projectOwner = ProjectOwner.InternalControl;
                break;
            case AppConsts.ModuleKeyValueInternalAudit:
                this.testingTemplate.projectOwner = ProjectOwner.InternalAudit;
                break;
            case AppConsts.ModuleKeyValueOpRisk:
                this.testingTemplate.projectOwner = ProjectOwner.OperationRisk;
                break;
            case AppConsts.ModuleKeyValueGeneral:
                this.testingTemplate.projectOwner = ProjectOwner.General;
                break;
            default:
                this.testingTemplate.projectOwner = ProjectOwner.General;
                break;
        }
    }

    save(): void {
            this.saving = true;

        if (this.attributes.length == 0) {
            this.notify.error("Include at least one attribute to test.");
            return;
        }


        if (this.availableWeight != 0) {
            this.notify.error("Please ensure the sum of the weight across all attributes is equal to 0.");
            return;
        }

        this.testingTemplate.attributes = [];

        this.attributes.forEach(x => {
            var item = new CreateorEditTestTemplateDetailsDto();

            item.testAttribute = x.name;
            item.weight = x.weight;
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

 

    setDepartmentRiskControlIdNull() {
        this.testingTemplate.departmentRiskControlId = null;
        this.departmentRiskControlCode = '';
    }





    close(): void {
        this.active = false;
        this.modal.hide();
    }


    addAttribute(): void {

        if (this.availableWeight == 0) {
            this.notify.warn("The sum of all weights is equal to 0, please remove or re-allocate the weights.");
            return;
        }

        if (this.attributes.find(x => x.name == this.attributeQuestion) != undefined) {
            this.notify.warn("This attribute has been added already.");
            return;
        }

        if (this.attributeQuestion == '') {
            this.notify.warn("The attribute can not be blank.");
            return;
        }

        if (this.exceptionTypeId != null) {
            this.notify.warn("Select an exception type.");
            return;
        }


        if (this.weight > this.availableWeight) {
            this.notify.warn("This weight can not be more than " + this.availableWeight.toString() + ".");
            return;
        }


        var item = {
            name: this.attributeQuestion,
            weight: this.weight
        };

        this.attributes.push(item);
        this.attributeQuestion = '';
        this.availableWeight -= this.weight;
        this.weight = this.availableWeight;
    }




    openSelectExceptionTypeModal() {
        this.exceptionIncidentExceptionTypeLookupTableModal.show();
    }

    getNewExceptionTypeId() {
        this.testingTemplate.exceptionTypeId = this.exceptionIncidentExceptionTypeLookupTableModal.id;
        this.exceptionTypeName = this.exceptionIncidentExceptionTypeLookupTableModal.displayName;
    }


    removeColumn(item: any): void {
        var index = this.attributes.findIndex(x => x.name == item.name);
        this.availableWeight += this.attributes[index].weight;
        this.attributes.splice(index, 1);
        
    }

}
