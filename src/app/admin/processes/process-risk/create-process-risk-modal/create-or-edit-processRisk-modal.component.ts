import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRisksServiceProxy, CreateOrEditDepartmentRiskDto, CreateOrEditProcessRiskDto, ProcessRisksServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRiskRiskLookupTableModalComponent } from '@app/main/departmentRisks/departmentRisks/departmentRisk-risk-lookup-table-modal.component';

@Component({
    selector: 'app-create-or-edit-process-risk',
    templateUrl: './create-or-edit-processRisk-modal.component.html'
})
export class CreateOrEditProcessRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('departmentRiskRiskLookupTableModal', { static: true }) departmentRiskRiskLookupTableModal: DepartmentRiskRiskLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    departmentRisk: CreateOrEditProcessRiskDto = new CreateOrEditProcessRiskDto();

    departmentName = '';
    riskName = '';
    organizationUnitId: number;


    constructor(
        injector: Injector,
        private _departmentRisksServiceProxy: ProcessRisksServiceProxy
    ) {
        super(injector);
    }

    show(processRiskId?: number, processId?:  number): void {

        if (!processRiskId) {
            this.departmentRisk = new CreateOrEditProcessRiskDto();
            this.departmentRisk.id = processRiskId;
            this.departmentName = '';
            this.riskName = '';
            this.departmentRisk.processId = processId;

            this.active = true;
            this.modal.show();
        } else {
            this._departmentRisksServiceProxy.getProcessRiskForEdit(processRiskId).subscribe(result => {
                this.departmentRisk = result.processRisk;
                this.departmentRisk.processId = processId;
                this.departmentName = result.organizationUnitDisplayName;
                this.riskName = result.riskName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

            this._departmentRisksServiceProxy.createOrEdit(this.departmentRisk)
             .pipe(finalize(() => { this.saving = false; }))
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
