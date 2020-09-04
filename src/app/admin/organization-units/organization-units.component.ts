import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationTreeComponent } from './organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';
import { OrganizationUnitRisksComponent } from './organization-unit-risks.component';
import { OrganizationUnitControlsComponent } from './organization-unit-controls.component';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { DeptProcessRiskControlComponent } from '../processes/dept-process-risk-control/dept-process-risk-control.component';

@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase implements AfterViewInit {

    activeRcsaProgram = false;

    @ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    //@ViewChild('ouRisks', { static: true }) ouRisks: OrganizationUnitRisksComponent;
    @ViewChild('ouTree', {static: true}) ouTree: OrganizationTreeComponent;
    @ViewChild('ouProcess', {static: true}) ouProcess: DeptProcessRiskControlComponent;
    //@ViewChild('ouControls', { static: true }) ouControls: OrganizationUnitControlsComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.checkForActiveRcsaProgram();
    }

    checkForActiveRcsaProgram(): void {

    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        this.ouMembers.organizationUnit = event;
        //this.ouRisks.organizationUnit = event;
        this.ouProcess.organizationUnit = event;
        //this.ouControls.organizationUnit = event;
    }
}
