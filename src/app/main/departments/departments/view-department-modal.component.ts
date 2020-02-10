import { GetDepartmentForEditOutput, CreateOrEditDepartmentDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDepartmentForViewDto, DepartmentDto, DepartmentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import * as shape from 'd3-shape';
import { OrganizationUnitRisksComponent } from '@app/admin/organization-units/organization-unit-risks.component';
import { IBasicOrganizationUnitInfo } from '@app/admin/organization-units/basic-organization-unit-info';

@Component({
    selector: 'viewDepartmentModal',
    templateUrl: './view-department-modal.component.html'
})
export class ViewDepartmentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('ouRisks', { static: true }) ouRisks: OrganizationUnitRisksComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDepartmentForEditOutput;
    score = Math.floor(Math.random() * (100 - 1 + 1) + 1);

    legend = true;
    legendTitle = '';
    showAxis = true;
    legendPosition = 'right';
    redGreenAmberScheme = {
        domain: ['#f44336', '#4CAF50', '#ffb822']
    };
    greyRedScheme = {
        domain: ['#ECEFF1', '#f44336']
    };
    blueRedScheme = {
        domain: ['#81D4FA', '#f44336']
    };
    blueScheme = {
        domain: ['#81D4FA']
    };
    redScheme = {
        domain: ['#f44336']
    };
    greenScheme = {
        domain: ['#4CAF50']
    };
    curve = shape.curveCatmullRom;
    gaugeUnits = '%';
    casesTimelineData = [];
    caseTimeline = [
        {
            'name': 'Score',
            'series': [
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-06-17T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-07-21T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-08-22T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-09-28T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-10-31T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-11-03T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2019-12-06T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2020-01-07T00:00:00'
                },
                {
                    'value': Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    'name': '2020-02-10T00:00:00'
                }
            ]
        }
    ];

    constructor(
        injector: Injector,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
    ) {
        super(injector);
        this.item = new GetDepartmentForEditOutput();
        this.item.department = new CreateOrEditDepartmentDto();
    }

    show(item?: GetDepartmentForViewDto, itemId = -1): void {
        if (item) {
            this._departmentsServiceProxy.getDepartmentForEdit(item.department.id).subscribe(result => {
                this.item = result;
                this.ouRisks.organizationUnit = <IBasicOrganizationUnitInfo>{
                    id: itemId,
                    displayName: result.department.name
                };
                this.ouRisks.isViewOnly = true;
            });
        } else {
            this._departmentsServiceProxy.getDepartmentForEdit(itemId).subscribe(result => {
                this.item = result;
                this.ouRisks.organizationUnit = <IBasicOrganizationUnitInfo>{
                    id: itemId,
                    displayName: result.department.name
                };
                this.ouRisks.isViewOnly = true;
            });
        }
        this.casesTimelineData = this.prepareTimelineData(this.caseTimeline);

        this.active = true;
        this.modal.show();
    }

    prepareTimelineData(result: { 'name': string; 'series': { 'value': number; 'name': string }[] }[]): any {
        let timeline = new Array();
        result.forEach(element => {
            let chartDataPoint = { name: '', series: [] };
            chartDataPoint.name = element.name;
            element.series.forEach(elementSeries => {
                let data = {
                    value: elementSeries.value,
                    name: moment(elementSeries.name).format('MMM YY')
                };
                chartDataPoint.series.push(data);
            });
            timeline.push(chartDataPoint);
        });
        return timeline;
        //console.log(this.casesTimelineData);
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
