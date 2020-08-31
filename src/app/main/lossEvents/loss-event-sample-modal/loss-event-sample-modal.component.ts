import { Component, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { LossTypesServiceProxy, LossTypeTriggerDto, GetLossTypeTriggerForView } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

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
        private _lossTypeServiceProxy: LossTypesServiceProxy
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

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
