import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetTestingTemplateForViewDto, TestingTemplateDto, Frequency, TestingTemplatesServiceProxy} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'viewTestingTemplateModal',
    templateUrl: './view-testingTemplate-modal.component.html'
})
export class ViewTestingTemplateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetTestingTemplateForViewDto;
    frequency = Frequency;


    constructor(
        injector: Injector,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy

    ) {
        super(injector);
        this.item = new GetTestingTemplateForViewDto();
        this.item.testingTemplate = new TestingTemplateDto();
    }

    show(item: GetTestingTemplateForViewDto): void {

        this._testingTemplatesServiceProxy.getTestingTemplateForView(item.testingTemplate.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(result => {
                this.item = result;
            });


        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
