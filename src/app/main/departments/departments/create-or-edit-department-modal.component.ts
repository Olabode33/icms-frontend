import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DepartmentsServiceProxy, CreateOrEditDepartmentDto, OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DepartmentUserLookupTableModalComponent } from './department-user-lookup-table-modal.component';
import { DepartmentOrganizationUnitLookupTableModalComponent } from './department-organizationUnit-lookup-table-modal.component';

@Component({
    selector: 'createOrEditDepartmentModal',
    templateUrl: './create-or-edit-department-modal.component.html'
})
export class CreateOrEditDepartmentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('departmentUserLookupTableModal', { static: true }) departmentUserLookupTableModal: DepartmentUserLookupTableModalComponent;
    @ViewChild('departmentUserLookupTableModal2', { static: true }) departmentUserLookupTableModal2: DepartmentUserLookupTableModalComponent;
    @ViewChild('departmentOrganizationUnitLookupTableModal', { static: true }) departmentOrganizationUnitLookupTableModal: DepartmentOrganizationUnitLookupTableModalComponent;
    @ViewChild('departmentOrganizationUnitLookupTableModal2', { static: true }) departmentOrganizationUnitLookupTableModal2: DepartmentOrganizationUnitLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() unitCreated: EventEmitter<any> = new EventEmitter<any>();
    @Output() unitUpdated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();

    active = false;
    saving = false;

    department: CreateOrEditDepartmentDto = new CreateOrEditDepartmentDto();

    userName = '';
    userName2 = '';
    organizationUnitDisplayName = '';
    supervisingTeamtDisplayName = '';


    constructor(
        injector: Injector,
        private _departmentsServiceProxy: DepartmentsServiceProxy
    ) {
        super(injector);
    }

    show(departmentId?: number,parentId?: number): void {

        if (!departmentId) {
            this.department = new CreateOrEditDepartmentDto();
            this.department.id = departmentId;
            this.department.supervisingUnitId = parentId;
            this.userName = '';
            this.userName2 = '';
            this.organizationUnitDisplayName = '';
            this.department.isControlTeam = false;
            this.active = true;
            this.modal.show();
        } else {
            this._departmentsServiceProxy.getDepartmentForEdit(departmentId).subscribe(result => {
                this.department = result.department;

                this.userName = result.userName;
                this.userName2 = result.userName2;
                this.organizationUnitDisplayName = result.organizationUnitDisplayName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._departmentsServiceProxy.createOrEdit(this.department)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                 this.close();
                 this.unitCreated.emit(null);
            //    this.modalSave.emit(null);
             });
    }

    openSelectUserModal() {
        this.departmentUserLookupTableModal.id = this.department.supervisorUserId;
        this.departmentUserLookupTableModal.displayName = this.userName;
        this.departmentUserLookupTableModal.show();
    }
    openSelectUserModal2() {
        this.departmentUserLookupTableModal2.id = this.department.controlOfficerUserId;
        this.departmentUserLookupTableModal2.displayName = this.userName;
        this.departmentUserLookupTableModal2.show();
    }
    openSelectOrganizationUnitModal() {
        this.departmentOrganizationUnitLookupTableModal.id = this.department.controlTeamId;
        this.departmentOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
        this.departmentOrganizationUnitLookupTableModal.show();
    }

    openSelectOrganizationUnitModal2() {
        this.departmentOrganizationUnitLookupTableModal.id = this.department.supervisingUnitId;
        this.departmentOrganizationUnitLookupTableModal.displayName = this.supervisingTeamtDisplayName;
        this.departmentOrganizationUnitLookupTableModal2.show();
    }



    setSupervisorUserIdNull() {
        this.department.supervisorUserId = null;
        this.userName = '';
    }




    setControlOfficerUserIdNull() {
        this.department.controlOfficerUserId = null;
        this.userName2 = '';
    }
    setControlTeamIdNull() {
        this.department.controlTeamId = null;
        this.organizationUnitDisplayName = '';
    }

    setSupervisingTeamIdNull() {
        this.department.controlTeamId = null;
        this.supervisingTeamtDisplayName = '';
    }


    getNewSupervisorUserId() {
        this.department.supervisorUserId = this.departmentUserLookupTableModal.id;
        this.userName = this.departmentUserLookupTableModal.displayName;
    }
    getNewControlOfficerUserId() {
        this.department.controlOfficerUserId = this.departmentUserLookupTableModal2.id;
        this.userName2 = this.departmentUserLookupTableModal2.displayName;
    }
    getNewControlTeamId() {
        this.department.controlTeamId = this.departmentOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.departmentOrganizationUnitLookupTableModal.displayName;
    }

    getNewSupervisingTeamId() {
        this.department.supervisingUnitId = this.departmentOrganizationUnitLookupTableModal2.id;
        this.supervisingTeamtDisplayName = this.departmentOrganizationUnitLookupTableModal2.displayName;
    }
    


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
