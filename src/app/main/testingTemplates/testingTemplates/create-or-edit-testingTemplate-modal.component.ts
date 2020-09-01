import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TestingTemplatesServiceProxy, CreateOrEditTestingTemplateDto, CreateorEditTestTemplateDetailsDto, ProjectOwner, NameValueDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
//import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplate-departmentRiskControl-lookup-table-modal.component';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/exceptionIncident-exceptionType-lookup-table-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'createOrEditTestingTemplateModal',
    templateUrl: './create-or-edit-testingTemplate-modal.component.html'
})
export class CreateOrEditTestingTemplateModalComponent extends AppComponentBase implements OnInit {
    state = false;

    changeState: boolean;

    //@ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    //    @ViewChild('testingTemplateDepartmentRiskControlLookupTableModal', { static: true }) testingTemplateDepartmentRiskControlLookupTableModal: TestingTemplateDepartmentRiskControlLookupTableModalComponent;
    @ViewChild('exceptionIncidentExceptionTypeLookupTableModal', { static: true }) exceptionIncidentExceptionTypeLookupTableModal: ExceptionIncidentExceptionTypeLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    attributes = [];
    QuestionsDropdown: NameValueDto[] = new Array();
    attributeQuestion = '';
    exceptionTypeId: number;
    availableWeight = 100;
    weight = 100;
    selectedQuestion = '';

    testingTemplate: CreateOrEditTestingTemplateDto = new CreateOrEditTestingTemplateDto();

    departmentRiskControlCode = '';
    exceptionTypeName: string;
    departmentRiskControlId: number;

    projectOwnerEnum = ProjectOwner;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
        _testingTemplatesServiceProxy.getTestAttributesForTemplate().subscribe(result => {
            //console.log("RES", result)
            this.QuestionsDropdown = result;
        });
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
        //this.getAllLossType();
    }

    show(departmentRiskControlId?: number): void {

        if (departmentRiskControlId) {
            this.testingTemplate = new CreateOrEditTestingTemplateDto();
            this.testingTemplate.id = null;
            this.departmentRiskControlCode = '';
            this.testingTemplate.departmentRiskControlId = departmentRiskControlId;
            this.getModule();

            this.active = true;
            //this.modal.show();
        } else {
            this.notify.warn('Please select a risk to attach the template to.');
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
            this.notify.error('Include at least one attribute to test.');
            return;
        }


        if (this.availableWeight != 0) {
            this.notify.error('Please ensure the sum of the weight across all attributes is equal to 0.');
            return;
        }

        this.testingTemplate.attributes = [];

        this.attributes.forEach(x => {
            var item = new CreateorEditTestTemplateDetailsDto();

            item.testAttribute = x.name;
            item.weight = x.weight;
            item.parentId = x.parentId;
            this.testingTemplate.attributes.push(item);
        })


        this._testingTemplatesServiceProxy.createOrEdit(this.testingTemplate)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                //this.modalSave.emit(null);
            });
    }



    setDepartmentRiskControlIdNull() {
        this.testingTemplate.departmentRiskControlId = null;
        this.departmentRiskControlCode = '';
    }


    // removeItem(Id: number): void {
    //   //  this.attributes.splice(line, 1);

    //     for(let i = 0; i < this.attributes.length; ++i){
    //         if (this.attributes[i].parentId === Id)
    //         {
    //           var position = this.attributes.indexOf(this.attributes[i].parentId);
    //             this.attributes.splice(position, 1);
    //         }
    //     }


    //   }



    close(): void {
        this.active = false;
        this.goBack();
        //this.modal.hide();
    }

    goBack(): void {
        this._location.back();
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

        //find the question text using the value
        let obj = this.QuestionsDropdown.find(o => o.value === this.selectedQuestion);

        var item = {
            name: this.attributeQuestion,
            weight: this.weight,
            selectedQuestion: obj == null ? null : obj.name,
            parentId: this.selectedQuestion == null ? null : this.selectedQuestion
        };

        this.attributes.push(item);
        this.attributeQuestion = '';
        this.selectedQuestion = '';
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
