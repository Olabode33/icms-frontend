import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetBusinessObjectiveForViewDto, BusinessObjectiveDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewBusinessObjectiveModal',
    templateUrl: './view-businessObjective-modal.component.html'
})
export class ViewBusinessObjectiveModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetBusinessObjectiveForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetBusinessObjectiveForViewDto();
        this.item.businessObjective = new BusinessObjectiveDto();
    }

    show(item: GetBusinessObjectiveForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
