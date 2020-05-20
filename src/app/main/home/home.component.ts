import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkingPaper } from '@app/UIModel/WorkingPaper';
import { Router } from '@angular/router';
import { OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, DepartmentsServiceProxy, OrganizationUnitDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase implements OnInit {


    workingpapers: WorkingPaper[] = new Array();
    ous: OrganizationUnitDto[] = new Array();


    constructor(private _router: Router,
        injector: Injector,
        private _ouService: OrganizationUnitServiceProxy,
        private _departmentService: DepartmentsServiceProxy
    ) {
        super(injector);
        _ouService.getOrganizationUnits().subscribe(result => {
            this.ous = result.items;
        });
    }

    ngOnInit() {


        let itm1: WorkingPaper = {
            Id: 25,
            Score: 18,
            TestingTemplateData: 'Apply resolution to incidence',
            businessUnit: 'Operations',
            Code: '8945869',
            TaskStatus: 'Pending'
        };

        let itm2: WorkingPaper = {
            Id: 30,
            Score: 9,
            TestingTemplateData: 'Minify risk spreading',
            businessUnit: 'Allen Avenue Branch',
            Code: '6986594',
            TaskStatus: 'Pending'
        };
        let itm3: WorkingPaper = {
            Id: 31,
            Score: 6,
            TestingTemplateData: 'Quarantine affected machines',
            businessUnit: 'Maryland Branch',
            Code: '657543',
            TaskStatus: 'Pending'
        };

        this.workingpapers.push(itm1);
        this.workingpapers.push(itm2);
        this.workingpapers.push(itm3);
        this.workingpapers.push({
            Id: 32,
            Score: 9,
            TestingTemplateData: 'Minify risk spreading',
            businessUnit: 'MM2 Branch',
            Code: '6986594',
            TaskStatus: 'Pending'
        });
        this.workingpapers.push({
            Id: 33,
            Score: 18,
            TestingTemplateData: 'Apply resolution to incidence',
            businessUnit: 'Bode Thomas Branch',
            Code: '8945869',
            TaskStatus: 'Pending'
        });
    }



    OpenDetails(id: number) {
        this._router.navigate(['/app/main/departments/view', id]);
    }

}
