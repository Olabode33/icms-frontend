import { Component, OnInit, ViewEncapsulation, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditWorkingPaperNewDto, GetTestingTemplateForViewDto, WorkingPaperNewsServiceProxy, TestingTemplatesServiceProxy, TestingTemplateDto, RiskDto, ControlDto, TaskStatus, CreateOrEditTestingAttributeDto, Frequency, Severity, ControlType, EntityDtoOfGuid } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-view-workingPaper',
    templateUrl: './view-workingPaper.component.html',
    styleUrls: ['./view-workingPaper.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewWorkingPaperComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;
    samples = [];
    attributes = [];

    workingPaperNew: CreateOrEditWorkingPaperNewDto = new CreateOrEditWorkingPaperNewDto();
    testingTemplate: GetTestingTemplateForViewDto = new GetTestingTemplateForViewDto();

    sampleId = 1;
    completionDate: Date;
    testingTemplateCode = '';
    organizationUnitDisplayName = '';
    userName = '';
    userName2 = '';

    fakeTestingTemplateId = 6;
    fakeTestingTemplateCode = 'TT-1';

    loading = false;
    showGeneralInfoCard = true;
    showSamplingCard = true;
    showAuditInfoCard = true;
    showProcessCard = true;
    showRiskCard = false;
    showControlsCard = false;

    taskStatusEnum = TaskStatus;
    frequency = Frequency;
    severityEnum = Severity;
    controlTypeEnum = ControlType;

    sampleResponses: { sampleId: number, response: CreateOrEditTestingAttributeDto[] }[] = new Array();
    currentSample: { sampleId: number, response: CreateOrEditTestingAttributeDto[] } = { sampleId: null, response: new Array() };
    currentSampleIndex = 0;
    firstSample = true;
    lastSample = false;
    loadingSamples = false;

    constructor(
        injector: Injector,
        private _changeDetector: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _location: Location,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
        this.testingTemplate.testingTemplate = new TestingTemplateDto();
        this.testingTemplate.risk = new RiskDto();
        this.testingTemplate.control = new ControlDto();
        this.testingTemplate.attributes = new Array();
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            let workingPaperId: string;

            if (params.workingPaperId) {
                workingPaperId = params['workingPaperId'];
                this.show(workingPaperId);
            }
        });
    }

    show(workingPaperNewId?: string): void {
        this.loading = true;
        this.completionDate = null;

        if (!workingPaperNewId) {
            this.workingPaperNew = new CreateOrEditWorkingPaperNewDto();
            this.workingPaperNew.id = workingPaperNewId;
            this.workingPaperNew.taskDate = moment().startOf('day');
            this.workingPaperNew.dueDate = moment().startOf('day');
            this.workingPaperNew.reviewDate = moment().startOf('day');
            this.testingTemplateCode = '';
            this.organizationUnitDisplayName = '';
            this.userName = '';
            this.userName2 = '';

            this.testingTemplate.testingTemplate = new TestingTemplateDto();
            this.testingTemplate.attributes = [];
            this.testingTemplate.risk = new RiskDto();
            this.testingTemplate.control = new ControlDto();

            //Fake out
            this.workingPaperNew.testingTemplateId = this.fakeTestingTemplateId;
            this.testingTemplateCode = this.fakeTestingTemplateCode;
            this.getTemplateDetails();

            this.active = true;
            this.loading = false;
        } else {
            this._workingPaperNewsServiceProxy.getWorkingPaperNewForEdit(workingPaperNewId).subscribe(result => {
                console.log(result);
                this.workingPaperNew = result.workingPaperNew;

                if (this.workingPaperNew.completionDate) {
                    this.completionDate = this.workingPaperNew.completionDate.toDate();
                }
                //this.testingTemplate = result.testingTemplate;
                this.testingTemplateCode = result.testingTemplateCode;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.userName = result.userName;
                this.userName2 = result.userName2;

                this.getTemplateDetails();
                if (result.workingPaperDetails.length > 0) {
                    result.workingPaperDetails.forEach(element => {
                        let sample = this.sampleResponses.find(x => x.sampleId === element.sequence);
                        if (sample) {
                            sample.response.push(element);
                        } else {
                            let attributeResponses = new Array();
                            attributeResponses.push(element);
                            this.sampleResponses.push({ sampleId: element.sequence, response: attributeResponses });
                        }
                    });
                    this.displaySample();
                }
               // console.log(this.currentSample);
                this.active = true;
                this.loading = false;
            });
        }
    }

    goBack(): void {
        this._location.back();
    }

    getTemplateDetails(): void {

        this._testingTemplatesServiceProxy.getTestingTemplateForView(this.workingPaperNew.testingTemplateId)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(result => {
                this.testingTemplate = result;
                this.attributes = [];
                this.samples = [];


                this.testingTemplate.attributes.forEach(x => {
                    let item = {
                        id: x.testingAttrributeId,
                        name: x.attributeText,
                        weight: x.weight,
                        value: 'Yes'
                    };
                    this.attributes.push(item);
                });

            });
    }


    addResult(): void {
        let item = {
            sampleId: this.sampleId,
            attributes: this.attributes
        };

        this.samples.push(item);

        this.attributes = [];
        if (this.sampleId < this.testingTemplate.testingTemplate.sampleSize) {

            this.testingTemplate.attributes.forEach(x => {
                let item = {
                    id: x.testingAttrributeId,
                    name: x.attributeText,
                    value: 'false'
                };
                this.attributes.push(item);
            });
            this.sampleId++;
        } else {
            //this.save();
        }

    }

    approve(): void {
        this.message.confirm(
            '',
            'Are you sure you want to approve this working paper?',
            (isConfirmed) => {
                if (isConfirmed) {
                    let input = new EntityDtoOfGuid();
                    input.id = this.workingPaperNew.id;
                    this._workingPaperNewsServiceProxy.approveWorkPaper(input)
                        .subscribe(() => {
                            this.notify.success('This page has been approved.');
                            this._location.back();
                        });
                }
            }
        );


    }

    reject(): void {
        //
    }

    displaySample(): void {
        this.currentSample = this.sampleResponses[this.currentSampleIndex];
    }

    goTo(number: number): void {
        this.loadingSamples = true;
        //Skip if sample is already displayed
        if (number === this.currentSampleIndex) {
            return;
        }

        //Validate
        if (!this.isValid()) {
            this.notify.error('Please select a response');
            return;
        }

        //Set next sample
        this.currentSampleIndex = number;

        //Update UI
        this.displaySample();
        this.loadingSamples = false;
    }

    isValid(): boolean {
        return true;
    }

    isFirstSample(): boolean {
        return this.currentSampleIndex === 0;
    }

    isLastSample(): boolean {
        return this.currentSampleIndex === this.sampleResponses.length - 1;
    }

    getNextStep(): number {
        if (this.sampleResponses.length > (this.currentSampleIndex + 1)) {
            return this.currentSampleIndex + 1;
        } else {
            return this.sampleResponses.length - 1;
        }
    }

    getPrevStep(): number {
        if ((this.currentSampleIndex - 1) >= 0) {
            return this.currentSampleIndex - 1;
        } else {
            return 0;
        }
    }

    gotoNext() {
        return this.goTo(this.getNextStep());
    }

    gotoPrev() {
        return this.goTo(this.getPrevStep());
    }

    getCurrentSampleResult(testingAttributeId: number): string {
        let result = this.currentSample.response.find(x => x.testingAttrributeId === testingAttributeId);
        if (result) {
            return result.result ? 'Yes' : 'No';
        } else {
            return null;
        }
    }
}
