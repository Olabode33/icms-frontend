import { Router } from '@angular/router';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetProcessRiskForViewDto, GetProcessRiskControlForViewDto, OrganizationUnitServiceProxy, ProcessRisksServiceProxy, ProcessRiskControlsServiceProxy, ProcessesServiceProxy, GetProcessForViewDto, OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { finalize } from 'rxjs/operators';
import { CreateOrEditProcessRiskModalComponent } from '../process-risk/create-process-risk-modal/create-or-edit-processRisk-modal.component';
import { CreateOrEditProcessRiskControlModalComponent } from '../process-risk/create-process-risk-control-modal/create-or-edit-processRiskControl-modal.component';
import { CreateOrEditTestingTemplateModalComponent } from '@app/main/testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';

@Component({
  selector: 'app-dept-process-risk-control',
  templateUrl: './dept-process-risk-control.component.html',
  styleUrls: ['./dept-process-risk-control.component.css']
})
export class DeptProcessRiskControlComponent extends AppComponentBase {

    @ViewChild('createOrEditProcessRiskModal', { static: true }) createOrEditProcessRiskModal: CreateOrEditProcessRiskModalComponent;
    @ViewChild('createOrEditProcessRiskControlModal', { static: true }) createOrEditProcessRiskControlModal: CreateOrEditProcessRiskControlModalComponent;
    @ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    private _isViewOnly = false;
    deptProcesses: {process: OrganizationUnitDto, isActive: boolean}[] = new Array();
    deptRisks: {risk: GetProcessRiskForViewDto, isActive: boolean}[] = new Array();

    //Controls
    loadingProcess = false;
    loadingRisk = false;
    loadingControls = false;
    riskControls: GetProcessRiskControlForViewDto[] = new Array();

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _processService: ProcessesServiceProxy,
        private _processRiskService: ProcessRisksServiceProxy,
        private _processRiskControlService: ProcessRiskControlsServiceProxy,
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
                console.log(result);
                this.riskControls = result.items.filter(x => x.processRiskControl.processRiskId == riskId);
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

    createTestingTemplate(id: number): void {
        this.createOrEditTestingTemplateModal.show(id);
    }

    reload(): void {
        this.getDepartmentProcesses();
    }

    addRiskToUnit(): void {
        this.createOrEditProcessRiskModal.show(null, this._organizationUnit.id);
    }


    addControlToRisk(riskId: number, riskDepartmentId?: number): void {

        this.createOrEditProcessRiskControlModal.show(null, riskId, this._organizationUnit.id);
    }

    review(testingTemplateId: number): void {
        this._router.navigate(['app/main/workingPaperNews', testingTemplateId, this._organizationUnit.id]);
    }

}
