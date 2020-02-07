import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetExceptionIncidentForViewDto, ExceptionIncidentDto , Status} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewExceptionIncidentModal',
    templateUrl: './view-exceptionIncident-modal.component.html'
})
export class ViewExceptionIncidentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetExceptionIncidentForViewDto;
    status = Status;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetExceptionIncidentForViewDto();
        this.item.exceptionIncident = new ExceptionIncidentDto();
    }

    show(item: GetExceptionIncidentForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
