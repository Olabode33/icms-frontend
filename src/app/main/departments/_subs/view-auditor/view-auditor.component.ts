import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditDepartmentDto, DepartmentsServiceProxy, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as shape from 'd3-shape';

@Component({
    selector: 'app-view-auditor',
    templateUrl: './view-auditor.component.html',
    styleUrls: ['./view-auditor.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ViewAuditorComponent extends AppComponentBase implements OnInit {

    _organizationUnitId = -1;
    department: CreateOrEditDepartmentDto = new CreateOrEditDepartmentDto();
    userName = '';
    userName2 = '';
    organizationUnitDisplayName = '';
    supervisingTeamtDisplayName = '';

    lastReview: { name: string, by: string, date: string, status: string, score: number }[] = new Array();
    fakeExceptions: { type: string, by: string, date: string, severity: string, state: string, status: string }[] = new Array();

    colorScheme = {
        domain: ['#f44336', '#4CAF50', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

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

    deliveryEffectiveness = [
        {
            'name': 'Not on-time',
            'value': 99
        },
        {
            'name': 'On-time',
            'value': 200
        }
    ];

    constructor(
        injector: Injector,
        private _location: Location,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        this.lastReview = [
            {
                name: 'Completed review - Apply resolution to incidence',
                by: 'Adekunle Cranel',
                date: 'May 5, 2020',
                status: 'N/A',
                score: 0.88
            },
            {
                name: 'Resolved exception - Amount on ticket does not match',
                by: 'Fadugba Ogunusi',
                date: 'May 4, 2020',
                status: 'Approved',
                score: 0.91
            },
            {
                name: 'Completed review - Quarantine affected machines',
                by: 'James Olukayode',
                date: 'April 30, 2020',
                status: 'Approved',
                score: 0.78
            },
            {
                name: 'Additional security arrangements exist ',
                by: 'Babalola Ayobami',
                date: 'April 29, 2020',
                status: 'Approved',
                score: 0.62
            },
            {
                name: 'Call over of transactions posted on Finacle',
                by: 'Babalola Ayobami',
                date: 'April 27, 2020',
                status: 'Approved',
                score: 0.92
            },
            {
                name: 'Biometric verification',
                by: 'Chukwuma Emeka',
                date: 'April 27, 2020',
                status: 'Approved',
                score: 0.8
            },
        ];
        this.fakeExceptions = [
            {
                type: 'Amount on ticket does not match',
                by: 'Adekunle Cranel',
                date: 'May 5, 2020',
                severity: 'High',
                state: 'Pending Resolution',
                status: 'Open'
            },
            {
                type: 'Income leakage',
                by: 'Fadugba Ogunusi',
                date: 'May 3, 2020',
                severity: 'High',
                state: 'Escalated',
                status: 'Open'
            },
            {
                type: 'CCTV not working',
                by: 'James Olukayode',
                date: 'May 3, 2020',
                severity: 'Low',
                state: 'Pending Closure',
                status: 'Open'
            },
            {
                type: 'Transaction fees not collected',
                by: 'Adekunle Cranel',
                date: 'May 2, 2020',
                severity: 'Medium',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Inappropriate Access to Assets',
                by: 'Babalola Ayobami',
                date: 'May 1, 2020',
                severity: 'High',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Control Override',
                by: 'Chukwuma Emeka',
                date: 'May 1, 2020',
                severity: 'Low',
                state: 'Closed',
                status: 'Closed'
            },
            {
                type: 'Amount on ticket does not match',
                by: 'Fatima Abdul',
                date: 'May 1, 2020',
                severity: 'Medium',
                state: 'Closed',
                status: 'Closed'
            },
        ];
    }

    ngOnInit() {
    }

    getDepartmentDetails(): void {
        this._departmentsServiceProxy.getDepartmentForEdit(this._organizationUnitId).subscribe(result => {
            console.log(result);
            this.department = result.department;
            this.userName = result.userName;
            this.userName2 = result.userName2;
            this.organizationUnitDisplayName = result.organizationUnitDisplayName;

        });
    }

    goBack(): void {
        this._location.back();
    }

}
