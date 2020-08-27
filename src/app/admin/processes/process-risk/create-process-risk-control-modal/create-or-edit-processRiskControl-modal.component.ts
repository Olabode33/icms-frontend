import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRiskControlsServiceProxy, CreateOrEditDepartmentRiskControlDto, CreateOrEditProcessRiskControlDto, ProcessRiskControlsServiceProxy, ProcessesServiceProxy, CreateOrEditProcessRiskDto, CreateOrEditProcessDto, RisksServiceProxy, CreateOrEditRiskDto, Severity, ProcessRiskDto, GetProcessRiskForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRiskControlControlLookupTableModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/departmentRiskControl-control-lookup-table-modal.component';
import { CreateOrEditControlModalComponent } from '../../../../main/controls/controls/create-or-edit-control-modal.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'app-create-or-edit-process-risk-control',
    templateUrl: './create-or-edit-processRiskControl-modal.component.html'
})
export class CreateOrEditProcessRiskControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    //@ViewChild('departmentRiskControlDepartmentRiskLookupTableModal', { static: true }) departmentRiskControlDepartmentRiskLookupTableModal: DepartmentRiskControlDepartmentRiskLookupTableModalComponent;
    @ViewChild('departmentRiskControlControlLookupTableModal', { static: true }) departmentRiskControlControlLookupTableModal: DepartmentRiskControlControlLookupTableModalComponent;
    @ViewChild('createOrEditControlModal', { static: true }) createOrEditControlModal: CreateOrEditControlModalComponent;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    showProcessCard = false;
    showRiskCard = false;

    departmentRiskControl: CreateOrEditProcessRiskControlDto = new CreateOrEditProcessRiskControlDto();

    departmentRiskCode = '';
    controlCode = '';
    riskEnum = Severity;

    departmentRisk: CreateOrEditProcessRiskDto = new CreateOrEditProcessRiskDto();
    process: CreateOrEditProcessDto = new CreateOrEditProcessDto;
    risk: CreateOrEditRiskDto = new CreateOrEditRiskDto;

    departmentRiskId: number;
    userName: string;
    organizationUnitDisplayName: string;

    _appConsts = AppConsts;

    constructor(
        injector: Injector,
        private _departmentRiskControlsServiceProxy: ProcessRiskControlsServiceProxy,
        private _processesServiceProxy: ProcessesServiceProxy,
        private _risksServiceProxy: RisksServiceProxy,

    ) {
        super(injector);
    }

    show(processRiskControlId?: number, processRiskId?: number, processId?: number, processRisk?: GetProcessRiskForViewDto): void {

        this._processesServiceProxy.getProcessForEdit(processId).subscribe(result => {
            this.process = result.process;
            this.userName = result.userName;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

            if (this.process.casade) {
                this.organizationUnitDisplayName = result.organizationUnitDisplayName + " and all its sub-departments.";
            }
        });


        this.risk = new CreateOrEditRiskDto();
        this.risk.name = processRisk.riskName;
        this.risk.impact = processRisk.processRisk.impact;
        this.risk.likelyhood = processRisk.processRisk.likelyhood;


        if (!processRiskControlId) {
            this.departmentRiskControl = new CreateOrEditProcessRiskControlDto();
            this.departmentRiskControl.id = processRiskControlId;
            this.departmentRiskCode = '';
            this.departmentRiskControl.processRiskId = processRiskId;
            this.controlCode = '';
            this.departmentRiskControl.processId = processId;
            console.log(this.departmentRiskControl);
            this.active = true;
            this.modal.show();
        } else {
            this._departmentRiskControlsServiceProxy.getProcessRiskControlForEdit(processRiskControlId).subscribe(result => {
                this.departmentRiskControl = result.processRiskControl;

                this.departmentRiskCode = result.processRiskCode;
                this.controlCode = result.controlName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            this._departmentRiskControlsServiceProxy.createOrEdit(this.departmentRiskControl)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    // openSelectDepartmentRiskModal() {
    //     this.departmentRiskControlDepartmentRiskLookupTableModal.id = this.departmentRiskControl.departmentRiskId;
    //     this.departmentRiskControlDepartmentRiskLookupTableModal.displayName = this.departmentRiskCode;
    //     this.departmentRiskControlDepartmentRiskLookupTableModal.show();
    // }
    openSelectControlModal() {
        this.departmentRiskControlControlLookupTableModal.id = this.departmentRiskControl.controlId;
        this.departmentRiskControlControlLookupTableModal.displayName = this.controlCode;
        this.departmentRiskControlControlLookupTableModal.show();
    }


    createControl(): void {
        this.createOrEditControlModal.show();
    }

    // setDepartmentRiskIdNull() {
    //     this.departmentRiskControl.departmentRiskId = null;
    //     this.departmentRiskCode = '';
    // }
    setControlIdNull() {
        this.departmentRiskControl.controlId = null;
        this.controlCode = '';
    }


    // getNewDepartmentRiskId() {
    //     this.departmentRiskControl.departmentRiskId = this.departmentRiskControlDepartmentRiskLookupTableModal.id;
    //     this.departmentRiskCode = this.departmentRiskControlDepartmentRiskLookupTableModal.displayName;
    // }
    getNewControlId() {
        this.departmentRiskControl.controlId = this.departmentRiskControlControlLookupTableModal.id;
        this.controlCode = this.departmentRiskControlControlLookupTableModal.displayName;
        this.departmentRiskControl.likelyhood = 0;
        this.departmentRiskControl.impact = 0;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
