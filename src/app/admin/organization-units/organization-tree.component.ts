import { Router } from '@angular/router';
import { OnInit, Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HtmlHelper } from '@shared/helpers/HtmlHelper';
import { ListResultDtoOfOrganizationUnitDto, MoveOrganizationUnitInput, OrganizationUnitDto, OrganizationUnitServiceProxy, GetDepartmentForViewDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { CreateOrEditUnitModalComponent } from './create-or-edit-unit-modal.component';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { IRoleWithOrganizationUnit } from './role-with-organization-unit';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';
import { CreateOrEditDepartmentModalComponent } from '@app/main/departments/departments/create-or-edit-department-modal.component';
import { CreateOrEditDepartmentRiskModalComponent } from '@app/main/departmentRisks/departmentRisks/create-or-edit-departmentRisk-modal.component';

import { TreeNode, MenuItem } from 'primeng/api';

import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { ViewDepartmentModalComponent } from '@app/main/departments/departments/view-department-modal.component';

export interface IOrganizationUnitOnTree extends IBasicOrganizationUnitInfo {
    id: number;
    parent: string | number;
    code: string;
    displayName: string;
    memberCount: number;
    riskCount: number;
    text: string;
    state: any;
}

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationTreeComponent extends AppComponentBase implements OnInit {

    @Output() ouSelected = new EventEmitter<IBasicOrganizationUnitInfo>();

    @ViewChild('createOrEditDepartmentModal', { static: true }) createOrEditDepartmentModal: CreateOrEditDepartmentModalComponent;
    @ViewChild('createOrEditOrganizationUnitModal', { static: true }) createOrEditOrganizationUnitModal: CreateOrEditUnitModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditDepartmentRiskModal', { static: true }) createOrEditDepartmentRiskModal: CreateOrEditDepartmentRiskModalComponent;
    @ViewChild('viewDepartmentModal', { static: true }) viewDepartmentModal: ViewDepartmentModalComponent;

    treeData: any;
    selectedOu: TreeNode;
    ouContextMenuItems: MenuItem[];
    canManageOrganizationUnits = false;

    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _arrayToTreeConverterService: ArrayToTreeConverterService,
        private _treeDataHelperService: TreeDataHelperService,
        private _router: Router
    ) {
        super(injector);
    }

    totalUnitCount = 0;

    ngOnInit(): void {
        this.canManageOrganizationUnits = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        this.ouContextMenuItems = this.getContextMenuItems();
        this.getTreeDataFromServer();
    }



    nodeSelect(event) {
        this.ouSelected.emit(<IBasicOrganizationUnitInfo>{
            id: event.node.data.id,
            displayName: event.node.data.displayName
        });
    }

    isDroppingBetweenTwoNodes(event: any): boolean {
        return event.originalEvent.target.nodeName === 'LI';
    }

    nodeDrop(event) {
        const input = new MoveOrganizationUnitInput();
        input.id = event.dragNode.data.id;
        let dropNodeDisplayName = '';

        if (this.isDroppingBetweenTwoNodes(event)) {//between two item
            input.newParentId = event.dropNode.parent ? event.dropNode.parent.data.id : null;
            dropNodeDisplayName = event.dropNode.parent ? event.dropNode.parent.data.displayName : this.l('Root');
        } else {
            input.newParentId = event.dropNode.data.id;
            dropNodeDisplayName = event.dropNode.data.displayName;
        }

        this.message.confirm(
            this.l('OrganizationUnitMoveConfirmMessage', event.dragNode.data.displayName, dropNodeDisplayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService.moveOrganizationUnit(input)
                        .pipe(catchError(error => {
                            this.revertDragDrop();
                            return Observable.throw(error);
                        }))
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyMoved'));
                            this.reload();
                        });
                } else {
                    this.revertDragDrop();
                }
            }
        );
    }

    revertDragDrop() {
        this.reload();
    }

    reload(): void {
        this.getTreeDataFromServer();
    }

    private getTreeDataFromServer(): void {
        let self = this;
        this._organizationUnitService.getOrganizationUnits().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
            this.totalUnitCount = result.items.length;
            this.treeData = this._arrayToTreeConverterService.createTree(result.items,
                'parentId',
                'id',
                null,
                'children',
                [
                    {
                        target: 'label',
                        targetFunction(item) {
                            return item.displayName;
                        }
                    }, {
                        target: 'expandedIcon',
                        value: 'fa fa-door-open m--font-warning'
                    },
                    {
                        target: 'collapsedIcon',
                        value: 'fa fa-door-closed m--font-warning'
                    },
                    {
                        target: 'selectable',
                        value: true
                    },
                    {
                        target: 'memberCount',
                        targetFunction(item) {
                            return item.memberCount;
                        }
                    },
                    {
                        target: 'riskCount',
                        targetFunction(item) {
                            return item.riskCount;
                        }
                    }
                ]);
        });
    }

    private isEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    private getContextMenuItems(): any[] {

        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');

        let items = [
            {
                label: this.l('View'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                    console.log(this.selectedOu);
                    this.view(this.selectedOu.data.id);
                    //this.viewDepartmentModal.show(null, this.selectedOu.data.id);
                }
            },
            {
                label: this.l('Auditor'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                    console.log(this.selectedOu);
                    this.auditor(this.selectedOu.data.id);
                    //this.viewDepartmentModal.show(null, this.selectedOu.data.id);
                }
            },
            {
                label: this.l('Edit'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                    this.createOrEditDepartmentModal.show(this.selectedOu.data.id, null, this.selectedOu.data.displayName);
                }
            },
            {
                label: this.l('AddSubUnit'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.addUnit(this.selectedOu.data.id);
                }
            },
            {
                label: 'Add Risk',
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.addRiskToUnit(this.selectedOu.data.id);
                }
            },
            {
                label: this.l('Delete'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.message.confirm(
                        this.l('OrganizationUnitDeleteWarningMessage', this.selectedOu.data.displayName),
                        this.l('AreYouSure'),
                        isConfirmed => {
                            if (isConfirmed) {
                                this._organizationUnitService.deleteOrganizationUnit(this.selectedOu.data.id).subscribe(() => {
                                    this.deleteUnit(this.selectedOu.data.id);
                                    this.notify.success(this.l('SuccessfullyDeleted'));
                                    this.selectedOu = null;
                                    this.reload();
                                });
                            }
                        }
                    );
                }
            }
        ];

        if (this.isEntityHistoryEnabled()) {
            items.push({
                label: this.l('History'),
                disabled: false,
                command: (event) => {
                    this.entityTypeHistoryModal.show({
                        entityId: this.selectedOu.data.id.toString(),
                        entityTypeFullName: this._entityTypeFullName,
                        entityTypeDescription: this.selectedOu.data.displayName
                    });
                }
            });
        }

        return items;
    }

    addUnit(parentId?: number): void {
        this.createOrEditDepartmentModal.show(null, parentId, null);
    }


    addRiskToUnit(unitId?: number): void {
        this.createOrEditDepartmentRiskModal.show(null, unitId);
    }

    unitCreated(): void {
        this.getTreeDataFromServer();
    }

    view(id: number): void {
        this._router.navigate(['app/main/departments/view', id ]);
    }

    auditor(id: number): void {
        this._router.navigate(['app/main/auditor/view', id ]);
    }

    deleteUnit(id) {
        let node = this._treeDataHelperService.findNode(this.treeData, { data: { id: id } });
        if (!node) {
            return;
        }

        if (!node.data.parentId) {
            _.remove(this.treeData, {
                data: {
                    id: id
                }
            });
        }

        let parentNode = this._treeDataHelperService.findNode(this.treeData, { data: { id: node.data.parentId } });
        if (!parentNode) {
            return;
        }

        _.remove(parentNode.children, {
            data: {
                id: id
            }
        });
    }

    unitUpdated(ou: OrganizationUnitDto): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.id } });
        if (!item) {
            return;
        }

        item.data.displayName = ou.displayName;
        item.label = ou.displayName;
        item.memberCount = ou.memberCount;
        item.roleCount = ou.roleCount;
    }

    membersAdded(data: IUsersWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, data.userIds.length);
    }

    memberRemoved(data: IUserWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, -1);
    }

    incrementMemberCount(ouId: number, incrementAmount: number): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        item.data.memberCount += incrementAmount;
        item.memberCount = item.data.memberCount;
    }

    risksAdded(data: IRolesWithOrganizationUnit): void {
        this.incrementRiskCount(data.ouId, data.roleIds.length);
    }

    riskRemoved(data: IRoleWithOrganizationUnit): void {
        this.incrementRiskCount(data.ouId, -1);
    }

    incrementRiskCount(ouId: number, incrementAmount: number): void {
        let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        item.data.riskCount += incrementAmount;
        item.riskCount = item.data.roleCount;
    }
}
