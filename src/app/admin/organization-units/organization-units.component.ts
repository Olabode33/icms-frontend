import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationTreeComponent } from './organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';
import { OrganizationUnitRisksComponent } from './organization-unit-risks.component';
import { OrganizationUnitControlsComponent } from './organization-unit-controls.component';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { DeptProcessRiskControlComponent } from '../processes/dept-process-risk-control/dept-process-risk-control.component';
import { RcsaProgramAssessmentServiceProxy, RcsaProgramAssessmentDto, VerificationStatusEnum } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase implements AfterViewInit {

    verificationStatusEnum = VerificationStatusEnum;
    activeRcsaProgram = false;
    assessment: RcsaProgramAssessmentDto = new RcsaProgramAssessmentDto();

    @ViewChild('ouMembers', {static: true}) ouMembers: OrganizationUnitMembersComponent;
    //@ViewChild('ouRisks', { static: true }) ouRisks: OrganizationUnitRisksComponent;
    @ViewChild('ouTree', {static: true}) ouTree: OrganizationTreeComponent;
    @ViewChild('ouProcess', {static: true}) ouProcess: DeptProcessRiskControlComponent;
    //@ViewChild('ouControls', { static: true }) ouControls: OrganizationUnitControlsComponent;
    organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(
        injector: Injector,
        private _rcsaAssessmentServiceProcess: RcsaProgramAssessmentServiceProxy,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.assessment = new RcsaProgramAssessmentDto();
        this.checkForActiveRcsaProgram();
    }

    checkForActiveRcsaProgram(): void {
        this._rcsaAssessmentServiceProcess.getActiveRcsaProgram().subscribe(result => {
            this.activeRcsaProgram = result.active;
            this.assessment.projectId = result.projectId;
        });
    }

    ouSelected(event: any): void {
        this.organizationUnit = event;
        this.ouMembers.organizationUnit = event;
        //this.ouRisks.organizationUnit = event;
        this.ouProcess.organizationUnit = event;
        //this.ouControls.organizationUnit = event;
    }

    submitForReview(): void {
        this.message.confirm(
            'Submit for review',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.assessment.businessUnitId = this.organizationUnit.id;
                    this.assessment.changes = true;
                    this.assessment.verificationStatus = VerificationStatusEnum.Submitted;

                    this._rcsaAssessmentServiceProcess.saveRcsaProgramAssessment(this.assessment)
                        .subscribe(() => {
                            this.message.success('Successfully Submitted');
                        });
                }
            }
        );
    }

    submitForVerification(): void {
        this.message.confirm(
            'Submit for verification',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.assessment.businessUnitId = this.organizationUnit.id;
                    this.assessment.changes = true;
                    this.assessment.verificationStatus = VerificationStatusEnum.Verified;

                    this._rcsaAssessmentServiceProcess.saveRcsaProgramAssessment(this.assessment)
                        .subscribe(() => {
                            this.message.success('Successfully Submitted');
                        });
                }
            }
        );
    }
}
