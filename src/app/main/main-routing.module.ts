import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExceptionIncidentsComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncidents.component';
import { TestingTemplatesComponent } from './testingTemplates/testingTemplates/testingTemplates.component';
import { DepartmentRiskControlsComponent } from './departmentRiskControls/departmentRiskControls/departmentRiskControls.component';
import { DepartmentRisksComponent } from './departmentRisks/departmentRisks/departmentRisks.component';
import { DepartmentsComponent } from './departments/departments/departments.component';
import { DataListsComponent } from './dataLists/dataLists/dataLists.component';
import { ExceptionTypesComponent } from './exceptionTypes/exceptionTypes/exceptionTypes.component';
import { ControlsComponent } from './controls/controls/controls.component';
import { RisksComponent } from './risks/risks/risks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ViewOrganizationUnitComponent } from './departments/_subs/view-organization-unit/view-organization-unit.component';
import { WorkingpaperComponent } from './workingpaper/workingpaper.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'exceptionIncidents/exceptionIncidents', component: ExceptionIncidentsComponent, data: { permission: 'Pages.ExceptionIncidents' }  },
                    { path: 'testingTemplates/testingTemplates', component: TestingTemplatesComponent, data: { permission: 'Pages.TestingTemplates' }  },
                    { path: 'departmentRiskControls/departmentRiskControls', component: DepartmentRiskControlsComponent, data: { permission: 'Pages.DepartmentRiskControls' }  },
                    { path: 'departmentRisks/departmentRisks', component: DepartmentRisksComponent, data: { permission: 'Pages.DepartmentRisks' }  },
                    { path: 'departments/departments', component: DepartmentsComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'departments/view/:departmentId', component: ViewOrganizationUnitComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'dataLists/dataLists', component: DataListsComponent, data: { permission: 'Pages.DataLists' }  },
                    { path: 'exceptionTypes/exceptionTypes', component: ExceptionTypesComponent, data: { permission: 'Pages.ExceptionTypes' }  },
                    { path: 'controls/controls', component: ControlsComponent, data: { permission: 'Pages.Controls' }  },
                    { path: 'risks/risks', component: RisksComponent, data: { permission: 'Pages.Risks' }  },
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'workpaperdetail', component: WorkingpaperComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'home', component: HomeComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: '', redirectTo: 'home', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
