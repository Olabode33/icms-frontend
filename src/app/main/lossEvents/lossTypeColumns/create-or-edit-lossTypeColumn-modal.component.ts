import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LossTypeColumnsServiceProxy, CreateOrEditLossTypeColumnDto, LossTypesServiceProxy, CreateOrEditLossTypeDto, LossTypeColumnDto, LossTypeTriggerDto, LossTypeDto, DataTypes, Frequency, GetLossTypeTriggerForView } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { LossEventUserLookupTableModalComponent } from '../lossEvent-user-lookup-table-modal.component';

@Component({
    selector: 'createOrEditLossTypeColumnModal',
    templateUrl: './create-or-edit-lossTypeColumn-modal.component.html'
})
export class CreateOrEditLossTypeColumnModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('lossEventUserLookupTableModal', { static: true }) lossEventUserLookupTableModal: LossEventUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    lossType: CreateOrEditLossTypeDto = new CreateOrEditLossTypeDto();
    lossTypeColumn: LossTypeColumnDto = new LossTypeColumnDto();
    lossTypeTrigger: LossTypeTriggerDto = new LossTypeTriggerDto();

    type: LossTypeDto = new LossTypeDto();
    columns: LossTypeColumnDto[] = new Array();
    triggers: GetLossTypeTriggerForView[] = new Array();
    triggerUserName = '';

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
        let t = new GetLossTypeTriggerForView();
        t.lossTypeTrigger = this.lossTypeTrigger;
        t.notifyUserName = this.triggerUserName;
        this.triggers.push(t);
        this.lossTypeTrigger = new LossTypeTriggerDto();
        this.triggerUserName = '';
    }

    removeColumn(item: any): void {
        let index = this.columns.findIndex(x => x === item);
        this.columns.splice(index, 1);
    }

    removeTrigger(item: LossTypeTriggerDto): void {
        let index = this.triggers.findIndex(e => e.lossTypeTrigger === item);
        this.triggers.splice(index, 1);
    }

    openSelectUserModal() {
        this.lossEventUserLookupTableModal.id = this.lossTypeTrigger.notifyUserId;
        this.lossEventUserLookupTableModal.displayName = this.triggerUserName;
        this.lossEventUserLookupTableModal.show();
    }

    setEmployeeUserIdNull() {
        this.lossTypeTrigger.notifyUserId = null;
        this.triggerUserName = '';
    }

    getNewEmployeeUserId() {
        this.lossTypeTrigger.notifyUserId = this.lossEventUserLookupTableModal.id;
        this.triggerUserName = this.lossEventUserLookupTableModal.displayName;
    }
}
