import { Component, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { LossTypesServiceProxy, LossTypeTriggerDto, GetLossTypeTriggerForView, LossEventTasksServiceProxy, CreateOrEditLossEventTaskDto, Status } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-loss-event-sample-modal',
  templateUrl: './loss-event-sample-modal.component.html',
  styleUrls: ['./loss-event-sample-modal.component.css']
})
export class LossEventSampleModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    trigger: GetLossTypeTriggerForView = new GetLossTypeTriggerForView();
    today: moment.Moment;


    constructor(
        injector: Injector,
        private _lossTypeServiceProxy: LossTypesServiceProxy,
        private _lossEventTaskServiceProxy: LossEventTasksServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this._lossTypeServiceProxy.getLossTrigerForNotificationDemo().subscribe(result => {
            this.trigger = result;
            this.today = moment();

            this.active = true;
            this.modal.show();
        });
    }

    save(): void {
        let task = new CreateOrEditLossEventTaskDto();
        task.assignedTo = this.trigger.lossTypeTrigger.notifyUserId;
        task.dateAssigned = this.today;
        task.description = 'A possible loss event has been identified: ' + this.trigger.lossTypeTrigger.description;
        task.lossTypeId = this.trigger.lossTypeTrigger.lossTypeId;
        task.lossTypeTriggerId = this.trigger.lossTypeTrigger.id;
        task.status = Status.Open;
        task.title = this.trigger.lossTypeTrigger.name;

        this._lossEventTaskServiceProxy.createOrEdit(task)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success('Loss event successfully sent for review');
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
