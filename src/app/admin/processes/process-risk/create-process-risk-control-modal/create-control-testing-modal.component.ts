import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentRiskControlsServiceProxy, CreateOrEditDepartmentRiskControlDto, CreateOrEditProcessRiskControlDto, ProcessRiskControlsServiceProxy, ProcessesServiceProxy, CreateOrEditProcessRiskDto, CreateOrEditProcessDto, RisksServiceProxy, CreateOrEditRiskDto, Severity, ProcessRiskDto, GetProcessRiskForViewDto, TestingTemplatesServiceProxy, NameValueDto, CreateOrEditControlTestingDto, ControlTestingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentRiskControlControlLookupTableModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/departmentRiskControl-control-lookup-table-modal.component';
import { CreateOrEditControlModalComponent } from '../../../../main/controls/controls/create-or-edit-control-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { LossEventUserLookupTableModalComponent } from '@app/main/lossEvents/lossEvent-user-lookup-table-modal.component';

@Component({
    selector: 'app-create-control-testing',
    templateUrl: './create-control-testing-modal.component.html'
})
export class CreateControlTestingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    //@ViewChild('departmentRiskControlDepartmentRiskLookupTableModal', { static: true }) departmentRiskControlDepartmentRiskLookupTableModal: DepartmentRiskControlDepartmentRiskLookupTableModalComponent;
    @ViewChild('departmentRiskControlControlLookupTableModal', { static: true }) departmentRiskControlControlLookupTableModal: DepartmentRiskControlControlLookupTableModalComponent;
    @ViewChild('createOrEditControlModal', { static: true }) createOrEditControlModal: CreateOrEditControlModalComponent;
    @ViewChild('lossEventUserLookupTableModal', { static: true }) lossEventUserLookupTableModal: LossEventUserLookupTableModalComponent;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    QuestionsDropdown: NameValueDto[] = new Array();
    showProcessCard = false;
    showRiskCard = false;

    departmentRiskControl: CreateOrEditProcessRiskControlDto = new CreateOrEditProcessRiskControlDto();

    departmentRiskCode = '';
    controlCode = '';
    riskEnum = Severity;

    departmentRisk: CreateOrEditProcessRiskDto = new CreateOrEditProcessRiskDto();
    controlTesting: CreateOrEditControlTestingDto = new CreateOrEditControlTestingDto;
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
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy,
        private _controlTestingsServiceProxy: ControlTestingsServiceProxy

    ) {
        super(injector);
        _testingTemplatesServiceProxy.getAllTestingTemplate().subscribe(result => {
            this.QuestionsDropdown = result;
        });
    }

    show(processRiskControlId?: number, processRiskId?: number, processId?: number, processRisk?: GetProcessRiskForViewDto, organizationUnit?: number): void {

        // this._processesServiceProxy.getProcessForEdit(processId).subscribe(result => {
        //     this.process = result.process;
        //     this.userName = result.userName;
        //     this.organizationUnitDisplayName = result.organizationUnitDisplayName;

        //     if (this.process.casade) {
        //         this.organizationUnitDisplayName = result.organizationUnitDisplayName + " and all its sub-departments.";
        //     }
        // });

        this.controlTesting = new CreateOrEditControlTestingDto();
        this.controlTesting.processRiskControlId = processRiskControlId;
        this.controlTesting.organizationUnitId = organizationUnit;
        this.active = true;
        this.modal.show();
    }

    save(): void {
            this.saving = true;
           this._controlTestingsServiceProxy.createOrEdit(this.controlTesting)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
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

    openSelectUserModal() {
        this.lossEventUserLookupTableModal.id = this.controlTesting.assignedUserId;
        this.lossEventUserLookupTableModal.displayName = this.controlTesting.name;
        this.lossEventUserLookupTableModal.show();
    }

    getNewEmployeeUserId() {
        this.controlTesting.assignedUserId = this.lossEventUserLookupTableModal.id;
        this.controlTesting.name = this.lossEventUserLookupTableModal.displayName;
    }
}
