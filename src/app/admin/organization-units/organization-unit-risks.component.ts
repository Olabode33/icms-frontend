import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto, DepartmentRisksServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { finalize } from 'rxjs/operators';
import { CreateOrEditDepartmentRiskModalComponent } from '@app/main/departmentRisks/departmentRisks/create-or-edit-departmentRisk-modal.component';
import { CreateOrEditDepartmentRiskControlModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/create-or-edit-departmentRiskControl-modal.component';


@Component({
    selector: 'organization-unit-risks',
    templateUrl: './organization-unit-risks.component.html'
})
export class OrganizationUnitRisksComponent extends AppComponentBase implements OnInit {

    @Output() riskRemoved = new EventEmitter<any>();
    @Output() risksAdded = new EventEmitter<any>();

    @ViewChild('addMemberModal', {static: true}) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;
    @ViewChild('createOrEditDepartmentRiskModal', { static: true }) createOrEditDepartmentRiskModal: CreateOrEditDepartmentRiskModalComponent;
    @ViewChild('createOrEditDepartmentRiskControlModal', { static: true }) createOrEditDepartmentRiskControlModal: CreateOrEditDepartmentRiskControlModalComponent;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private  _departmentRiskService: DepartmentRisksServiceProxy
    ) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        this.createOrEditDepartmentRiskModal.organizationUnitId = ou.id;
        if (ou) {
            this.refreshRisks();
        }
    }

    ngOnInit(): void {

    }

    getOrganizationUnitRisks(event?: LazyLoadEvent) {
        if (!this._organizationUnit) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._departmentRiskService.getRiskForDepartment('','','',
            this._organizationUnit.id,'',
            this.primengTableHelper.getSorting(this.dataTable),
       
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    refreshRisks(): void {
        this.reloadPage();
    }

    addRiskToUnit(): void {
        this.createOrEditDepartmentRiskModal.show(null, this._organizationUnit.id);
    }


    addControlToRisk(riskId: number, riskDepartmentId?: number): void {

        this.createOrEditDepartmentRiskControlModal.show(null, riskId, this._organizationUnit.id);
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
}
