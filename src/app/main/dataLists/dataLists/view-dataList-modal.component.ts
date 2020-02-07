import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDataListForViewDto, DataListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDataListModal',
    templateUrl: './view-dataList-modal.component.html'
})
export class ViewDataListModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDataListForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDataListForViewDto();
        this.item.dataList = new DataListDto();
    }

    show(item: GetDataListForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
