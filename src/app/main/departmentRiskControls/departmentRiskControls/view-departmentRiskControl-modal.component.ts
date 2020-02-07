import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDepartmentRiskControlForViewDto, DepartmentRiskControlDto , Frequency} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDepartmentRiskControlModal',
    templateUrl: './view-departmentRiskControl-modal.component.html'
})
export class ViewDepartmentRiskControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDepartmentRiskControlForViewDto;
    frequency = Frequency;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDepartmentRiskControlForViewDto();
        this.item.departmentRiskControl = new DepartmentRiskControlDto();
    }

    show(item: GetDepartmentRiskControlForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
