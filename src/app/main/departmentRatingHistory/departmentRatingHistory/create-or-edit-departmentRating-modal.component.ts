import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRatingHistoryServiceProxy, CreateOrEditDepartmentRatingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRatingOrganizationUnitLookupTableModalComponent } from './departmentRating-organizationUnit-lookup-table-modal.component';
import { DepartmentRatingRatingLookupTableModalComponent } from './departmentRating-rating-lookup-table-modal.component';

@Component({
    selector: 'createOrEditDepartmentRatingModal',
    templateUrl: './create-or-edit-departmentRating-modal.component.html'
})
export class CreateOrEditDepartmentRatingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('departmentRatingOrganizationUnitLookupTableModal', { static: true }) departmentRatingOrganizationUnitLookupTableModal: DepartmentRatingOrganizationUnitLookupTableModalComponent;
    @ViewChild('departmentRatingRatingLookupTableModal', { static: true }) departmentRatingRatingLookupTableModal: DepartmentRatingRatingLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    overrideRating = false;

    departmentRating: CreateOrEditDepartmentRatingDto = new CreateOrEditDepartmentRatingDto();

    organizationUnitDisplayName = '';
    ratingName = '';


    constructor(
        injector: Injector,
        private _departmentRatingHistoryServiceProxy: DepartmentRatingHistoryServiceProxy
    ) {
        super(injector);
    }

    show(departmentRatingId?: number): void {
        this.overrideRating = false;
        if (!departmentRatingId) {
            this.departmentRating = new CreateOrEditDepartmentRatingDto();
            this.departmentRating.id = departmentRatingId;
            this.departmentRating.ratingDate = moment().startOf('day');
            this.organizationUnitDisplayName = '';
            this.ratingName = '';

            this.active = true;
            this.modal.show();
        } else {
            this._departmentRatingHistoryServiceProxy.getDepartmentRatingForEdit(departmentRatingId).subscribe(result => {
                this.departmentRating = result.departmentRating;

                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.ratingName = result.ratingName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    overrideDepartmentRating(departmentId: number, departmentName: string): void {
        this.departmentRating = new CreateOrEditDepartmentRatingDto();
            this.departmentRating.id = null;
            this.departmentRating.ratingDate = moment().startOf('day');
            this.departmentRating.organizationUnitId = departmentId;
            this.organizationUnitDisplayName = departmentName;
            this.departmentRating.changeType = 'Manual';
            this.ratingName = '';

            this.overrideRating = true;
            this.active = true;
            this.modal.show();
    }

    save(): void {
            this.saving = true;

            this._departmentRatingHistoryServiceProxy.createOrEdit(this.departmentRating)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectOrganizationUnitModal() {
        this.departmentRatingOrganizationUnitLookupTableModal.id = this.departmentRating.organizationUnitId;
        this.departmentRatingOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.departmentRatingOrganizationUnitLookupTableModal.show();
    }
    openSelectRatingModal() {
        this.departmentRatingRatingLookupTableModal.id = this.departmentRating.ratingId;
        this.departmentRatingRatingLookupTableModal.displayName = this.ratingName;
        this.departmentRatingRatingLookupTableModal.show();
    }


    setOrganizationUnitIdNull() {
        this.departmentRating.organizationUnitId = null;
        this.organizationUnitDisplayName = '';
    }
    setRatingIdNull() {
        this.departmentRating.ratingId = null;
        this.ratingName = '';
    }


    getNewOrganizationUnitId() {
        this.departmentRating.organizationUnitId = this.departmentRatingOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.departmentRatingOrganizationUnitLookupTableModal.displayName;
    }
    getNewRatingId() {
        this.departmentRating.ratingId = this.departmentRatingRatingLookupTableModal.id;
        this.ratingName = this.departmentRatingRatingLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
