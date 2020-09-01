import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { RisksServiceProxy, CreateOrEditRiskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'createOrEditRiskModal',
    templateUrl: './create-or-edit-risk-modal.component.html'
})
export class CreateOrEditRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    risk: CreateOrEditRiskDto = new CreateOrEditRiskDto();

    _appConsts = AppConsts;

    constructor(
        injector: Injector,
        private _risksServiceProxy: RisksServiceProxy
    ) {
        super(injector);
    }

    show(riskId?: number): void {

        if (!riskId) {
            this.risk = new CreateOrEditRiskDto();
            this.risk.id = riskId;
            this.risk.likelyhood = 3;
            this.risk.impact = 3;

            this.active = true;
            this.modal.show();
        } else {
            this._risksServiceProxy.getRiskForEdit(riskId).subscribe(result => {
                this.risk = result.risk;
                this.risk.likelyhood = result.risk.likelyhood ? result.risk.likelyhood : 3;
                this.risk.impact = result.risk.impact ? result.risk.impact : 3;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

            this._risksServiceProxy.createOrEdit(this.risk)
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
