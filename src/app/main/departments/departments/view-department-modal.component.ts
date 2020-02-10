import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDepartmentForViewDto, DepartmentDto, DepartmentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDepartmentModal',
    templateUrl: './view-department-modal.component.html'
})
export class ViewDepartmentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDepartmentForEditOutput;


    constructor(
        injector: Injector,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
    ) {
        super(injector);
        this.item = new GetDepartmentForEditOutput();
        this.item.department = new CreateOrEditDepartmentDto();
    }

    show(item?: GetDepartmentForViewDto, itemId = -1): void {
        if (item) {
            this._departmentsServiceProxy.getDepartmentForEdit(item.department.id).subscribe(result => {
                this.item = result;
            });
        } else {
            this._departmentsServiceProxy.getDepartmentForEdit(itemId).subscribe(result => {
                this.item = result;
            });
        }

        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
