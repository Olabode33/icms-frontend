import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { KeyRiskIndicatorsServiceProxy, GetKeyRiskIndicatorForViewDto, KeyRiskIndicatorDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './view-keyRiskIndicator.component.html',
    animations: [appModuleAnimation()]
})
export class ViewKeyRiskIndicatorComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    item: GetKeyRiskIndicatorForViewDto;


    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
         private _keyRiskIndicatorsServiceProxy: KeyRiskIndicatorsServiceProxy
    ) {
        super(injector);
        this.item = new GetKeyRiskIndicatorForViewDto();
        this.item.keyRiskIndicator = new KeyRiskIndicatorDto();        
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(keyRiskIndicatorId: number): void {
      this._keyRiskIndicatorsServiceProxy.getKeyRiskIndicatorForView(keyRiskIndicatorId).subscribe(result => {      
                 this.item = result;
                this.active = true;
            });       
    }
}
