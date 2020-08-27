import { ProcessRiskDto, ProcessRiskControlDto, TestingTemplatesServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetProcessRiskForViewDto, GetProcessRiskControlForViewDto, OrganizationUnitServiceProxy, ProcessRisksServiceProxy, ProcessRiskControlsServiceProxy, ProcessesServiceProxy, GetProcessForViewDto, OrganizationUnitDto, Frequency, ControlType } from '@shared/service-proxies/service-proxies';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { finalize } from 'rxjs/operators';
import { CreateOrEditProcessRiskModalComponent } from '../process-risk/create-process-risk-modal/create-or-edit-processRisk-modal.component';
import { CreateOrEditProcessRiskControlModalComponent } from '../process-risk/create-process-risk-control-modal/create-or-edit-processRiskControl-modal.component';
import { CreateOrEditTestingTemplateModalComponent } from '@app/main/testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-dept-process-risk-control',
  templateUrl: './dept-process-risk-control.component.html',
  styleUrls: ['./dept-process-risk-control.component.css']
})
export class DeptProcessRiskControlComponent extends AppComponentBase {

    @Output() riskScoreUpdated = new EventEmitter<any>();

    @ViewChild('createOrEditProcessRiskModal', { static: true }) createOrEditProcessRiskModal: CreateOrEditProcessRiskModalComponent;
    @ViewChild('createOrEditProcessRiskControlModal', { static: true }) createOrEditProcessRiskControlModal: CreateOrEditProcessRiskControlModalComponent;
    @ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    private _isViewOnly = false;
    deptProcesses: {process: OrganizationUnitDto, isActive: boolean}[] = new Array();
    deptRisks: {risk: GetProcessRiskForViewDto, isActive: boolean}[] = new Array();
    riskControls: {control: GetProcessRiskControlForViewDto, isActive: boolean}[] = new Array();

    //Controls
    loadingProcess = false;
    loadingRisk = false;
    loadingControls = false;

    frequencyEnum = Frequency;
    controlTypeEnum = ControlType;

    _appConsts = AppConsts;

    private _totalInherentRiskScore = 0;
    private _totalResidualRiskScore = 0;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _processService: ProcessesServiceProxy,
        private _processRiskService: ProcessRisksServiceProxy,
        private _processRiskControlService: ProcessRiskControlsServiceProxy,
        private _testingTemplateServiceProcess: TestingTemplatesServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        console.log(ou);
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        //this.createOrEditProcessRiskModal.organizationUnitId = ou.id;
        if (ou) {
            //this.refreshRisks();
            this.getDepartmentProcesses();
        }
        this._isViewOnly = false;
    }

    setOu(ou: IBasicOrganizationUnitInfo) {
        console.log(ou);
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        //this.createOrEditProcessRiskModal.organizationUnitId = ou.id;
        if (ou) {
            //this.refreshRisks();
            this.getDepartmentProcesses();
        }
        this._isViewOnly = false;
    }

    set isViewOnly(viewOnly: boolean) {
        this._isViewOnly = viewOnly;
    }

    getDepartmentProcesses() {
        this.loadingProcess = true;
        this._processService.getProcesses(this._organizationUnit.id)
            .pipe(finalize(() => this.loadingProcess = false ))
            .subscribe(result => {
                console.log(result);
            this.deptProcesses = Array.from(new Set(result. items.map((i) => {
                return {process: i, isActive: false};
            })));
        });
    }

    getOrganizationUnitRisksNew(processId: number) {
        this.loadingRisk = true;
        this._processRiskService.getRiskForProcess('', '', '', '', processId, '', 0, 1000)
            .pipe(finalize(() => this.loadingRisk = false ))
            .subscribe(result => {
                console.log(result);

                this.deptRisks = Array.from(new Set(result.items.map((i) => {
                    return {risk: i, isActive: false};
                })));
            });
    }

    getOrganizationUnitRiskControl(riskId, processId) {
        this.loadingControls = true;
        this._processRiskControlService.getAllForProcess('', -1, '', '', '', processId, '', 0, 1000)
            .pipe(finalize(() => this.loadingControls = false ))
            .subscribe(result => {
                //console.log(result);
                this.riskControls = Array.from(new Set(result.items.filter(x => x.processRiskControl.processRiskId == riskId).map((i) => {
                    return {control: i, isActive: false};
                })));
                    //result.items.filter(x => x.processRiskControl.processRiskId == riskId);
        });
    }

    toggleProcessAccordion(index) {
        let state = this.deptProcesses[index].isActive;
        this.deptProcesses = this.deptProcesses.map(x => { x.isActive = false; return x; } );
        this.deptProcesses[index].isActive = !state;
        this.getOrganizationUnitRisksNew(this.deptProcesses[index].process.id);
    }

    toggleRiskAccordion(index) {
        // let element = event.target;
        // element.classList.toggle('active');
        let state = this.deptRisks[index].isActive;
        this.deptRisks = this.deptRisks.map(x => { x.isActive = false; return x; } );
        this.deptRisks[index].isActive = !state;
        this.getOrganizationUnitRiskControl(this.deptRisks[index].risk.processRisk.id, this.deptRisks[index].risk.processRisk.processId);
    }

    toggleControlAccordion(index) {
        // let element = event.target;
        // element.classList.toggle('active');
        let state = this.riskControls[index].isActive;
        this.riskControls = this.riskControls.map(x => { x.isActive = false; return x; } );
        this.riskControls[index].isActive = !state;
        //this.getOrganizationUnitRiskControl(this.deptRisks[index].risk.processRisk.id, this.deptRisks[index].risk.processRisk.processId);
    }

    createTestingTemplate(id: number): void {
        this.createOrEditTestingTemplateModal.show(id);
    }

    reload(): void {
        this.getDepartmentProcesses();
    }

    addRiskToUnit(processId: number): void {
        this.createOrEditProcessRiskModal.show(null, processId);
    }

    editProcessRisk(processRiskId: number, processId: number): void {
        this.createOrEditProcessRiskModal.show(processRiskId, processId);
    }


    addControlToRisk(processRisk: GetProcessRiskForViewDto): void {
        this.createOrEditProcessRiskControlModal.show(null, processRisk.processRisk.id, processRisk.processRisk.processId, processRisk);
    }

    editProcessRiskControl(processRiskControl: ProcessRiskControlDto, risk: GetProcessRiskForViewDto): void {
        this.createOrEditProcessRiskControlModal.show(processRiskControl.id, processRiskControl.processRiskId, processRiskControl.processId, risk);
    }

    review(testingTemplateId: number): void {
        this._router.navigate(['app/main/workingPaperNews/new', testingTemplateId, this._organizationUnit.id]);
    }

    removeProcessRisk(processRiskId: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._processRiskService.delete(processRiskId)
                        .subscribe(() => {
                            this.reload();
                            this.notify.success(this.l('Risk Successfully Removed'));
                        });
                }
            }
        );
    }

    removeProcessRiskControl(processRiskControlId: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._processRiskControlService.delete(processRiskControlId)
                        .subscribe(() => {
                            this.reload();
                            this.notify.success(this.l('Control Successfully Removed'));
                        });
                }
            }
        );
    }

    removeControlTestingTemplate(testingTemplateId: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._testingTemplateServiceProcess.delete(testingTemplateId)
                        .subscribe(() => {
                            this.reload();
                            this.notify.success(this.l('Testing Template Successfully Removed'));
                        });
                }
            }
        );
    }

}
