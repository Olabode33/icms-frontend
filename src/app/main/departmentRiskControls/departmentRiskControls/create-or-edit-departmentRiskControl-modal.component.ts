import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRiskControlsServiceProxy, CreateOrEditDepartmentRiskControlDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRiskControlDepartmentRiskLookupTableModalComponent } from './departmentRiskControl-departmentRisk-lookup-table-modal.component';
import { DepartmentRiskControlControlLookupTableModalComponent } from './departmentRiskControl-control-lookup-table-modal.component';

@Component({
    selector: 'createOrEditDepartmentRiskControlModal',
    templateUrl: './create-or-edit-departmentRiskControl-modal.component.html'
})
export class CreateOrEditDepartmentRiskControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('departmentRiskControlDepartmentRiskLookupTableModal', { static: true }) departmentRiskControlDepartmentRiskLookupTableModal: DepartmentRiskControlDepartmentRiskLookupTableModalComponent;
    @ViewChild('departmentRiskControlControlLookupTableModal', { static: true }) departmentRiskControlControlLookupTableModal: DepartmentRiskControlControlLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    departmentRiskControl: CreateOrEditDepartmentRiskControlDto = new CreateOrEditDepartmentRiskControlDto();

    departmentRiskCode = '';
    controlCode = '';

    departmentRiskId: number;
    constructor(
        injector: Injector,
        private _departmentRiskControlsServiceProxy: DepartmentRiskControlsServiceProxy
    ) {
        super(injector);
    }

    show(departmentRiskControlId?: number, deparmentRiskId?: number, departmentId?: number): void {

        if (!departmentRiskControlId) {
            this.departmentRiskControl = new CreateOrEditDepartmentRiskControlDto();
            this.departmentRiskControl.id = departmentRiskControlId;
            this.departmentRiskCode = '';
            this.departmentRiskControl.departmentRiskId = deparmentRiskId;
            this.controlCode = '';
            this.departmentRiskControl.departmentId = departmentId;
            console.log(this.departmentRiskControl);
            this.active = true;
            this.modal.show();
        } else {
            this._departmentRiskControlsServiceProxy.getDepartmentRiskControlForEdit(departmentRiskControlId).subscribe(result => {
                this.departmentRiskControl = result.departmentRiskControl;

                this.departmentRiskCode = result.departmentRiskCode;
                this.controlCode = result.controlCode;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._departmentRiskControlsServiceProxy.createOrEdit(this.departmentRiskControl)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    openSelectDepartmentRiskModal() {
        this.departmentRiskControlDepartmentRiskLookupTableModal.id = this.departmentRiskControl.departmentRiskId;
        this.departmentRiskControlDepartmentRiskLookupTableModal.displayName = this.departmentRiskCode;
        this.departmentRiskControlDepartmentRiskLookupTableModal.show();
    }
    openSelectControlModal() {
        this.departmentRiskControlControlLookupTableModal.id = this.departmentRiskControl.controlId;
        this.departmentRiskControlControlLookupTableModal.displayName = this.controlCode;
        this.departmentRiskControlControlLookupTableModal.show();
    }


    setDepartmentRiskIdNull() {
        this.departmentRiskControl.departmentRiskId = null;
        this.departmentRiskCode = '';
    }
    setControlIdNull() {
        this.departmentRiskControl.controlId = null;
        this.controlCode = '';
    }


    getNewDepartmentRiskId() {
        this.departmentRiskControl.departmentRiskId = this.departmentRiskControlDepartmentRiskLookupTableModal.id;
        this.departmentRiskCode = this.departmentRiskControlDepartmentRiskLookupTableModal.displayName;
    }
    getNewControlId() {
        this.departmentRiskControl.controlId = this.departmentRiskControlControlLookupTableModal.id;
        this.controlCode = this.departmentRiskControlControlLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
