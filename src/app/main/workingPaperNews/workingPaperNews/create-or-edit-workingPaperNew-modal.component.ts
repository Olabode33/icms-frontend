import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WorkingPaperNewsServiceProxy, CreateOrEditWorkingPaperNewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { WorkingPaperNewTestingTemplateLookupTableModalComponent } from './workingPaperNew-testingTemplate-lookup-table-modal.component';
import { WorkingPaperNewOrganizationUnitLookupTableModalComponent } from './workingPaperNew-organizationUnit-lookup-table-modal.component';
import { WorkingPaperNewUserLookupTableModalComponent } from './workingPaperNew-user-lookup-table-modal.component';

@Component({
    selector: 'createOrEditWorkingPaperNewModal',
    templateUrl: './create-or-edit-workingPaperNew-modal.component.html'
})
export class CreateOrEditWorkingPaperNewModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('workingPaperNewTestingTemplateLookupTableModal', { static: true }) workingPaperNewTestingTemplateLookupTableModal: WorkingPaperNewTestingTemplateLookupTableModalComponent;
    @ViewChild('workingPaperNewOrganizationUnitLookupTableModal', { static: true }) workingPaperNewOrganizationUnitLookupTableModal: WorkingPaperNewOrganizationUnitLookupTableModalComponent;
    @ViewChild('workingPaperNewUserLookupTableModal', { static: true }) workingPaperNewUserLookupTableModal: WorkingPaperNewUserLookupTableModalComponent;
    @ViewChild('workingPaperNewUserLookupTableModal2', { static: true }) workingPaperNewUserLookupTableModal2: WorkingPaperNewUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    workingPaperNew: CreateOrEditWorkingPaperNewDto = new CreateOrEditWorkingPaperNewDto();

    completionDate: Date;
    testingTemplateCode = '';
    organizationUnitDisplayName = '';
    userName = '';
    userName2 = '';


    constructor(
        injector: Injector,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy
    ) {
        super(injector);
    }

    show(workingPaperNewId?: string): void {
    this.completionDate = null;

        if (!workingPaperNewId) {
            this.workingPaperNew = new CreateOrEditWorkingPaperNewDto();
            this.workingPaperNew.id = workingPaperNewId;
            this.workingPaperNew.taskDate = moment().startOf('day');
            this.workingPaperNew.dueDate = moment().startOf('day');
            this.workingPaperNew.reviewDate = moment().startOf('day');
            this.testingTemplateCode = '';
            this.organizationUnitDisplayName = '';
            this.userName = '';
            this.userName2 = '';

            this.active = true;
            this.modal.show();
        } else {
            this._workingPaperNewsServiceProxy.getWorkingPaperNewForEdit(workingPaperNewId).subscribe(result => {
                this.workingPaperNew = result.workingPaperNew;

                if (this.workingPaperNew.completionDate) {
					this.completionDate = this.workingPaperNew.completionDate.toDate();
                }
                this.testingTemplateCode = result.testingTemplateCode;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.userName = result.userName;
                this.userName2 = result.userName2;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
        if (this.completionDate) {
            if (!this.workingPaperNew.completionDate) {
                this.workingPaperNew.completionDate = moment(this.completionDate).startOf('day');
            }
            else {
                this.workingPaperNew.completionDate = moment(this.completionDate);
            }
        }
        else {
            this.workingPaperNew.completionDate = null;
        }
            this._workingPaperNewsServiceProxy.createOrEdit(this.workingPaperNew)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectTestingTemplateModal() {
        this.workingPaperNewTestingTemplateLookupTableModal.id = this.workingPaperNew.testingTemplateId;
        this.workingPaperNewTestingTemplateLookupTableModal.displayName = this.testingTemplateCode;
        this.workingPaperNewTestingTemplateLookupTableModal.show();
    }
    openSelectOrganizationUnitModal() {
        this.workingPaperNewOrganizationUnitLookupTableModal.id = this.workingPaperNew.organizationUnitId;
        this.workingPaperNewOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.workingPaperNewOrganizationUnitLookupTableModal.show();
    }
    openSelectUserModal() {
        this.workingPaperNewUserLookupTableModal.id = this.workingPaperNew.completedUserId;
        this.workingPaperNewUserLookupTableModal.displayName = this.userName;
        this.workingPaperNewUserLookupTableModal.show();
    }
    openSelectUserModal2() {
        this.workingPaperNewUserLookupTableModal2.id = this.workingPaperNew.reviewedUserId;
        this.workingPaperNewUserLookupTableModal2.displayName = this.userName;
        this.workingPaperNewUserLookupTableModal2.show();
    }


    setTestingTemplateIdNull() {
        this.workingPaperNew.testingTemplateId = null;
        this.testingTemplateCode = '';
    }
    setOrganizationUnitIdNull() {
        this.workingPaperNew.organizationUnitId = null;
        this.organizationUnitDisplayName = '';
    }
    setCompletedUserIdNull() {
        this.workingPaperNew.completedUserId = null;
        this.userName = '';
    }
    setReviewedUserIdNull() {
        this.workingPaperNew.reviewedUserId = null;
        this.userName2 = '';
    }


    getNewTestingTemplateId() {
        this.workingPaperNew.testingTemplateId = this.workingPaperNewTestingTemplateLookupTableModal.id;
        this.testingTemplateCode = this.workingPaperNewTestingTemplateLookupTableModal.displayName;
    }
    getNewOrganizationUnitId() {
        this.workingPaperNew.organizationUnitId = this.workingPaperNewOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.workingPaperNewOrganizationUnitLookupTableModal.displayName;
    }
    getNewCompletedUserId() {
        this.workingPaperNew.completedUserId = this.workingPaperNewUserLookupTableModal.id;
        this.userName = this.workingPaperNewUserLookupTableModal.displayName;
    }
    getNewReviewedUserId() {
        this.workingPaperNew.reviewedUserId = this.workingPaperNewUserLookupTableModal2.id;
        this.userName2 = this.workingPaperNewUserLookupTableModal2.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
