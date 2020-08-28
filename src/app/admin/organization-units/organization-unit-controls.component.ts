import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto, DepartmentRiskControlsServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { finalize } from 'rxjs/operators';
import { CreateOrEditTestingTemplateModalComponent } from '@app/main/testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';


@Component({
    selector: 'organization-unit-controls',
    templateUrl: './organization-unit-controls.component.html'
})
export class OrganizationUnitControlsComponent extends AppComponentBase implements OnInit {

    @Output() controlsRemoved = new EventEmitter<any>();
    @Output() controlsAdded = new EventEmitter<any>();


    @ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;

    //@ViewChild('addMemberModal', {static: true}) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    private _departmentRiskCode = '';

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _departmentRiskControlService: DepartmentRiskControlsServiceProxy
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
        // this.createOrEditDepartmentRiskModal.organizationUnitId = ou.id;
        if (ou) {
            this.refreshRisks();
        }
    }

    // get departmentControlCode(): string {
    //     return this._departmentRiskCode;
    // }

    departmentRiskCode(code: string) {
        if (this._departmentRiskCode === code ) {
            return;
        }

        this._departmentRiskCode = code;

        if (code) {
            this.refreshRisks();
        }
    }

    ngOnInit(): void {

    }

    createTestingTemplate(id: number): void {
        this.createOrEditTestingTemplateModal.show(id);
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
        this._departmentRiskControlService.getAllForDepartment('', -1,
            this._organizationUnit.id, this._departmentRiskCode, '',
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

    //addRiskToUnit(): void {
    //    this.createOrEditDepartmentRiskModal.show(null, this._organizationUnit.id);
    //}


    //addControlToRisk(riskId: number): void {
    //    this.createOrEditDepartmentRiskControlModal.show(null, riskId);
    //}


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
                            this.controlsRemoved.emit({
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
        this.controlsAdded.emit({
            userIds: data.userIds,
            ouId: data.ouId
        });

        this.refreshRisks();
    }
}
