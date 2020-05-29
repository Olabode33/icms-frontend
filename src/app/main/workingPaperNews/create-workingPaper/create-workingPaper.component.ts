import { Component, OnInit, ViewEncapsulation, Injector, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditWorkingPaperNewDto, GetTestingTemplateForViewDto, WorkingPaperNewsServiceProxy, TestingTemplatesServiceProxy, TestingTemplateDto, RiskDto, ControlDto, OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, CreateOrEditTestingAttributeDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';

@Component({
    selector: 'app-create-workingPaper',
    templateUrl: './create-workingPaper.component.html',
    styleUrls: ['./create-workingPaper.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CreateWorkingPaperComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;

    active = false;
    saving = false;
    loading = false;
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

    depts: ListResultDtoOfOrganizationUnitDto = new ListResultDtoOfOrganizationUnitDto();

    showGeneralInfoCard = true;
    showSamplingCard = true;
    comments: string;
    sampleDescription: string;

    constructor(
        injector: Injector,
        private _changeDetector: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _location: Location,
        private _workingPaperNewsServiceProxy: WorkingPaperNewsServiceProxy,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy,
        private _ouService: OrganizationUnitServiceProxy
    ) {
        super(injector);
        this.depts.items = new Array();
        this.getAllDepartments();
        this.testingTemplate.testingTemplate = new TestingTemplateDto();
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            console.log(params);
            let workingPaperId: string;
            let testingTemplateId: number;
            let departmentId: number;

            if (params.testingTemplateId && params.departmentId) {
                testingTemplateId = +params['testingTemplateId'];
                departmentId = +params['departmentId'];
                this.show(null, testingTemplateId, departmentId);
            }

            if (params.workingPaperId) {
                workingPaperId = params['workingPaperId'];
                console.log(workingPaperId);
                this.show(workingPaperId);
            }
            //this.show();
        });
    }

    show(workingPaperNewId?: string, testingTemplateId?: number, departmentId?: number): void {
        this.completionDate = null;
        this.loading = true;
        if (!workingPaperNewId) {
            this.workingPaperNew = new CreateOrEditWorkingPaperNewDto();
            this.workingPaperNew.id = null;
            this.workingPaperNew.taskDate = moment().startOf('day');
            this.workingPaperNew.dueDate = moment().startOf('day');
            this.workingPaperNew.reviewDate = moment().startOf('day');
            this.workingPaperNew.completionDate = moment().startOf('day');
            this.testingTemplateCode = '';
            this.organizationUnitDisplayName = '';
            this.userName = '';
            this.userName2 = '';
            this.completionDate = moment().startOf('day').toDate();

            this.testingTemplate.testingTemplate = new TestingTemplateDto();
            this.testingTemplate.attributes = [];
            this.testingTemplate.risk = new RiskDto();
            this.testingTemplate.control = new ControlDto();

            //Fake out
            this.workingPaperNew.testingTemplateId = testingTemplateId;
            this.workingPaperNew.organizationUnitId = departmentId;
            this.getTemplateDetails();
            this.getDeptDetails(departmentId);

            this.active = true;
            this.loading = false;
        } else {
            this._workingPaperNewsServiceProxy.getWorkingPaperNewForEdit(workingPaperNewId).subscribe(result => {
                console.log(result);
                this.workingPaperNew = result.workingPaperNew;

                if (this.workingPaperNew.completionDate) {
                    this.completionDate = this.workingPaperNew.completionDate.toDate();
                }
                this.testingTemplate = result.testingTemplate;
                this.testingTemplateCode = result.testingTemplateCode;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.userName = result.userName;
                this.userName2 = result.userName2;

                this.sampleId = result.lastSequence ? result.lastSequence + 1 : 1;

                this.getTemplateDetails();
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
                this.testingTemplateCode = result.testingTemplate.code;
                this.attributes = [];
                this.samples = [];


                this.testingTemplate.attributes.forEach(x => {
                    let item = {
                        id: x.testingAttrributeId,
                        name: x.attributeText,
                        weight: x.weight,
                        value: null ,
                        comment: ''
                    };
                    this.attributes.push(item);
                });

            });
    }

    getAllDepartments(): void {
        this._ouService.getOrganizationUnits().subscribe(result => {
            this.depts = result;
        });
    }

    getDeptDetails(departId): void {
        this._ouService.getOrganizationUnits().subscribe(result => {
            this.depts = result;
            let ou = this.depts.items.find(x => x.id === departId);
            this.organizationUnitDisplayName = ou ? ou.displayName : '';
        });
    }

    maxCount = 0;

    addResult(): void {

       
        //check that all questions have been answered
        var test = false;
        this.attributes.forEach(x => {
            if (x.value == null) {
                test = true;
            }
        })


        if (test) {
            this.notify.warn("Please complete all questions before you move on to the next sample.");
            return;
        }

        let sample = this.samples.find(x => x.sampleId == this.sampleId);
      

        if (sample != null) {

            let sampleIndex = this.samples.findIndex(x => x.sampleId == this.sampleId);

            this.samples.splice(sampleIndex);
        }

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
                    value: null,
                    
                    weight: x.weight,
                };
                this.comments = '';
                this.sampleDescription = '';
                this.attributes.push(item);
            });
            this.sampleId++;
            this.maxCount++;
            this.notify.success('Result for sample saved successfully!.');
        } else {
            this.save();
        }

    }



    getPrevious(): void {
        let sample = this.samples.find(x => x.sampleId == (this.sampleId - 1));

        this.sampleId--;

        this.sampleId = sample.sampleId;
        this.attributes = sample.attributes;        
    }


    getNext(): void {
        let sample = this.samples.find(x => x.sampleId == (this.sampleId + 1));
        this.sampleId++;
        this.sampleId = sample.sampleId;
        this.attributes = sample.attributes;

    }


    save(): void {
        this.saving = true;
        this.loading = true;

        if (this.completionDate) {
            if (!this.workingPaperNew.completionDate) {
                this.workingPaperNew.completionDate = moment(this.completionDate).startOf('day');
            } else {
                this.workingPaperNew.completionDate = moment(this.completionDate);
            }
        } else {
            this.workingPaperNew.completionDate = null;
        }

        this.workingPaperNew.attributes = [];

        this.samples.forEach(x => {
            x.attributes.forEach(y => {
                var item = new CreateOrEditTestingAttributeDto();
                item.sequence = x.sampleId;
                item.attributeText = y.name;
                item.result = y.value == "false" ? false : true;
                item.testingAttrributeId = y.id;
                item.comments = y.comments;
                item.workingPaperId = this.workingPaperNew.id;
                this.workingPaperNew.attributes.push(item);
            });
        });


        this._workingPaperNewsServiceProxy.createOrEdit(this.workingPaperNew)
            .pipe(finalize(() => { this.saving = false; this.loading = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.goBack();
            });
    }





    createExceptionIncident(): void {
        if (this.workingPaperNew.organizationUnitId && this.organizationUnitDisplayName) {
            this.createOrEditExceptionIncidentModal.logException(this.workingPaperNew.organizationUnitId, this.organizationUnitDisplayName);
        }
    }

}
