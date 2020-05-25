import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkingPaper } from '@app/UIModel/WorkingPaper';
import { Router } from '@angular/router';
import { OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, DepartmentsServiceProxy, OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import * as shape from 'd3-shape';

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

    // options
    legend = true;
    showLabels = true;
    animations = true;
    xAxis = true;
    yAxis = false;
    showYAxisLabel = false;
    showXAxisLabel = true;
    xAxisLabel = true;
    yAxisLabel = true;
    view: any[] = [700, 500];
    closedCurve: any = shape.curveLinearClosed;
    labelTrim = false;
    showGridLines = true;
    rangeFillOpacity = 0.7;

    explodeSlices = true;
    doughnut = true;
    arcWidth = 0.25;

    colorScheme = {
        domain: ['#f44336', '#4CAF50', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    multi = [
        {
            'name': '',
            'series': [
                {
                    'name': 'Quality',
                    'value': '90'
                },
                {
                    'name': 'Timeliness',
                    'value': '75'
                },
                {
                    'name': 'Accuracy',
                    'value': '60'
                },
                {
                    'name': 'Auditee feedback',
                    'value': '83'
                },
                {
                    'name': 'Reviewer feedback',
                    'value': '79'
                }
            ]
        }


    ];


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
