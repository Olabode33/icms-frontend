import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetLibraryRiskForViewDto, LibraryRiskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewLibraryRiskModal',
    templateUrl: './view-libraryRisk-modal.component.html'
})
export class ViewLibraryRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetLibraryRiskForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetLibraryRiskForViewDto();
        this.item.libraryRisk = new LibraryRiskDto();
    }

    show(item: GetLibraryRiskForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
