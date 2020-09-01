import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { LossEventsServiceProxy, GetLossEventForViewDto, LossEventDto, LossEventTypeEnums, Status, LossCategoryEnums } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './view-lossEvent.component.html',
    animations: [appModuleAnimation()]
})
export class ViewLossEventComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    item: GetLossEventForViewDto;
    lossEventTypeEnums = LossEventTypeEnums;
    status = Status;
    lossCategoryEnums = LossCategoryEnums;


    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _lossEventsServiceProxy: LossEventsServiceProxy
    ) {
        super(injector);
        this.item = new GetLossEventForViewDto();
        this.item.lossEvent = new LossEventDto();
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(lossEventId: number): void {
        this._lossEventsServiceProxy.getLossEventForView(lossEventId).subscribe(result => {
            this.item = result;
            this.active = true;
        });
    }
}
