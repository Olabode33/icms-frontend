import { Component, OnInit, ViewEncapsulation, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkingPaper } from '@app/UIModel/WorkingPaper';
import { Router } from '@angular/router';
import { OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, DepartmentsServiceProxy, OrganizationUnitDto, WorkspaceServiceProxy, GetExceptionIncidentForViewDto, GetWorkingPaperNewForViewDto, Status, TaskStatus, Frequency, ProcessRisksServiceProxy, GetProcessRiskForViewDto } from '@shared/service-proxies/service-proxies';
import * as shape from 'd3-shape';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';

@Component({
    selector: 'app-dashboard-opRisk',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class OpRiskDashboardComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditExceptionIncidentModal', { static: true }) createOrEditExceptionIncidentModal: CreateOrEditExceptionIncidentModalComponent;

    loadingExceptions = false;
    loadingTask = false;

    workingpapers: WorkingPaper[] = new Array();
    ous: OrganizationUnitDto[] = new Array();
    exceptions: GetExceptionIncidentForViewDto[] = new Array();
    savedWorkingPaper: GetWorkingPaperNewForViewDto[] = new Array();
    newWorkingPaper: GetWorkingPaperNewForViewDto[] = new Array();
    submittedWorkingPaper: GetWorkingPaperNewForViewDto[] = new Array();

    statusEnum = Status;
    frequencyEnum = Frequency;
    taskStatusEnum = TaskStatus;

    // options
    legend = true;
    showLabels = true;
    animations = true;
    xAxis = false;
    yAxis = true;
    showYAxisLabel = false;
    showXAxisLabel = false;
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
        domain: ['#f44336', '#4CAF50', '#FFC107', '#7aa3e5', '#a8385d', '#aae3f5']
    };
    pieColorScheme = {
        domain: ['#022e64', '#0D47A1', '#1565C0', '#0288D1', '#1E88E5', '#03A9F4', '#42A5F5']
    };
    barColorScheme = {
        domain: ['#022e64']
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

    fakeLossEventByCategory = [
        {
          'name': 'Actual',
          'value': 10
        },
        {
            'name': 'Potential',
            'value': 5
        },
        {
            'name': 'Near Misses',
            'value': 6
        }
    ];

    fakeLossEventByType = [
        {
          'name': 'Internal Fraud',
          'value': 102
        },
        {
            'name': 'External Fraud',
            'value': 71
        },
        {
            'name': 'Employment Practices and Workplace Safety',
            'value': 64
        },
        {
            'name': 'Clients, Products, and Business Practice',
            'value': 29
        },
        {
            'name': 'Damage to Physical Assets',
            'value': 25
        },
        {
            'name': 'Business Disruption and Systems Failures',
            'value': 19
        },
        {
            'name': 'Execution, Delivery, and Process Management',
            'value': 15
        }
    ];

    fakeLossEventByBusinessUnit = [
        {
          'name': 'Branch Operations',
          'value': 102
        },
        {
            'name': 'Internal Controls',
            'value': 71
        },
        {
            'name': 'Internal Audit',
            'value': 64
        },
        {
            'name': 'Finance',
            'value': 29
        },
        {
            'name': 'Treasury',
            'value': 25
        },
        {
            'name': 'Information Technology',
            'value': 19
        }
    ];
    fakeLossEventTrend = [
        {
            'name': 'Actual',
            'series': [
              {
                'value': 37,
                'name': '2020-08-29T16:49:42.248Z'
              },
              {
                'value': 20,
                'name': '2020-08-30T14:29:00.273Z'
              },
              {
                'value': 63,
                'name': '2020-08-31T17:55:19.618Z'
              },
              {
                'value': 27,
                'name': '2020-09-01T08:15:45.226Z'
              },
              {
                'value': 62,
                'name': '2020-09-02T07:06:35.555Z'
              }
            ]
        },
        {
            'name': 'Potential',
            'series': [
              {
                'value': 79,
                'name': '2020-08-29T16:49:42.248Z'
              },
              {
                'value': 24,
                'name': '2020-08-30T14:29:00.273Z'
              },
              {
                'value': 34,
                'name': '2020-08-31T17:55:19.618Z'
              },
              {
                'value': 52,
                'name': '2020-09-01T08:15:45.226Z'
              },
              {
                'value': 23,
                'name': '2020-09-02T07:06:35.555Z'
              }
            ]
        },
        {
            'name': 'Near Misses',
            'series': [
              {
                'value': 48,
                'name': '2020-08-29T16:49:42.248Z'
              },
              {
                'value': 24,
                'name': '2020-08-30T14:29:00.273Z'
              },
              {
                'value': 44,
                'name': '2020-08-31T17:55:19.618Z'
              },
              {
                'value': 12,
                'name': '2020-09-01T08:15:45.226Z'
              },
              {
                'value': 93,
                'name': '2020-09-02T07:06:35.555Z'
              }
            ]
        }
    ];

    processRisks: GetProcessRiskForViewDto[] = new Array();

    constructor(private _router: Router,
        injector: Injector,
        private _ouService: OrganizationUnitServiceProxy,
        private _departmentService: DepartmentsServiceProxy,
        private _workspaceService: WorkspaceServiceProxy,
        private _processRiskSerivceProxy: ProcessRisksServiceProxy
    ) {
        super(injector);
        //_ouService.getOrganizationUnits().subscribe(result => {
        //    this.ous = result.items;
        //});
    }

    ngOnInit() {
        this.getException();
        this.getWorkingPaper();
        this.getProcessRisk();
    }

    getException(): void {
        this.loadingExceptions = true;
        this._workspaceService.getExceptions().subscribe(result => {
            this.exceptions = result.items.filter(x => x.exceptionIncident.status !== Status.Closed);
            this.loadingExceptions = false;
        });
    }

    getWorkingPaper(): void {
        this.loadingTask = true;
        this._workspaceService.getWorkingPapers().subscribe(result => {
            this.savedWorkingPaper = result.items.filter(x => x.workingPaperNew.taskStatus != 3);
            this.newWorkingPaper = result.items.filter(x => x.workingPaperNew.taskStatus != 3);
            this.submittedWorkingPaper = result.items;
            this.loadingTask = false;
        });
    }

    getProcessRisk(): void {
        this.loadingExceptions = true;
        this._processRiskSerivceProxy.getAll('', '', '', '', -1, '', 0, 1000).subscribe(result => {
            console.log(result);
            this.processRisks = result.items.sort((a, b) => b.residualRiskScore - a.residualRiskScore).slice(0, 10);
        });
    }

    viewException(id: number): void {
        this.createOrEditExceptionIncidentModal.show(id);
    }

    editWorkingPaper(id: string): void {
        this._router.navigate(['/app/main/workingPaperNews/edit', id]);
    }

    viewWorkingPaper(id: string): void {
        this._router.navigate(['/app/main/workingPaperNews', id]);
    }


    OpenDetails(id: number) {
        this._router.navigate(['/app/main/departments/view', id]);
    }

}
