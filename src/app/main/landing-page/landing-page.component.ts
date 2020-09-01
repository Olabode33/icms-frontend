import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { OrganizationUnitServiceProxy, DepartmentsServiceProxy, WorkspaceServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class LandingPageComponent extends AppComponentBase implements OnInit {

    constructor(private _router: Router,
        injector: Injector,
        private _ouService: OrganizationUnitServiceProxy,
        private _departmentService: DepartmentsServiceProxy,
        private _workspaceService: WorkspaceServiceProxy
    ) {
        super(injector);
        //_ouService.getOrganizationUnits().subscribe(result => {
        //    this.ous = result.items;
        //});
    }

  ngOnInit() {
  }

}
