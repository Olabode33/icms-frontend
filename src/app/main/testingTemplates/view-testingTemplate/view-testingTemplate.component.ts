import { Component, OnInit, ViewEncapsulation, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GetTestingTemplateForViewDto, Frequency, TestingTemplatesServiceProxy, TestingTemplateDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
    selector: 'app-view-testingTemplate',
    templateUrl: './view-testingTemplate.component.html',
    styleUrls: ['./view-testingTemplate.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewTestingTemplateComponent extends AppComponentBase implements OnInit {

    saving = false;

    item: GetTestingTemplateForViewDto;
    frequency = Frequency;

    constructor(
        injector: Injector,
        private _changeDetector: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _location: Location,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy
    ) {
        super(injector);
        this.item = new GetTestingTemplateForViewDto();
        this.item.testingTemplate = new TestingTemplateDto();
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            let testingTemplateId: number;

            if (params.testingTemplateId) {
                testingTemplateId = +params['testingTemplateId'];
            }

            this.show(testingTemplateId);
        });
    }

    show(testingTemplateId: number): void {

        this._testingTemplatesServiceProxy.getTestingTemplateForView(testingTemplateId)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(result => {
                this.item = result;
            });
    }

    goBack(): void {
        this._location.back();
    }

}
