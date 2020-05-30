import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetRatingForViewDto, RatingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewRatingModal',
    templateUrl: './view-rating-modal.component.html'
})
export class ViewRatingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetRatingForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetRatingForViewDto();
        this.item.rating = new RatingDto();
    }

    show(item: GetRatingForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
