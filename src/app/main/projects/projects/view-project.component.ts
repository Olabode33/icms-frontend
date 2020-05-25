import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProjectsServiceProxy, GetProjectForViewDto, ProjectDto, CreateOrEditProjectDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'viewProject',
    templateUrl: './view-project.component.html',
    animations: [appModuleAnimation()]
})
export class ViewProjectComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    item: GetProjectForViewDto;
    project: CreateOrEditProjectDto = new CreateOrEditProjectDto();

    organizationUnitDisplayName = '';
    organizationUnitDisplayName2 = '';

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
         private _projectsServiceProxy: ProjectsServiceProxy
    ) {
        super(injector);
        this.item = new GetProjectForViewDto();
        this.item.project = new ProjectDto();
    }

    ngOnInit(): void {
        this.show(this._activatedRoute.snapshot.queryParams['id']);
    }

    show(projectId: number): void {
        this._projectsServiceProxy.getProjectForEdit(projectId).subscribe(result => {
            this.project = result.project;

            this.organizationUnitDisplayName = result.organizationUnitDisplayName;
            this.organizationUnitDisplayName2 = result.organizationUnitDisplayName2;

            this.active = true;
        });
    }
}
