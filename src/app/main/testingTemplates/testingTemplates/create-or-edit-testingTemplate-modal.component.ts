import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TestingTemplatesServiceProxy, CreateOrEditTestingTemplateDto, CreateorEditTestTemplateDetailsDto, ProjectOwner, NameValueDto, ListResultDtoOfOrganizationUnitDto, ProcessesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
//import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplate-departmentRiskControl-lookup-table-modal.component';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/exceptionIncident-exceptionType-lookup-table-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProcessRisksComponent } from '@app/admin/processes/process-risk/process-risks.component';
import { ProcessTreeComponent } from '@app/admin/processes/process-tree/process-tree.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { TreeNode, MenuItem } from 'primeng/api';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';


@Component({
    selector: 'createOrEditTestingTemplateModal',
    templateUrl: './create-or-edit-testingTemplate-modal.component.html'
})
export class CreateOrEditTestingTemplateModalComponent extends AppComponentBase implements OnInit {
    state = false;

    changeState: boolean;
// @ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    
    //@ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    //    @ViewChild('testingTemplateDepartmentRiskControlLookupTableModal', { static: true }) testingTemplateDepartmentRiskControlLookupTableModal: TestingTemplateDepartmentRiskControlLookupTableModalComponent;
    @ViewChild('exceptionIncidentExceptionTypeLookupTableModal', { static: true }) exceptionIncidentExceptionTypeLookupTableModal: ExceptionIncidentExceptionTypeLookupTableModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
  
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    attributes = [];
    QuestionsDropdown: NameValueDto[] = new Array();
    attributeQuestion = '';
    exceptionTypeId: number;
    availableWeight = 100;
    weight = 100;
    selectedQuestion = '';
    TestingTemplateID = 0;
    totalUnitCount = 0;

    testingTemplate: CreateOrEditTestingTemplateDto = new CreateOrEditTestingTemplateDto();

    departmentRiskControlCode = '';
    exceptionTypeName: string;
    departmentRiskControlId: number;

    projectOwnerEnum = ProjectOwner;
   
    treeData: any;
    selectedOu: TreeNode;
    ouContextMenuItems: MenuItem[];
    canManageOrganizationUnits = false;
    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';
    
    //@ViewChild('ouControls', { static: true }) ouControls: OrganizationUnitControlsComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _processService: ProcessesServiceProxy,
        private _treeDataHelperService: TreeDataHelperService,
        private _arrayToTreeConverterService: ArrayToTreeConverterService,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
        _testingTemplatesServiceProxy.getTestAttributesForTemplate().subscribe(result => {
            //console.log("RES", result)
            this.QuestionsDropdown = result;
        });
    }


    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
        this.ouContextMenuItems = this.getContextMenuItems();
        this.TestingTemplateID =this._activatedRoute.snapshot.queryParams['id'];
        this.getTreeDataFromServer();
    }

    show(departmentRiskControlId?: number): void {

        if (departmentRiskControlId) {
            this.testingTemplate = new CreateOrEditTestingTemplateDto();
            this.testingTemplate.id = null;
            this.departmentRiskControlCode = '';
            this.testingTemplate.departmentRiskControlId = departmentRiskControlId;
            this.getModule();

            this.active = true;
            //this.modal.show();
        } else {
            this.notify.warn('Please select a risk to attach the template to.');
            return;
        }
    }

    getModule(): void {
        switch (localStorage.getItem(AppConsts.SelectedModuleKey)) 
        {
            case AppConsts.ModuleKeyValueInternalControl:
                this.testingTemplate.projectOwner = ProjectOwner.InternalControl;
                break;
            case AppConsts.ModuleKeyValueInternalAudit:
                this.testingTemplate.projectOwner = ProjectOwner.InternalAudit;
                break;
            case AppConsts.ModuleKeyValueOpRisk:
                this.testingTemplate.projectOwner = ProjectOwner.OperationRisk;
                break;
            case AppConsts.ModuleKeyValueGeneral:
                this.testingTemplate.projectOwner = ProjectOwner.General;
                break;
            default:
                this.testingTemplate.projectOwner = ProjectOwner.General;
                break;
        }
    }
    // private isEntityHistoryEnabled(): boolean 
    // {
    //     let customSettings = (abp as any).custom;
    //     return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    // }


    private getTreeDataFromServer(): void 
    {
        let self = this;
        this._testingTemplatesServiceProxy.getTemplateQuestions(2).subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
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
                        target: 'riskCount',
                        targetFunction(item) {
                            return item.memberCount;
                        }
                    },
                    {
                        target: 'controlCount',
                        targetFunction(item) {
                            return item.roleCount;
                        }
                    }
                ]);
        });
    }


    AddQuestion(parentId?: number, displayName?: string): void {
        //this.createEditQuestionModal.show(null, parentId, displayName);
    }

    
    private getContextMenuItems(): any[] {

        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        let items = [
           
            {
                label: this.l('Edit Question'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                   // this.createEditQuestionModal.show(this.selectedOu.data.id, null, this.selectedOu.data.displayName);
                }
            },
            {
                label: this.l('Add Question'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.AddQuestion(this.selectedOu.data.id, this.selectedOu.data.displayName);
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
                                this._processService.delete(this.selectedOu.data.id).subscribe(() => {
                                    // this.deleteUnit(this.selectedOu.data.id);
                                    this.message.success(this.l('SuccessfullyDeleted'));
                                    this.selectedOu = null;
                                    this.reload();
                                });
                            }
                        }
                    );
                }
            }
        ];

        // if (this.isEntityHistoryEnabled()) {
        //     items.push({
        //         label: this.l('History'),
        //         disabled: false,
        //         command: (event) => {
        //             this.entityTypeHistoryModal.show({
        //                 entityId: this.selectedOu.data.id.toString(),
        //                 entityTypeFullName: this._entityTypeFullName,
        //                 entityTypeDescription: this.selectedOu.data.displayName
        //             });
        //         }
        //     });
        // }

        return items;
    }

    reload(): void {
        this.getTreeDataFromServer();
    }
    
    // deleteUnit(id) {
    //     let node = this._treeDataHelperService.findNode(this.treeData, { data: { id: id } });
    //     if (!node) {
    //         return;
    //     }

    //     if (!node.data.parentId) {
    //         _.remove(this.treeData, {
    //             data: {
    //                 id: id
    //             }
    //         });
    //     }

    //     let parentNode = this._treeDataHelperService.findNode(this.treeData, { data: { id: node.data.parentId } });
    //     if (!parentNode) 
    //     {
    //         return;
    //     }

    //     _.remove(parentNode.children, {
    //         data: {
    //             id: id
    //         }
    //     });
    // }

    

    save(): void {
        this.saving = true;

        if (this.attributes.length == 0) {
            this.notify.error('Include at least one attribute to test.');
            return;
        }


        if (this.availableWeight != 0) {
            this.notify.error('Please ensure the sum of the weight across all attributes is equal to 0.');
            return;
        }

        this.testingTemplate.attributes = [];

        this.attributes.forEach(x => {
            var item = new CreateorEditTestTemplateDetailsDto();

            item.testAttribute = x.name;
            item.weight = x.weight;
            item.parentId = x.parentId;
            this.testingTemplate.attributes.push(item);
        })


        this._testingTemplatesServiceProxy.createOrEdit(this.testingTemplate)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                //this.modalSave.emit(null);
            });
    }



    setDepartmentRiskControlIdNull() {
        this.testingTemplate.departmentRiskControlId = null;
        this.departmentRiskControlCode = '';
    }

    close(): void {
        this.active = false;
        this.goBack();
        //this.modal.hide();
    }

    goBack(): void {
        this._location.back();
    }


    addAttribute(): void {

        if (this.availableWeight == 0) 
        {
            this.notify.warn("The sum of all weights is equal to 0, please remove or re-allocate the weights.");
            return;
        }

        if (this.attributes.find(x => x.name == this.attributeQuestion) != undefined) 
        {
            this.notify.warn("This attribute has been added already.");
            return;
        }

        if (this.attributeQuestion == '') 
        {
            this.notify.warn("The attribute can not be blank.");
            return;
        }

        if (this.exceptionTypeId != null) 
        {
            this.notify.warn("Select an exception type.");
            return;
        }


        if (this.weight > this.availableWeight) 
        {
            this.notify.warn("This weight can not be more than " + this.availableWeight.toString() + ".");
            return;
        }

        //find the question text using the value
        let obj = this.QuestionsDropdown.find(o => o.value === this.selectedQuestion);

        var item = {
            name: this.attributeQuestion,
            weight: this.weight,
            selectedQuestion: obj == null ? null : obj.name,
            parentId: this.selectedQuestion == null ? null : this.selectedQuestion
        };

        this.attributes.push(item);
        this.attributeQuestion = '';
        this.selectedQuestion = '';
        this.availableWeight -= this.weight;
        this.weight = this.availableWeight;
    }




    openSelectExceptionTypeModal() {
        this.exceptionIncidentExceptionTypeLookupTableModal.show();
    }

    getNewExceptionTypeId() {
        this.testingTemplate.exceptionTypeId = this.exceptionIncidentExceptionTypeLookupTableModal.id;
        this.exceptionTypeName = this.exceptionIncidentExceptionTypeLookupTableModal.displayName;
    }


    removeColumn(item: any): void {
        var index = this.attributes.findIndex(x => x.name == item.name);
        this.availableWeight += this.attributes[index].weight;
        this.attributes.splice(index, 1);

    }

}
