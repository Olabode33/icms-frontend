import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LossTypeColumnsServiceProxy, CreateOrEditLossTypeColumnDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditLossTypeColumnModal',
    templateUrl: './create-or-edit-lossTypeColumn-modal.component.html'
})
export class CreateOrEditLossTypeColumnModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    lossTypeColumn: CreateOrEditLossTypeColumnDto = new CreateOrEditLossTypeColumnDto();



    constructor(
        injector: Injector,
        private _lossTypeColumnsServiceProxy: LossTypeColumnsServiceProxy
    ) {
        super(injector);
    }

    show(lossTypeColumnId?: number): void {

        if (!lossTypeColumnId) {
            this.lossTypeColumn = new CreateOrEditLossTypeColumnDto();
            this.lossTypeColumn.id = lossTypeColumnId;

            this.active = true;
            this.modal.show();
        } else {
            this._lossTypeColumnsServiceProxy.getLossTypeColumnForEdit(lossTypeColumnId).subscribe(result => {
                this.lossTypeColumn = result.lossTypeColumn;


                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
        this.saving = true;


        this._lossTypeColumnsServiceProxy.createOrEdit(this.lossTypeColumn)
            .pipe(finalize(() => { this.saving = false; }))
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
