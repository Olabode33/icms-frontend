import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LossTypeColumnsServiceProxy, CreateOrEditLossTypeColumnDto, LossTypesServiceProxy, CreateOrEditLossTypeDto, LossTypeColumnDto, LossTypeTriggerDto, LossTypeDto, DataTypes, Frequency } from '@shared/service-proxies/service-proxies';
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

    lossType: CreateOrEditLossTypeDto = new CreateOrEditLossTypeDto();
    lossTypeColumn: LossTypeColumnDto = new LossTypeColumnDto();
    lossTypeTrigger: LossTypeTriggerDto = new LossTypeTriggerDto();

    type: LossTypeDto = new LossTypeDto();
    columns: LossTypeColumnDto[] = new Array();
    triggers: LossTypeTriggerDto[] = new Array();

    dataTypeEnum = DataTypes;
    frequencyEnum = Frequency;

    constructor(
        injector: Injector,
        private _lossTypeServiceProxy: LossTypesServiceProxy
    ) {
        super(injector);
    }

    show(lossTypeId?: number): void {

        if (!lossTypeId) {
            this.type = new LossTypeDto();
            this.type.id = lossTypeId;
            this.columns = new Array();
            this.triggers = new Array();

            this.active = true;
            this.modal.show();
        } else {
            this._lossTypeServiceProxy.getLossTypeColumnForEdit(lossTypeId).subscribe(result => {
                console.log(result);
                this.type = result.lossType;
                this.columns = result.lossTypeColumns;
                this.triggers = result.lossTypeTriggers;

                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
        this.saving = true;
        this.lossType.lossType = this.type;
        this.lossType.lossTypeColumns = this.columns;
        this.lossType.lossTypeTriggers = this.triggers;

        this._lossTypeServiceProxy.createOrEdit(this.lossType)
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

    addColumn(): void {
        this.columns.push(this.lossTypeColumn);
        this.lossTypeColumn = new LossTypeColumnDto();
    }

    addTrigger(): void {
        this.triggers.push(this.lossTypeTrigger);
        this.lossTypeTrigger = new LossTypeTriggerDto();
    }

    removeColumn(item: any): void {
        let index = this.columns.findIndex(x => x === item);
        this.columns.splice(index, 1);
    }

    removeTrigger(item: LossTypeTriggerDto): void {
        let index = this.triggers.findIndex(e => e === item);
        this.triggers.splice(index, 1);
    }
}
