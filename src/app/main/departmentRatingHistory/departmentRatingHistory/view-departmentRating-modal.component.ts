import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDepartmentRatingForViewDto, DepartmentRatingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDepartmentRatingModal',
    templateUrl: './view-departmentRating-modal.component.html'
})
export class ViewDepartmentRatingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDepartmentRatingForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDepartmentRatingForViewDto();
        this.item.departmentRating = new DepartmentRatingDto();
    }

    show(item: GetDepartmentRatingForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
