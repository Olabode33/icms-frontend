import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto, DepartmentRisksServiceProxy, GetDepartmentRiskForViewDto, DepartmentRiskControlsServiceProxy, GetDepartmentRiskControlForViewDto, ProcessRisksServiceProxy, ProcessRiskControlsServiceProxy, GetProcessRiskForViewDto, GetProcessRiskControlForViewDto } from '@shared/service-proxies/service-proxies';
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


@Component({
    selector: 'app-process-risks',
    templateUrl: './process-risks.component.html'
})
export class ProcessRisksComponent extends AppComponentBase implements OnInit {

    @Output() riskRemoved = new EventEmitter<any>();
    @Output() risksAdded = new EventEmitter<any>();

    @ViewChild('addMemberModal', {static: true}) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;
    @ViewChild('createOrEditProcessRiskModal', { static: true }) createOrEditProcessRiskModal: CreateOrEditProcessRiskModalComponent;
    @ViewChild('createOrEditProcessRiskControlModal', { static: true }) createOrEditProcessRiskControlModal: CreateOrEditProcessRiskControlModalComponent;
    @ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;


    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    private _isViewOnly = false;
    deptRisks: {risk: GetProcessRiskForViewDto, isActive: boolean}[] = new Array();
    riskControls: GetProcessRiskControlForViewDto[] = new Array();

    loadingRisk = false;
    loadingControls = false;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private  _departmentRiskService: ProcessRisksServiceProxy,
        private _departmentRiskControlService: ProcessRiskControlsServiceProxy
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


    addControlToRisk(riskId: number, riskDepartmentId?: number): void {

        this.createOrEditProcessRiskControlModal.show(null, riskId, this._organizationUnit.id);
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
                            this.notify.success(this.l('SuccessfullyRemoved'));
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

    //Risk Control Codes ......
    createTestingTemplate(id: number): void {
        this.createOrEditTestingTemplateModal.show(id);
    }

    getOrganizationUnitRiskControl(riskId) {
        this.loadingControls = true;
        this._departmentRiskControlService.getAllForProcess('', -1, '', '', '', this._organizationUnit.id, '', 0, 1000
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            //this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.riskControls = result.items.filter(x => x.processRiskControl.processRiskId == riskId);
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
                            this.notify.success(this.l('SuccessfullyDeleted'));
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
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

}
