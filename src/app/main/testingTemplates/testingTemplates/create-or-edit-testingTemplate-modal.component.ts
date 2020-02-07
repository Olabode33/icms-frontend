import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TestingTemplatesServiceProxy, CreateOrEditTestingTemplateDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplate-departmentRiskControl-lookup-table-modal.component';

@Component({
    selector: 'createOrEditTestingTemplateModal',
    templateUrl: './create-or-edit-testingTemplate-modal.component.html'
})
export class CreateOrEditTestingTemplateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('testingTemplateDepartmentRiskControlLookupTableModal', { static: true }) testingTemplateDepartmentRiskControlLookupTableModal: TestingTemplateDepartmentRiskControlLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    testingTemplate: CreateOrEditTestingTemplateDto = new CreateOrEditTestingTemplateDto();

    departmentRiskControlCode = '';


    constructor(
        injector: Injector,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
    }

    show(testingTemplateId?: number): void {

        if (!testingTemplateId) {
            this.testingTemplate = new CreateOrEditTestingTemplateDto();
            this.testingTemplate.id = testingTemplateId;
            this.departmentRiskControlCode = '';

            this.active = true;
            this.modal.show();
        } else {
            this._testingTemplatesServiceProxy.getTestingTemplateForEdit(testingTemplateId).subscribe(result => {
                this.testingTemplate = result.testingTemplate;

                this.departmentRiskControlCode = result.departmentRiskControlCode;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._testingTemplatesServiceProxy.createOrEdit(this.testingTemplate)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectDepartmentRiskControlModal() {
        this.testingTemplateDepartmentRiskControlLookupTableModal.id = this.testingTemplate.departmentRiskControlId;
        this.testingTemplateDepartmentRiskControlLookupTableModal.displayName = this.departmentRiskControlCode;
        this.testingTemplateDepartmentRiskControlLookupTableModal.show();
    }


    setDepartmentRiskControlIdNull() {
        this.testingTemplate.departmentRiskControlId = null;
        this.departmentRiskControlCode = '';
    }


    getNewDepartmentRiskControlId() {
        this.testingTemplate.departmentRiskControlId = this.testingTemplateDepartmentRiskControlLookupTableModal.id;
        this.departmentRiskControlCode = this.testingTemplateDepartmentRiskControlLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
