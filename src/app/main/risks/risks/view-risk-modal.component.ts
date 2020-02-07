import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetRiskForViewDto, RiskDto , Severity} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewRiskModal',
    templateUrl: './view-risk-modal.component.html'
})
export class ViewRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetRiskForViewDto;
    severity = Severity;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetRiskForViewDto();
        this.item.risk = new RiskDto();
    }

    show(item: GetRiskForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
