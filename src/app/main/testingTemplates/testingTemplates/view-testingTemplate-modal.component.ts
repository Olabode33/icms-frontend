import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetTestingTemplateForViewDto, TestingTemplateDto , Frequency} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

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
        injector: Injector
    ) {
        super(injector);
        this.item = new GetTestingTemplateForViewDto();
        this.item.testingTemplate = new TestingTemplateDto();
    }

    show(item: GetTestingTemplateForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
