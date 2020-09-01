import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ControlsServiceProxy, CreateOrEditControlDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditControlModal',
    templateUrl: './create-or-edit-control-modal.component.html'
})
export class CreateOrEditControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    control: CreateOrEditControlDto = new CreateOrEditControlDto();

    controlObjective: string[] = new Array();


    constructor(
        injector: Injector,
        private _controlsServiceProxy: ControlsServiceProxy
    ) {
        super(injector);
    }

    show(controlId?: number): void {

        if (!controlId) {
            this.control = new CreateOrEditControlDto();
            this.control.id = controlId;

            this.active = true;
            this.modal.show();
        } else {
            this._controlsServiceProxy.getControlForEdit(controlId).subscribe(result => {
                this.control = result.control;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

            this.control.controlObjective = this.controlObjective.join(',');

            console.log(this.control);
            this._controlsServiceProxy.createOrEdit(this.control)
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
