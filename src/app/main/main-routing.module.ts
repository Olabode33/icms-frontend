import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeyRiskIndicatorsComponent } from './keyRiskIndicators/keyRiskIndicators/keyRiskIndicators.component';
import { CreateOrEditKeyRiskIndicatorComponent } from './keyRiskIndicators/keyRiskIndicators/create-or-edit-keyRiskIndicator.component';
import { ViewKeyRiskIndicatorComponent } from './keyRiskIndicators/keyRiskIndicators/view-keyRiskIndicator.component';
import { BusinessObjectivesComponent } from './businessObjectives/businessObjectives/businessObjectives.component';
import { WorkingPaperReviewCommentsComponent } from './workingPaperReviewComments/workingPaperReviewComments/workingPaperReviewComments.component';
import { LibraryControlsComponent } from './libraryControls/libraryControls/libraryControls.component';
import { LibraryRisksComponent } from './libraryRisks/libraryRisks/libraryRisks.component';
import { DepartmentRatingHistoryComponent } from './departmentRatingHistory/departmentRatingHistory/departmentRatingHistory.component';
import { RatingsComponent } from './ratings/ratings/ratings.component';
import { ProjectsComponent } from './projects/projects/projects.component';
import { CreateOrEditProjectComponent } from './projects/projects/create-or-edit-project.component';
import { ViewProjectComponent } from './projects/projects/view-project.component';
import { WorkingPaperNewsComponent } from './workingPaperNews/workingPaperNews/workingPaperNews.component';
import { ExceptionIncidentsComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncidents.component';
import { CreateOrEditExceptionIncidentComponent } from './exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident';
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
import { ViewTestingTemplateComponent } from './testingTemplates/view-testingTemplate/view-testingTemplate.component';
import { ViewWorkingPaperComponent } from './workingPaperNews/view-workingPaper/view-workingPaper.component';
import { ViewAuditorComponent } from './departments/_subs/view-auditor/view-auditor.component';
import { CreateWorkingPaperComponent } from './workingPaperNews/create-workingPaper/create-workingPaper.component';
import { PlanningComponent } from './projects/planning/planning.component';
import { DepartmentRatingListComponent } from './departments/rating/departmentRatingList.component';
import { OpRiskHomeComponent } from './opRisk/home/home.component';
import { OpRiskDashboardComponent } from './opRisk/dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ViewProcessComponent } from './departments/_subs/view-process/view-process.component';
import { LossTypeColumnsComponent } from './lossEvents/lossTypeColumns/lossTypeColumns.component';
import { LossEventsComponent } from './lossEvents/lossEvents.component';
import { CreateOrEditLossEventComponent } from './lossEvents/create-or-edit-lossEvent.component';
import { ViewLossEventComponent } from './lossEvents/view-lossEvent.component';
import { CreateOrEditTestingTemplateModalComponent } from './testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'keyRiskIndicators/keyRiskIndicators', component: KeyRiskIndicatorsComponent, data: { permission: 'Pages.KeyRiskIndicators' }  },
                    { path: 'keyRiskIndicators/keyRiskIndicators/createOrEdit', component: CreateOrEditKeyRiskIndicatorComponent, data: { permission: 'Pages.KeyRiskIndicators.Create' }  },
                    { path: 'keyRiskIndicators/keyRiskIndicators/view', component: ViewKeyRiskIndicatorComponent, data: { permission: 'Pages.KeyRiskIndicators' }  },
                    { path: 'businessObjectives/businessObjectives', component: BusinessObjectivesComponent, data: { permission: 'Pages.BusinessObjectives' }  },
                    { path: 'workingPaperReviewComments/workingPaperReviewComments', component: WorkingPaperReviewCommentsComponent, data: { permission: 'Pages.WorkingPaperReviewComments' }  },
                    { path: 'libraryControls/libraryControls', component: LibraryControlsComponent, data: { permission: 'Pages.LibraryControls' }  },
                    { path: 'libraryRisks/libraryRisks', component: LibraryRisksComponent, data: { permission: 'Pages.LibraryRisks' }  },
                    { path: 'projects/planning', component: PlanningComponent, data: { permission: 'Pages.Projects' }  },
                    { path: 'departmentRatingHistory/departmentRatingHistory', component: DepartmentRatingHistoryComponent, data: { permission: 'Pages.DepartmentRatingHistory' }  },
                    { path: 'ratings/ratings', component: RatingsComponent, data: { permission: 'Pages.Ratings' }  },
                    { path: 'departmentRatingList/departmentRatingList', component: DepartmentRatingListComponent, data: { permission: 'Pages.Ratings' }  },
                    { path: 'projects/projects', component: ProjectsComponent, /*data: { permission: 'Pages.Projects' } */ },
                    { path: 'projects/projects/createOrEdit', component: CreateOrEditProjectComponent, data: { permission: 'Pages.Projects.Create' }  },
                    { path: 'projects/projects/view', component: ViewProjectComponent, /*data: { permission: 'Pages.Projects' } */ },
                    { path: 'workingPaperNews/workingPaperNews', component: WorkingPaperNewsComponent, data: { permission: 'Pages.WorkingPaperNews' }  },
                    { path: 'workingPaperNews/:workingPaperId', component: ViewWorkingPaperComponent, data: { permission: 'Pages.WorkingPaperNews' }  },
                    { path: 'workingPaperNews/new/:testingTemplateId/:departmentId', component: CreateWorkingPaperComponent, data: { permission: 'Pages.WorkingPaperNews' }  },
                    { path: 'workingPaperNews/edit/:workingPaperId', component: CreateWorkingPaperComponent, data: { permission: 'Pages.WorkingPaperNews' }  },
                    { path: 'exceptionIncidents/exceptionIncidents', component: ExceptionIncidentsComponent, data: { permission: 'Pages.ExceptionIncidents' }  },
                    { path: 'exceptionIncidents/exceptionIncidents/createOrEdit', component: CreateOrEditExceptionIncidentComponent, data: { permission: 'Pages.ExceptionIncidents' }  },
                    { path: 'testingTemplates/testingTemplates', component: TestingTemplatesComponent, data: { permission: 'Pages.TestingTemplates' }  },
                    { path: 'testingTemplates/createOrEdit', component: CreateOrEditTestingTemplateModalComponent, data: { permission: 'Pages.TestingTemplates' }  },
                    { path: 'testingTemplates/:testingTemplateId', component: ViewTestingTemplateComponent, data: { permission: 'Pages.TestingTemplates' }  },
                    { path: 'departmentRiskControls/departmentRiskControls', component: DepartmentRiskControlsComponent, data: { permission: 'Pages.DepartmentRiskControls' }  },
                    { path: 'departmentRisks/departmentRisks', component: DepartmentRisksComponent, data: { permission: 'Pages.DepartmentRisks' }  },
                    { path: 'departments/departments', component: DepartmentsComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'departments/view/:departmentId', component: ViewOrganizationUnitComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'auditor/view/:departmentId', component: ViewAuditorComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'dataLists/dataLists', component: DataListsComponent, data: { permission: 'Pages.DataLists' }  },
                    { path: 'exceptionTypes/exceptionTypes', component: ExceptionTypesComponent, data: { permission: 'Pages.ExceptionTypes' }  },
                    { path: 'controls/controls', component: ControlsComponent, data: { permission: 'Pages.Controls' }  },
                    { path: 'risks/risks', component: RisksComponent, data: { permission: 'Pages.Risks' }  },
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'workpaperdetail', component: WorkingpaperComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'home/oprisk', component: OpRiskHomeComponent, data: { permission: 'Pages.HomePage'} },
                    { path: 'dashboard/oprisk', component: OpRiskDashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'landing', component: LandingPageComponent, data: { permission: 'Pages.HomePage'} },
                    { path: 'process/view/:processId', component: ViewProcessComponent, data: { permission: 'Pages.Departments' }  },
                    { path: 'lossEvents/columns', component: LossTypeColumnsComponent, /*data: { permission: 'Pages.Projects' } */ },
                    { path: 'lossEvents', component: LossEventsComponent, /*data: { permission: 'Pages.Projects' } */ },
                    { path: 'lossEvents/createOrEdit', component: CreateOrEditLossEventComponent, data: { permission: 'Pages.Projects.Create' }  },
                    { path: 'lossEvents/view', component: ViewLossEventComponent, /*data: { permission: 'Pages.Projects' } */ },
                    { path: 'home', component: HomeComponent, data: { permission: 'Pages.HomePage'} },
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
