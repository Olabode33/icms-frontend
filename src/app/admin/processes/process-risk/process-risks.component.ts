import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto, DepartmentRisksServiceProxy, GetDepartmentRiskForViewDto, DepartmentRiskControlsServiceProxy, GetDepartmentRiskControlForViewDto, ProcessRisksServiceProxy, ProcessRiskControlsServiceProxy, GetProcessRiskForViewDto, GetProcessRiskControlForViewDto, Frequency, ControlType, TestingTemplatesServiceProxy, ProcessRiskControlDto, ProcessRiskDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditDepartmentRiskModalComponent } from '@app/main/departmentRisks/departmentRisks/create-or-edit-departmentRisk-modal.component';
import { CreateOrEditDepartmentRiskControlModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/create-or-edit-departmentRiskControl-modal.component';
//import { OrganizationUnitControlsComponent } from './organization-unit-controls.component';
import { CreateOrEditTestingTemplateModalComponent } from '@app/main/testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { CreateOrEditProcessRiskModalComponent } from './create-process-risk-modal/create-or-edit-processRisk-modal.component';
import { CreateOrEditProcessRiskControlModalComponent } from './create-process-risk-control-modal/create-or-edit-processRiskControl-modal.component';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';


@Component({
    selector: 'app-process-risks',
    templateUrl: './process-risks.component.html'
})
export class ProcessRisksComponent extends AppComponentBase implements OnInit {

    @Output() riskRemoved = new EventEmitter<any>();
    @Output() risksAdded = new EventEmitter<any>();
    @Output() riskScoreUpdated = new EventEmitter<any>();

    @ViewChild('addMemberModal', {static: true}) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;
    @ViewChild('createOrEditProcessRiskModal', { static: true }) createOrEditProcessRiskModal: CreateOrEditProcessRiskModalComponent;
    @ViewChild('createOrEditProcessRiskControlModal', { static: true }) createOrEditProcessRiskControlModal: CreateOrEditProcessRiskControlModalComponent;
    //@ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;


    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    private _isViewOnly = false;
    deptRisks: {risk: GetProcessRiskForViewDto, isActive: boolean}[] = new Array();
    riskControls: {control: GetProcessRiskControlForViewDto, isActive: boolean}[] = new Array();

    loadingRisk = false;
    loadingControls = false;
    frequencyEnum = Frequency;
    controlTypeEnum = ControlType;

    _appConsts = AppConsts;

    private _totalInherentRiskScore = 0;
    private _totalResidualRiskScore = 0;
    private _totalRiskCount = 0;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private  _departmentRiskService: ProcessRisksServiceProxy,
        private _departmentRiskControlService: ProcessRiskControlsServiceProxy,
        private _testingTemplateServiceProcess: TestingTemplatesServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        //console.log(ou);
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        this.createOrEditProcessRiskModal.organizationUnitId = ou.id;
        if (ou) {
            //this.refreshRisks();
            this.getOrganizationUnitRisksNew();
        }
        this._isViewOnly = false;
    }

    set isViewOnly(viewOnly: boolean) {
        this._isViewOnly = viewOnly;
    }

    getInherentRiskScore(): number {
        return this._totalInherentRiskScore;
    }

    getResidualRiskScore(): number {
        return this._totalResidualRiskScore;
    }

    ngOnInit(): void {

    }

    getOrganizationUnitRisksNew() {
        this.loadingRisk = true;
        this._departmentRiskService.getRiskForProcess('', '', '', '', this._organizationUnit.id, '', 0, 1000
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            //console.log(result);
            this.deptRisks = Array.from(new Set(result.items.map((i) => {
                return {risk: i, isActive: false};
            })));
            this._totalInherentRiskScore = result.items.reduce((a, b) => a + b.inherentRiskScore, 0);
            this._totalResidualRiskScore = result.items.reduce((a, b) => a + b.residualRiskScore, 0);
            this._totalRiskCount = result.items.length;
            this.riskScoreUpdated.emit({inherentRiskScore: this._totalInherentRiskScore, residualRiskScore: this._totalResidualRiskScore, riskCount: this._totalRiskCount});
            this.loadingRisk = false;
        });
    }

    // getOrganizationUnitRisks(event?: LazyLoadEvent) {
    //     if (!this._organizationUnit) {
    //         return;
    //     }

    //     if (this.primengTableHelper.shouldResetPaging(event)) {
    //         this.paginator.changePage(0);

    //         return;
    //     }

    //     this.primengTableHelper.showLoadingIndicator();
    //     this._departmentRiskService.getRiskForProcess('', '', '', '', this._organizationUnit.id,
    //         this.primengTableHelper.getSorting(this.dataTable),
    //         this.primengTableHelper.getSkipCount(this.paginator, event),
    //         this.primengTableHelper.getMaxResultCount(this.paginator, event)
    //     ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
    //         this.primengTableHelper.totalRecordsCount = result.totalCount;
    //         this.deptRisks = Array.from(new Set(result.items.map((i) => {
    //             return {risk: i, isActive: false};
    //         })));
    //         this.primengTableHelper.records = result.items;
    //         this.primengTableHelper.hideLoadingIndicator();
    //     });
    // }

    reloadPage(): void {
        this.getOrganizationUnitRisksNew();
    }

    refreshRisks(): void {
        this.getOrganizationUnitRisksNew();
    }

    addRiskToUnit(): void {
        this.createOrEditProcessRiskModal.show(null, this._organizationUnit.id);
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


    removeMember(user: OrganizationUnitUserListDto): void {
        this.message.confirm(
            this.l('RemoveUserFromOuWarningMessage', user.userName, this.organizationUnit.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService
                        .removeUserFromOrganizationUnit(user.id, this.organizationUnit.id)
                        .subscribe(() => {
                            this.message.success(this.l('SuccessfullyRemoved'));
                            this.riskRemoved.emit({
                                userId: user.id,
                                ouId: this.organizationUnit.id
                            });

                            this.refreshRisks();
                        });
                }
            }
        );
    }

    addRisks(data: any): void {
        this.risksAdded.emit({
            userIds: data.userIds,
            ouId: data.ouId
        });

        this.refreshRisks();
    }

    toggleAccordion(index) {
        // let element = event.target;
        // element.classList.toggle('active');
        let state = this.deptRisks[index].isActive;
        this.deptRisks = this.deptRisks.map(x => { x.isActive = false; return x; } );
        this.deptRisks[index].isActive = !state;
        this.getOrganizationUnitRiskControl(this.deptRisks[index].risk.processRisk.id);
    }

    toggleControlAccordion(index) {
        // let element = event.target;
        // element.classList.toggle('active');
        let state = this.riskControls[index].isActive;
        this.riskControls = this.riskControls.map(x => { x.isActive = false; return x; } );
        this.riskControls[index].isActive = !state;
        //this.getOrganizationUnitRiskControl(this.deptRisks[index].risk.processRisk.id, this.deptRisks[index].risk.processRisk.processId);
    }

    //Risk Control Codes ......
    createTestingTemplate(id: number): void {
        this._router.navigate(['/app/main/testingTemplates/createOrEdit'], { queryParams: { id: id } });
        //this.createOrEditTestingTemplateModal.show(id);
    }

    getOrganizationUnitRiskControl(riskId) {
        this.loadingControls = true;
        this._departmentRiskControlService.getAllForProcess('', -1, '', '', '', this._organizationUnit.id, '', 0, 1000
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            //this.primengTableHelper.totalRecordsCount = result.totalCount;
            //this.riskControls = result.items.filter(x => x.processRiskControl.processRiskId == riskId);
            this.riskControls = Array.from(new Set(result.items.filter(x => x.processRiskControl.processRiskId == riskId).map((i) => {
                return {control: i, isActive: false};
            })));
            this.loadingControls = false;
        });
    }

    deleteRisk(riskId: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._departmentRiskService.delete(riskId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    deleteRiskControl(riskControlId: number): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._departmentRiskControlService.delete(riskControlId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
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
                    this._departmentRiskService.delete(processRiskId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('Risk Successfully Removed'));
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
                    this._departmentRiskControlService.delete(processRiskControlId)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('Control Successfully Removed'));
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
                            this.reloadPage();
                            this.message.success(this.l('Testing Template Successfully Removed'));
                        });
                }
            }
        );
    }

}
