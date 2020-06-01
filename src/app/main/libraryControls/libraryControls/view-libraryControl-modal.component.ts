import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetLibraryControlForViewDto, LibraryControlDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewLibraryControlModal',
    templateUrl: './view-libraryControl-modal.component.html'
})
export class ViewLibraryControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetLibraryControlForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetLibraryControlForViewDto();
        this.item.libraryControl = new LibraryControlDto();
    }

    show(item: GetLibraryControlForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
