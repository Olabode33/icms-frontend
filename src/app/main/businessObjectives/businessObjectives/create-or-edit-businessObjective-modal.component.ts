import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { BusinessObjectivesServiceProxy, CreateOrEditBusinessObjectiveDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { BusinessObjectiveUserLookupTableModalComponent } from './businessObjective-user-lookup-table-modal.component';

@Component({
    selector: 'createOrEditBusinessObjectiveModal',
    templateUrl: './create-or-edit-businessObjective-modal.component.html'
})
export class CreateOrEditBusinessObjectiveModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('businessObjectiveUserLookupTableModal', { static: true }) businessObjectiveUserLookupTableModal: BusinessObjectiveUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    businessObjective: CreateOrEditBusinessObjectiveDto = new CreateOrEditBusinessObjectiveDto();

    userName = '';


    constructor(
        injector: Injector,
        private _businessObjectivesServiceProxy: BusinessObjectivesServiceProxy
    ) {
        super(injector);
    }

    show(businessObjectiveId?: number): void {

        if (!businessObjectiveId) {
            this.businessObjective = new CreateOrEditBusinessObjectiveDto();
            this.businessObjective.id = businessObjectiveId;
            this.businessObjective.startDate = moment().startOf('day');
            this.businessObjective.endDate = moment().startOf('day');
            this.userName = '';

            this.active = true;
            this.modal.show();
        } else {
            this._businessObjectivesServiceProxy.getBusinessObjectiveForEdit(businessObjectiveId).subscribe(result => {
                this.businessObjective = result.businessObjective;

                this.userName = result.userName;

                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._businessObjectivesServiceProxy.createOrEdit(this.businessObjective)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.message.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectUserModal() {
        this.businessObjectiveUserLookupTableModal.id = this.businessObjective.userId;
        this.businessObjectiveUserLookupTableModal.displayName = this.userName;
        this.businessObjectiveUserLookupTableModal.show();
    }


    setUserIdNull() {
        this.businessObjective.userId = null;
        this.userName = '';
    }


    getNewUserId() {
        this.businessObjective.userId = this.businessObjectiveUserLookupTableModal.id;
        this.userName = this.businessObjectiveUserLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
