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
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { DepartmentRiskRiskLookupTableModalComponent } from '@app/main/departmentRisks/departmentRisks/departmentRisk-risk-lookup-table-modal.component';
import { CreateOrEditRiskModalComponent } from '@app/main/risks/risks/create-or-edit-risk-modal.component';


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
    @ViewChild('departmentRiskRiskLookupTableModal', { static: true }) departmentRiskRiskLookupTableModal: DepartmentRiskRiskLookupTableModalComponent;
    @ViewChild('createOrEditRiskModal', { static: true }) createOrEditRiskModal: CreateOrEditRiskModalComponent;

    keyRiskIndicator: CreateOrEditKeyRiskIndicatorDto = new CreateOrEditKeyRiskIndicatorDto();

    exceptionTypeCode = '';
    userName = '';
    riskName = '';
    staffs = [];

    curve = shape.curveCatmullRom;
    colorScheme = {
        domain: ['#e57373']
    };
    lineChartData = [
        {
            name: 'Exception Trend',
            series: [
                { value: 28, name: '2020-Sept-1' },
                { value: 61, name: '2020-Sept-2' },
                { value: 34, name: '2020-Sept-3' },
                { value: 44, name: '2020-Sept-4' },
                { value: 75, name: '2020-Sept-5' },
                { value: 20, name: '2020-Sept-6' },
                { value: 61, name: '2020-Sept-7' }
            ]
        }
    ];


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
            this.message.info(this.l('SavedSuccessfully'));
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

    openSelectRiskModal() {
        this.departmentRiskRiskLookupTableModal.id = this.keyRiskIndicator.riskId;
        this.departmentRiskRiskLookupTableModal.displayName = this.riskName;
        this.departmentRiskRiskLookupTableModal.show();
    }



    setRiskIdNull() {
        this.keyRiskIndicator.riskId = null;
        this.riskName = '';
    }

    addNewRisk() {
        this.createOrEditRiskModal.show();
    }

    getNewRiskId() {
        this.keyRiskIndicator.riskId = this.departmentRiskRiskLookupTableModal.id;
        this.riskName = this.departmentRiskRiskLookupTableModal.displayName;
        //this.getRiskDetails(this.departmentRisk.riskId);
    }

    saveNewRiskId(event: any) {
        this.keyRiskIndicator.riskId = event.value;
        this.riskName = event.name;
        //this.getRiskDetails(this.departmentRisk.riskId);
    }


}
