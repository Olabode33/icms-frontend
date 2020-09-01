import { ExceptionRemediationTypeEnum } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ExceptionTypesServiceProxy, CreateOrEditExceptionTypeDto, CreateOrEditExceptionTypeColumnDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentUserLookupTableModalComponent } from '@app/main/departments/departments/department-user-lookup-table-modal.component';


@Component({
    selector: 'createOrEditExceptionTypeModal',
    templateUrl: './create-or-edit-exceptionType-modal.component.html'
})
export class CreateOrEditExceptionTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('departmentUserLookupTableModal', { static: true }) departmentUserLookupTableModal: DepartmentUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    columns = [];
    name = '';
    dataType = null;
    dataListId = null;
    escalations = [];

    dataTypes = [
        {
            id: "0", value: "String"
        },
        {
            id: "1", value: "Number"
        },
        {
            id: "2", value: "Date"
        },
        {
            id: "3", value: "Boolean"
        },
        {
            id: "4", value: "Selection"
        }
    ];

    exceptionType: CreateOrEditExceptionTypeDto = new CreateOrEditExceptionTypeDto();

    exceptionRemediationTypeEnum = ExceptionRemediationTypeEnum;

    constructor(
        injector: Injector,
        private _exceptionTypesServiceProxy: ExceptionTypesServiceProxy
    ) {
        super(injector);
    }

    show(exceptionTypeId?: number): void {

        if (!exceptionTypeId) {
            this.exceptionType = new CreateOrEditExceptionTypeDto();
            this.exceptionType.id = exceptionTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._exceptionTypesServiceProxy.getExceptionTypeForEdit(exceptionTypeId).subscribe(result => {
                this.exceptionType = result.exceptionType;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

        this.exceptionType.otherColumns = [];

        this.columns.forEach(x => {
            var item = new CreateOrEditExceptionTypeColumnDto();
            item.dataType = x.dataType;
            item.name = x.name;
            item.required = true;

            this.exceptionType.otherColumns.push(item);
        });
			
            this._exceptionTypesServiceProxy.createOrEdit(this.exceptionType)
             .pipe(finalize(() => { this.saving = false;}))
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






    addColumn(): void {
        if (this.columns.find(x => x.name == this.name) != undefined) {
            this.message.info("This column has been added already.");
            return;
        }

        var item = {
            name: this.name, 
            dataType: this.dataType,
            dataTypeName: ''
        };


        item.dataTypeName = this.dataTypes.filter(x => x.id == item.dataType)[0].value;


        //if (item.dataType == "4") {
        //    item.dataListName = this.dataLists.filter(x => x.value == item.dataListId)[0].name;
        //}
        //else {
        //    item.includeOthers = null;
        //    item.selectMultiple = null;
    

        this.columns.push(item);
        this.name = '';
        this.dataType = null;

    }

    removeColumn(item: any): void {
        var index = this.columns.findIndex(x => x == item);
        this.columns.splice(index, 1);
    }

    removeName(item: any): void {
        var index = this.escalations.findIndex(x => x == item);
        this.columns.splice(index, 1);
    }


    addUserToEscalation() {

        var item = {
            id: this.departmentUserLookupTableModal.id,
            name: this.departmentUserLookupTableModal.displayName
        };

        if (this.escalations.filter(x => x.id == item.id).length > 0) {
            this.message.warn("This user has been added already!");
            return;
        }

        this.escalations.push(item);
    }

    openSelectUserModal() {
        this.departmentUserLookupTableModal.show();
    }
}
