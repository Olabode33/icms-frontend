import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetExceptionTypeForViewDto, ExceptionTypeDto , Severity} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewExceptionTypeModal',
    templateUrl: './view-exceptionType-modal.component.html'
})
export class ViewExceptionTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetExceptionTypeForViewDto;
    severity = Severity;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetExceptionTypeForViewDto();
        this.item.exceptionType = new ExceptionTypeDto();
    }

    show(item: GetExceptionTypeForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
