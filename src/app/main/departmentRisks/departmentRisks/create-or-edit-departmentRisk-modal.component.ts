import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRisksServiceProxy, CreateOrEditDepartmentRiskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRiskRiskLookupTableModalComponent } from './departmentRisk-risk-lookup-table-modal.component';

@Component({
    selector: 'createOrEditDepartmentRiskModal',
    templateUrl: './create-or-edit-departmentRisk-modal.component.html'
})
export class CreateOrEditDepartmentRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
 @ViewChild('departmentRiskRiskLookupTableModal', { static: true }) departmentRiskRiskLookupTableModal: DepartmentRiskRiskLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    departmentRisk: CreateOrEditDepartmentRiskDto = new CreateOrEditDepartmentRiskDto();

    departmentName = '';
    riskName = '';
    organizationUnitId: number;


    constructor(
        injector: Injector,
        private _departmentRisksServiceProxy: DepartmentRisksServiceProxy
    ) {
        super(injector);
    }

    show(departmentRiskId?: number, departmentId?:  number): void {

        if (!departmentRiskId) {
            this.departmentRisk = new CreateOrEditDepartmentRiskDto();
            this.departmentRisk.id = departmentRiskId;
            this.departmentName = '';
            this.riskName = '';
            this.departmentRisk.departmentId = departmentId;

            this.active = true;
            this.modal.show();
        } else {
            this._departmentRisksServiceProxy.getDepartmentRiskForEdit(departmentRiskId).subscribe(result => {
                this.departmentRisk = result.departmentRisk;
                this.departmentRisk.departmentId = departmentId;
                this.departmentName = result.departmentName;
                this.riskName = result.riskName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._departmentRisksServiceProxy.createOrEdit(this.departmentRisk)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }


    openSelectRiskModal() {
        this.departmentRiskRiskLookupTableModal.id = this.departmentRisk.riskId;
        this.departmentRiskRiskLookupTableModal.displayName = this.riskName;
        this.departmentRiskRiskLookupTableModal.show();
    }



    setRiskIdNull() {
        this.departmentRisk.riskId = null;
        this.riskName = '';
    }



    getNewRiskId() {
        this.departmentRisk.riskId = this.departmentRiskRiskLookupTableModal.id;
        this.riskName = this.departmentRiskRiskLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
