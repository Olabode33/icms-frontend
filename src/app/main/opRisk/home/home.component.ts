import { Component, OnInit, ViewEncapsulation, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkingPaper } from '@app/UIModel/WorkingPaper';
import { Router } from '@angular/router';
import { OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, DepartmentsServiceProxy, OrganizationUnitDto, WorkspaceServiceProxy, GetExceptionIncidentForViewDto, GetWorkingPaperNewForViewDto, Status, TaskStatus, Frequency, ProcessRisksServiceProxy, GetProcessRiskForViewDto } from '@shared/service-proxies/service-proxies';
import * as shape from 'd3-shape';
import { CreateOrEditExceptionIncidentModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';

@Component({
    selector: 'app-home-opRisk',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class OpRiskHomeComponent extends AppComponentBase implements OnInit {

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
          'value': 10
        },
        {
            'name': 'External Fraud',
            'value': 7
        },
        {
            'name': 'Employment Practices and Workplace Safety',
            'value': 6
        },
        {
            'name': 'Clients, Products, and Business Practice',
            'value': 2
        },
        {
            'name': 'Damage to Physical Assets',
            'value': 2
        },
        {
            'name': 'Business Disruption and Systems Failures',
            'value': 1
        },
        {
            'name': 'Execution, Delivery, and Process Management',
            'value': 1
        }
    ];

    processRisk: GetProcessRiskForViewDto[] = new Array();

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
            var icms = result.items;
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
