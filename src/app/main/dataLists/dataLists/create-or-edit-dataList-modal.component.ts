import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DataListsServiceProxy, CreateOrEditDataListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditDataListModal',
    templateUrl: './create-or-edit-dataList-modal.component.html'
})
export class CreateOrEditDataListModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    dataList: CreateOrEditDataListDto = new CreateOrEditDataListDto();



    constructor(
        injector: Injector,
        private _dataListsServiceProxy: DataListsServiceProxy
    ) {
        super(injector);
    }

    show(dataListId?: number): void {

        if (!dataListId) {
            this.dataList = new CreateOrEditDataListDto();
            this.dataList.id = dataListId;

            this.active = true;
            this.modal.show();
        } else {
            this._dataListsServiceProxy.getDataListForEdit(dataListId).subscribe(result => {
                this.dataList = result.dataList;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._dataListsServiceProxy.createOrEdit(this.dataList)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.message.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
