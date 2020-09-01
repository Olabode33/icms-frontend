import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WorkingPaperReviewCommentsServiceProxy, CreateOrEditWorkingPaperReviewCommentDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { WorkingPaperReviewCommentUserLookupTableModalComponent } from './workingPaperReviewComment-user-lookup-table-modal.component';
import { WorkingPaperReviewCommentWorkingPaperLookupTableModalComponent } from './workingPaperReviewComment-workingPaper-lookup-table-modal.component';

@Component({
    selector: 'createOrEditWorkingPaperReviewCommentModal',
    templateUrl: './create-or-edit-workingPaperReviewComment-modal.component.html'
})
export class CreateOrEditWorkingPaperReviewCommentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('workingPaperReviewCommentUserLookupTableModal', { static: true }) workingPaperReviewCommentUserLookupTableModal: WorkingPaperReviewCommentUserLookupTableModalComponent;
    @ViewChild('workingPaperReviewCommentWorkingPaperLookupTableModal', { static: true }) workingPaperReviewCommentWorkingPaperLookupTableModal: WorkingPaperReviewCommentWorkingPaperLookupTableModalComponent;
    @ViewChild('workingPaperReviewCommentUserLookupTableModal2', { static: true }) workingPaperReviewCommentUserLookupTableModal2: WorkingPaperReviewCommentUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    workingPaperReviewComment: CreateOrEditWorkingPaperReviewCommentDto = new CreateOrEditWorkingPaperReviewCommentDto();

    userName = '';
    workingPaperCode = '';
    userName2 = '';


    constructor(
        injector: Injector,
        private _workingPaperReviewCommentsServiceProxy: WorkingPaperReviewCommentsServiceProxy
    ) {
        super(injector);
    }

    show(workingPaperReviewCommentId?: number, workingPaperId?: string, assigneeId?: number): void {

        if (!workingPaperReviewCommentId) {
            this.workingPaperReviewComment = new CreateOrEditWorkingPaperReviewCommentDto();
            this.workingPaperReviewComment.id = workingPaperReviewCommentId;
            this.workingPaperReviewComment.expectedCompletionDate = moment().startOf('day');
            this.userName = '';
            this.workingPaperCode = '';
            this.userName2 = '';

          
                this.workingPaperReviewComment.workingPaperId = workingPaperId;
                this.workingPaperReviewComment.assigneeUserId = assigneeId;


            this.active = true;
            this.modal.show();
        } else {
            this._workingPaperReviewCommentsServiceProxy.getWorkingPaperReviewCommentForEdit(workingPaperReviewCommentId).subscribe(result => {
                this.workingPaperReviewComment = result.workingPaperReviewComment;

                this.userName = result.userName;
                this.workingPaperCode = result.workingPaperCode;
                this.userName2 = result.userName2;

                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._workingPaperReviewCommentsServiceProxy.createOrEdit(this.workingPaperReviewComment)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectUserModal() {
        this.workingPaperReviewCommentUserLookupTableModal.id = this.workingPaperReviewComment.assigneeUserId;
        this.workingPaperReviewCommentUserLookupTableModal.displayName = this.userName;
        this.workingPaperReviewCommentUserLookupTableModal.show();
    }
    openSelectWorkingPaperModal() {
        this.workingPaperReviewCommentWorkingPaperLookupTableModal.id = this.workingPaperReviewComment.workingPaperId;
        this.workingPaperReviewCommentWorkingPaperLookupTableModal.displayName = this.workingPaperCode;
        this.workingPaperReviewCommentWorkingPaperLookupTableModal.show();
    }
    openSelectUserModal2() {
        this.workingPaperReviewCommentUserLookupTableModal2.id = this.workingPaperReviewComment.assignerUserId;
        this.workingPaperReviewCommentUserLookupTableModal2.displayName = this.userName;
        this.workingPaperReviewCommentUserLookupTableModal2.show();
    }


    setAssigneeUserIdNull() {
        this.workingPaperReviewComment.assigneeUserId = null;
        this.userName = '';
    }
    setWorkingPaperIdNull() {
        this.workingPaperReviewComment.workingPaperId = null;
        this.workingPaperCode = '';
    }
    setAssignerUserIdNull() {
        this.workingPaperReviewComment.assignerUserId = null;
        this.userName2 = '';
    }


    getNewAssigneeUserId() {
        this.workingPaperReviewComment.assigneeUserId = this.workingPaperReviewCommentUserLookupTableModal.id;
        this.userName = this.workingPaperReviewCommentUserLookupTableModal.displayName;
    }
    getNewWorkingPaperId() {
        this.workingPaperReviewComment.workingPaperId = this.workingPaperReviewCommentWorkingPaperLookupTableModal.id;
        this.workingPaperCode = this.workingPaperReviewCommentWorkingPaperLookupTableModal.displayName;
    }
    getNewAssignerUserId() {
        this.workingPaperReviewComment.assignerUserId = this.workingPaperReviewCommentUserLookupTableModal2.id;
        this.userName2 = this.workingPaperReviewCommentUserLookupTableModal2.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
