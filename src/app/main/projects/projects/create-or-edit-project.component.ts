import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ProjectsServiceProxy, CreateOrEditProjectDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { ProjectOrganizationUnitLookupTableModalComponent } from './project-organizationUnit-lookup-table-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'createOrEditProject',
    templateUrl: './create-or-edit-project.component.html',
    animations: [appModuleAnimation()]
})
export class CreateOrEditProjectComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
        @ViewChild('projectOrganizationUnitLookupTableModal', { static: true }) projectOrganizationUnitLookupTableModal: ProjectOrganizationUnitLookupTableModalComponent;
    @ViewChild('projectOrganizationUnitLookupTableModal2', { static: true }) projectOrganizationUnitLookupTableModal2: ProjectOrganizationUnitLookupTableModalComponent;

    project: CreateOrEditProjectDto = new CreateOrEditProjectDto();

    organizationUnitDisplayName = '';
    organizationUnitDisplayName2 = '';


    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,        
        private _projectsServiceProxy: ProjectsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(projectId?: number): void {

        if (!projectId) {
            this.project = new CreateOrEditProjectDto();
            this.project.id = projectId;
            this.project.reviewType = 0;
            this.project.startDate = moment().startOf('day');
            this.project.endDate = moment().startOf('day');
            this.project.budgetedStartDate = moment().startOf('day');
            this.project.budgetedEndDate = moment().startOf('day');
            this.project.scopeStartDate = moment().startOf('day');
            this.project.scopeEndDate = moment().startOf('day');
            this.organizationUnitDisplayName = '';
            this.organizationUnitDisplayName2 = '';
            this.project.cascade = true;

            this.active = true;
        } else {
            this._projectsServiceProxy.getProjectForEdit(projectId).subscribe(result => {
                this.project = result.project;

                this.organizationUnitDisplayName = result.organizationUnitDisplayName;
                this.organizationUnitDisplayName2 = result.organizationUnitDisplayName2;

                this.active = true;
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._projectsServiceProxy.createOrEdit(this.project)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                 this.notify.success(this.l('SavedSuccessfully'));
                 this._router.navigate(['/app/main/projects/projects']);       
             });
    }

    //openSelectOrganizationUnitModal() {
    //    this.projectOrganizationUnitLookupTableModal.id = this.project.controlUnitId;
    //    this.projectOrganizationUnitLookupTableModal.displayName = this.organizationUnitDisplayName;
    //    this.projectOrganizationUnitLookupTableModal.show();
    //}
    openSelectOrganizationUnitModal2() {
        this.projectOrganizationUnitLookupTableModal2.id = this.project.scopeId;
        this.projectOrganizationUnitLookupTableModal2.displayName = this.organizationUnitDisplayName;
        this.projectOrganizationUnitLookupTableModal2.show(this.project.reviewType);
    }


    setControlUnitIdNull() {
        this.project.controlUnitId = null;
        this.organizationUnitDisplayName = '';
    }
    setScopeIdNull() {
        this.project.scopeId = null;
        this.organizationUnitDisplayName2 = '';
    }


    getNewControlUnitId() {
        this.project.controlUnitId = this.projectOrganizationUnitLookupTableModal.id;
        this.organizationUnitDisplayName = this.projectOrganizationUnitLookupTableModal.displayName;
    }
    getNewScopeId() {
        this.project.scopeId = this.projectOrganizationUnitLookupTableModal2.id;
        this.organizationUnitDisplayName2 = this.projectOrganizationUnitLookupTableModal2.displayName;
    }


}
