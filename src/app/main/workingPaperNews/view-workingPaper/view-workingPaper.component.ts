import { Component, OnInit, ViewEncapsulation, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Location } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditWorkingPaperNewDto, GetTestingTemplateForViewDto, WorkingPaperNewsServiceProxy, TestingTemplatesServiceProxy, TestingTemplateDto, RiskDto, ControlDto } from '@shared/service-proxies/service-proxies';
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
            } else {
                this._workingPaperNewsServiceProxy.getWorkingPaperNewForEdit(workingPaperNewId).subscribe(result => {
                    console.log(result);
                    this.workingPaperNew = result.workingPaperNew;

                    if (this.workingPaperNew.completionDate) {
                        this.completionDate = this.workingPaperNew.completionDate.toDate();
                    }
                    this.testingTemplateCode = result.testingTemplateCode;
                    this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                    this.userName = result.userName;
                    this.userName2 = result.userName2;

                    this.getTemplateDetails();
                    this.active = true;
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

}
