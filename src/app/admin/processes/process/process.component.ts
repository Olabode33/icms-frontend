import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProcessRisksComponent } from '../process-risk/process-risks.component';
import { ProcessTreeComponent } from '../process-tree/process-tree.component';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
  animations: [appModuleAnimation()]
})
export class ProcessComponent extends AppComponentBase {

    // @ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    @ViewChild('ouRisks', { static: true }) ouRisks: ProcessRisksComponent;
    @ViewChild('ouTree', {static: true}) ouTree: ProcessTreeComponent;
    //@ViewChild('ouControls', { static: true }) ouControls: OrganizationUnitControlsComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        console.log(event);
        // this.ouMembers.organizationUnit = event;
        this.ouRisks.organizationUnit = event;
        //this.ouControls.organizationUnit = event;
    }

}
