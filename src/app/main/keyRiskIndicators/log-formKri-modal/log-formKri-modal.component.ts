import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-log-formKri-modal',
  templateUrl: './log-formKri-modal.component.html',
  styleUrls: ['./log-formKri-modal.component.css']
})
export class LogFormKriModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    active = false;
    saving = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.message.success('Logged successfully!');
        this.active = false;
        this.modal.hide();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }


}
