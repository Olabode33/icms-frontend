import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDepartmentRiskForViewDto, DepartmentRiskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDepartmentRiskModal',
    templateUrl: './view-departmentRisk-modal.component.html'
})
export class ViewDepartmentRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDepartmentRiskForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDepartmentRiskForViewDto();
        this.item.departmentRisk = new DepartmentRiskDto();
    }

    show(item: GetDepartmentRiskForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
