import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { KeyRiskIndicatorsServiceProxy, CreateOrEditKeyRiskIndicatorDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { KeyRiskIndicatorExceptionTypeLookupTableModalComponent } from './keyRiskIndicator-exceptionType-lookup-table-modal.component';
import { KeyRiskIndicatorUserLookupTableModalComponent } from './keyRiskIndicator-user-lookup-table-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {Observable} from "@node_modules/rxjs";


@Component({
    templateUrl: './create-or-edit-keyRiskIndicator.component.html',
    animations: [appModuleAnimation()]
})
export class CreateOrEditKeyRiskIndicatorComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
        @ViewChild('keyRiskIndicatorExceptionTypeLookupTableModal', { static: true }) keyRiskIndicatorExceptionTypeLookupTableModal: KeyRiskIndicatorExceptionTypeLookupTableModalComponent;
    @ViewChild('keyRiskIndicatorUserLookupTableModal', { static: true }) keyRiskIndicatorUserLookupTableModal: KeyRiskIndicatorUserLookupTableModalComponent;
    @ViewChild('keyRiskIndicatorUserLookupTableModal2', { static: true }) keyRiskIndicatorUserLookupTableModal2: KeyRiskIndicatorUserLookupTableModalComponent;

    keyRiskIndicator: CreateOrEditKeyRiskIndicatorDto = new CreateOrEditKeyRiskIndicatorDto();

    exceptionTypeCode = '';
    userName = '';
    staffs = [];


    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,        
        private _keyRiskIndicatorsServiceProxy: KeyRiskIndicatorsServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(keyRiskIndicatorId?: number): void {

        if (!keyRiskIndicatorId) {
            this.keyRiskIndicator = new CreateOrEditKeyRiskIndicatorDto();
            this.keyRiskIndicator.id = keyRiskIndicatorId;
            this.exceptionTypeCode = '';
            this.userName = '';

            this.active = true;
        } else {
            this._keyRiskIndicatorsServiceProxy.getKeyRiskIndicatorForEdit(keyRiskIndicatorId).subscribe(result => {
                this.keyRiskIndicator = result.keyRiskIndicator;

                this.exceptionTypeCode = result.exceptionTypeCode;
                this.userName = result.userName;

                this.active = true;
            });
        }
        
    }

    private saveInternal(): Observable<void> {
            this.saving = true;
            
        
        return this._keyRiskIndicatorsServiceProxy.createOrEdit(this.keyRiskIndicator)
         .pipe(finalize(() => { 
            this.saving = false;               
            this.notify.info(this.l('SavedSuccessfully'));
         }));
    }
    
    save(): void {
        this.saveInternal().subscribe(x => {
             this._router.navigate( ['/app/main/keyRiskIndicators/keyRiskIndicators']);
        })
    }
    
    saveAndNew(): void {
        this.saveInternal().subscribe(x => {
            this.keyRiskIndicator = new CreateOrEditKeyRiskIndicatorDto();
        })
    }

    openSelectExceptionTypeModal() {
        this.keyRiskIndicatorExceptionTypeLookupTableModal.id = this.keyRiskIndicator.exceptionTypeId;
        this.keyRiskIndicatorExceptionTypeLookupTableModal.displayName = this.exceptionTypeCode;
        this.keyRiskIndicatorExceptionTypeLookupTableModal.show();
    }
    openSelectUserModal() {
        this.keyRiskIndicatorUserLookupTableModal.id = this.keyRiskIndicator.userId;
        this.keyRiskIndicatorUserLookupTableModal.displayName = this.userName;
        this.keyRiskIndicatorUserLookupTableModal.show();
    }


    openEscalationUserModal() {
        this.keyRiskIndicatorUserLookupTableModal2.show();
    }




    setExceptionTypeIdNull() {
        this.keyRiskIndicator.exceptionTypeId = null;
        this.exceptionTypeCode = '';
    }
    setUserIdNull() {
        this.keyRiskIndicator.userId = null;
        this.userName = '';
    }


    getNewExceptionTypeId() {
        this.keyRiskIndicator.exceptionTypeId = this.keyRiskIndicatorExceptionTypeLookupTableModal.id;
        this.exceptionTypeCode = this.keyRiskIndicatorExceptionTypeLookupTableModal.displayName;
    }
    getNewUserId() {
        this.keyRiskIndicator.userId = this.keyRiskIndicatorUserLookupTableModal.id;
        this.userName = this.keyRiskIndicatorUserLookupTableModal.displayName;


        const staff = {
            id: this.keyRiskIndicatorUserLookupTableModal.id,
            name: this.keyRiskIndicatorUserLookupTableModal.displayName
        }
        this.staffs.push(staff);
    }

    addToArray() {

        const staff = {
            id: this.keyRiskIndicatorUserLookupTableModal2.id,
            name: this.keyRiskIndicatorUserLookupTableModal2.displayName
        }
        this.staffs.push(staff);
    }

}
