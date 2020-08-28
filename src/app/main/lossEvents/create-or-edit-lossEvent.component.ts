import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LossEventsServiceProxy, CreateOrEditLossEventDto, Status, LossTypeColumnsServiceProxy, LossTypeColumnDto, DataTypes } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { LossEventUserLookupTableModalComponent } from './lossEvent-user-lookup-table-modal.component';
import { LossEventOrganizationUnitLookupTableModalComponent } from './lossEvent-organizationUnit-lookup-table-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Observable } from 'rxjs';


@Component({
    templateUrl: './create-or-edit-lossEvent.component.html',
    animations: [appModuleAnimation()]
})
export class CreateOrEditLossEventComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
    @ViewChild('lossEventUserLookupTableModal', { static: true }) lossEventUserLookupTableModal: LossEventUserLookupTableModalComponent;
    @ViewChild('lossEventOrganizationUnitLookupTableModal', { static: true }) lossEventOrganizationUnitLookupTableModal: LossEventOrganizationUnitLookupTableModalComponent;

    lossEvent: CreateOrEditLossEventDto = new CreateOrEditLossEventDto();
    lossTypeColumn: {lossType: LossTypeColumnDto, value: string}[] = new Array();

    userName = '';
    organizationUnitDisplayName = '';

    dataTypeEnum = DataTypes;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _lossEventsServiceProxy: LossEventsServiceProxy,
        private _lossTypeColumnServiceProxy: LossTypeColumnsServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(lossEventId?: number): void {

        if (!lossEventId) {
            this.lossEvent = new CreateOrEditLossEventDto();
            this.lossEvent.id = lossEventId;
            this.lossEvent.dateOccured = moment().startOf('day');
            this.lossEvent.dateDiscovered = moment().startOf('day');
            this.lossEvent.status = Status.Open;
            this.userName = '';
            this.organizationUnitDisplayName = '';

            this.active = true;
        } else {
            this._lossEventsServiceProxy.getLossEventForEdit(lossEventId).subscribe(result => {
                this.lossEvent = result.lossEvent;

                this.userName = result.userName;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;

                this.active = true;
            });
        }

    }

    getAdditionalColumn(): void {
        this._lossTypeColumnServiceProxy.getColumnsForLossType(this.lossEvent.lossType).subscribe(result => {
            this.lossTypeColumn = Array.from(new Set(result.map((i) => {
                return {lossType: i, value: ''};
            })));
        });
    }

    private saveInternal(): Observable<void> {
        this.saving = true;

        let customData = Array.from(new Set(this.lossTypeColumn.map((i) => {
            let map = new Map();
            return map.set(i.lossType.columnName, i.value);
        })));

        this.lossEvent.extensionData = JSON.stringify([...customData]);
        console.log(this.lossEvent.extensionData);

        return this._lossEventsServiceProxy.createOrEdit(this.lossEvent)
            .pipe(finalize(() => {
                this.saving = false;
                this.message.info(this.l('SavedSuccessfully'));
            }));
    }

    save(): void {
        this.saveInternal().subscribe(x => {
            this._router.navigate(['/app/main/lossEvents']);
        });
    }

    saveAndNew(): void {
        this.saveInternal().subscribe(x => {
            this.lossEvent = new CreateOrEditLossEventDto();
        });
    }

    openSelectUserModal() {
        this.lossEventUserLookupTableModal.id = this.lossEvent.employeeUserId;
        this.lossEventUserLookupTableModal.displayName = this.userName;
        this.lossEventUserLookupTableModal.show();
    }
    openSelectOrganizationUnitModal() {
        this.lossEventOrganizationUnitLookupTableModal.id = this.lossEvent.departmentId;
        this.lossEventOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.lossEventOrganizationUnitLookupTableModal.show();
    }


    setEmployeeUserIdNull() {
        this.lossEvent.employeeUserId = null;
        this.userName = '';
    }
    setDepartmentIdNull() {
        this.lossEvent.departmentId = null;
        this.organizationUnitDisplayName = '';
    }


    getNewEmployeeUserId() {
        this.lossEvent.employeeUserId = this.lossEventUserLookupTableModal.id;
        this.userName = this.lossEventUserLookupTableModal.displayName;
    }
    getNewDepartmentId() {
        this.lossEvent.departmentId = this.lossEventOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.lossEventOrganizationUnitLookupTableModal.displayName;
    }


}
