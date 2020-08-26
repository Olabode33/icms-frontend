import { ViewProcessComponent } from './departments/_subs/view-process/view-process.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { LibraryControlsComponent } from './libraryControls/libraryControls/libraryControls.component';
import { ViewLibraryControlModalComponent } from './libraryControls/libraryControls/view-libraryControl-modal.component';
import { CreateOrEditLibraryControlModalComponent } from './libraryControls/libraryControls/create-or-edit-libraryControl-modal.component';

import { LibraryRisksComponent } from './libraryRisks/libraryRisks/libraryRisks.component';
import { ViewLibraryRiskModalComponent } from './libraryRisks/libraryRisks/view-libraryRisk-modal.component';
import { CreateOrEditLibraryRiskModalComponent } from './libraryRisks/libraryRisks/create-or-edit-libraryRisk-modal.component';

import { DepartmentRatingHistoryComponent } from './departmentRatingHistory/departmentRatingHistory/departmentRatingHistory.component';
import { ViewDepartmentRatingModalComponent } from './departmentRatingHistory/departmentRatingHistory/view-departmentRating-modal.component';
import { CreateOrEditDepartmentRatingModalComponent } from './departmentRatingHistory/departmentRatingHistory/create-or-edit-departmentRating-modal.component';
import { DepartmentRatingOrganizationUnitLookupTableModalComponent } from './departmentRatingHistory/departmentRatingHistory/departmentRating-organizationUnit-lookup-table-modal.component';
import { DepartmentRatingRatingLookupTableModalComponent } from './departmentRatingHistory/departmentRatingHistory/departmentRating-rating-lookup-table-modal.component';

import { RatingsComponent } from './ratings/ratings/ratings.component';
import { ViewRatingModalComponent } from './ratings/ratings/view-rating-modal.component';
import { CreateOrEditRatingModalComponent } from './ratings/ratings/create-or-edit-rating-modal.component';

import { ProjectsComponent } from './projects/projects/projects.component';
import { ViewProjectComponent } from './projects/projects/view-project.component';
import { CreateOrEditProjectComponent } from './projects/projects/create-or-edit-project.component';
import { ProjectOrganizationUnitLookupTableModalComponent } from './projects/projects/project-organizationUnit-lookup-table-modal.component';

import { WorkingPaperNewsComponent } from './workingPaperNews/workingPaperNews/workingPaperNews.component';
import { CreateOrEditWorkingPaperNewModalComponent } from './workingPaperNews/workingPaperNews/create-or-edit-workingPaperNew-modal.component';
import { WorkingPaperNewTestingTemplateLookupTableModalComponent } from './workingPaperNews/workingPaperNews/workingPaperNew-testingTemplate-lookup-table-modal.component';
import { WorkingPaperNewOrganizationUnitLookupTableModalComponent } from './workingPaperNews/workingPaperNews/workingPaperNew-organizationUnit-lookup-table-modal.component';
import { WorkingPaperNewUserLookupTableModalComponent } from './workingPaperNews/workingPaperNews/workingPaperNew-user-lookup-table-modal.component';

import { ExceptionIncidentsComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncidents.component';


import { ViewExceptionIncidentModalComponent } from './exceptionIncidents/exceptionIncidents/view-exceptionIncident-modal.component';
import { CreateOrEditExceptionIncidentModalComponent } from './exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident-modal.component';
import { ExceptionIncidentUserLookupTableModalComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncident-user-lookup-table-modal.component';
import { ExceptionIncidentTestingTemplateLookupTableModalComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncident-testingTemplate-lookup-table-modal.component';
import { ExceptionIncidentOrganizationUnitLookupTableModalComponent } from './exceptionIncidents/exceptionIncidents/exceptionIncident-organizationUnit-lookup-table-modal.component';

import { TestingTemplatesComponent } from './testingTemplates/testingTemplates/testingTemplates.component';
import { ViewTestingTemplateModalComponent } from './testingTemplates/testingTemplates/view-testingTemplate-modal.component';
import { TestingTemplateDepartmentRiskControlLookupTableModalComponent } from './testingTemplates/testingTemplates/testingTemplate-departmentRiskControl-lookup-table-modal.component';

import { DepartmentRiskControlsComponent } from './departmentRiskControls/departmentRiskControls/departmentRiskControls.component';

import { DepartmentRisksComponent } from './departmentRisks/departmentRisks/departmentRisks.component';
import { ViewDepartmentRiskModalComponent } from './departmentRisks/departmentRisks/view-departmentRisk-modal.component';

import { DepartmentsComponent } from './departments/departments/departments.component';
import { ViewDepartmentModalComponent } from './departments/departments/view-department-modal.component';
//import { CreateOrEditDepartmentModalComponent } from './departments/departments/create-or-edit-department-modal.component';
//import { DepartmentUserLookupTableModalComponent } from './departments/departments/department-user-lookup-table-modal.component';
//import { DepartmentOrganizationUnitLookupTableModalComponent } from './departments/departments/department-organizationUnit-lookup-table-modal.component';

import { DataListsComponent } from './dataLists/dataLists/dataLists.component';
import { ViewDataListModalComponent } from './dataLists/dataLists/view-dataList-modal.component';
import { CreateOrEditDataListModalComponent } from './dataLists/dataLists/create-or-edit-dataList-modal.component';

import { ExceptionTypesComponent } from './exceptionTypes/exceptionTypes/exceptionTypes.component';
import { ViewExceptionTypeModalComponent } from './exceptionTypes/exceptionTypes/view-exceptionType-modal.component';
import { CreateOrEditExceptionTypeModalComponent } from './exceptionTypes/exceptionTypes/create-or-edit-exceptionType-modal.component';

import { ControlsComponent } from './controls/controls/controls.component';
import { ViewControlModalComponent } from './controls/controls/view-control-modal.component';
import { CreateOrEditControlModalComponent } from './controls/controls/create-or-edit-control-modal.component';

import { RisksComponent } from './risks/risks/risks.component';
import { ViewRiskModalComponent } from './risks/risks/view-risk-modal.component';
import { CreateOrEditRiskModalComponent } from './risks/risks/create-or-edit-risk-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask'; import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';

import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { HomeComponent } from './home/home.component';
import { ViewOrganizationUnitComponent } from './departments/_subs/view-organization-unit/view-organization-unit.component';
import { WorkingpaperComponent } from './workingpaper/workingpaper.component';
import { ViewTestingTemplateComponent } from './testingTemplates/view-testingTemplate/view-testingTemplate.component';
import { ViewWorkingPaperComponent } from './workingPaperNews/view-workingPaper/view-workingPaper.component';
import { ViewAuditorComponent } from './departments/_subs/view-auditor/view-auditor.component';
import { CreateWorkingPaperComponent } from './workingPaperNews/create-workingPaper/create-workingPaper.component';
import { PlanningComponent } from './projects/planning/planning.component';
import { CreateOrEditExceptionIncidentComponent } from './exceptionIncidents/exceptionIncidents/create-or-edit-exceptionIncident';
import { DepartmentRatingListComponent } from './departments/rating/departmentRatingList.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { OpRiskHomeComponent } from './opRisk/home/home.component';
import { OpRiskDashboardComponent } from './opRisk/dashboard/dashboard.component';

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        FileUploadModule,
        AutoCompleteModule,
        PaginatorModule,
        EditorModule,
        InputMaskModule, TableModule,

        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot()
    ],
    declarations: [
        OpRiskDashboardComponent,
        OpRiskHomeComponent,
        ViewProcessComponent,
        LandingPageComponent,
        LibraryControlsComponent,
        ViewLibraryControlModalComponent, CreateOrEditLibraryControlModalComponent,
        LibraryRisksComponent,
        ViewLibraryRiskModalComponent, CreateOrEditLibraryRiskModalComponent,
        PlanningComponent,
        DepartmentRatingHistoryComponent,
        ViewDepartmentRatingModalComponent, CreateOrEditDepartmentRatingModalComponent,
        DepartmentRatingOrganizationUnitLookupTableModalComponent,
        DepartmentRatingRatingLookupTableModalComponent,
        RatingsComponent,
        ViewRatingModalComponent, CreateOrEditRatingModalComponent,
        ProjectsComponent,
        ViewProjectComponent, CreateOrEditProjectComponent,
        ProjectOrganizationUnitLookupTableModalComponent,
        CreateWorkingPaperComponent,

        ViewAuditorComponent,
        ViewWorkingPaperComponent,
        ViewTestingTemplateComponent,

        WorkingPaperNewsComponent,
        CreateOrEditWorkingPaperNewModalComponent,
        WorkingPaperNewTestingTemplateLookupTableModalComponent,
        WorkingPaperNewOrganizationUnitLookupTableModalComponent,
        WorkingPaperNewUserLookupTableModalComponent,
        ViewOrganizationUnitComponent,
        HomeComponent,
        ExceptionIncidentsComponent,
        CreateOrEditExceptionIncidentComponent,
        ViewExceptionIncidentModalComponent, CreateOrEditExceptionIncidentModalComponent,
        DepartmentRatingListComponent,
        ExceptionIncidentUserLookupTableModalComponent,
        ExceptionIncidentTestingTemplateLookupTableModalComponent,
        ExceptionIncidentOrganizationUnitLookupTableModalComponent,
        TestingTemplatesComponent,
        ViewTestingTemplateModalComponent,
        TestingTemplateDepartmentRiskControlLookupTableModalComponent,
        DepartmentRiskControlsComponent,
        DepartmentRisksComponent,
        ViewDepartmentRiskModalComponent,
        DepartmentsComponent,
        //ViewDepartmentModalComponent,
        DataListsComponent,
        ViewDataListModalComponent, CreateOrEditDataListModalComponent,
        ExceptionTypesComponent,
        ViewExceptionTypeModalComponent,
        CreateOrEditExceptionTypeModalComponent,
        ControlsComponent,
        ViewControlModalComponent,
        //CreateOrEditControlModalComponent,
        RisksComponent,
        ViewRiskModalComponent,
        //CreateOrEditRiskModalComponent,
        DashboardComponent,
        WorkingpaperComponent
    ],
    providers: [
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }
