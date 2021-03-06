import { FullCalendarModule } from '@fullcalendar/angular';
import { ViewDepartmentModalComponent } from '@app/main/departments/departments/view-department-modal.component';
import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { CommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule, TabsModule, BsDropdownModule, BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { GridsterModule } from 'angular-gridster2';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CountoModule } from 'angular2-counto';
import { CreateOrEditDepartmentModalComponent } from '@app/main/departments/departments/create-or-edit-department-modal.component';
import { DepartmentUserLookupTableModalComponent } from '@app/main/departments/departments/department-user-lookup-table-modal.component';
import { DepartmentOrganizationUnitLookupTableModalComponent } from '@app/main/departments/departments/department-organizationUnit-lookup-table-modal.component';
import { CreateOrEditDepartmentRiskModalComponent } from '@app/main/departmentRisks/departmentRisks/create-or-edit-departmentRisk-modal.component';
import { DepartmentRiskRiskLookupTableModalComponent } from '@app/main/departmentRisks/departmentRisks/departmentRisk-risk-lookup-table-modal.component';
import { ViewDepartmentRiskControlModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/view-departmentRiskControl-modal.component';
import { CreateOrEditDepartmentRiskControlModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/create-or-edit-departmentRiskControl-modal.component';
import { DepartmentRiskControlDepartmentRiskLookupTableModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/departmentRiskControl-departmentRisk-lookup-table-modal.component';
import { DepartmentRiskControlControlLookupTableModalComponent } from '@app/main/departmentRiskControls/departmentRiskControls/departmentRiskControl-control-lookup-table-modal.component';
import { CreateOrEditTestingTemplateModalComponent } from '@app/main/testingTemplates/testingTemplates/create-or-edit-testingTemplate-modal.component';
import { ExceptionIncidentExceptionTypeLookupTableModalComponent } from '@app/main/exceptionIncidents/exceptionIncidents/exceptionIncident-exceptionType-lookup-table-modal.component';
import { OrganizationUnitRisksComponent } from '@app/admin/organization-units/organization-unit-risks.component';
import { DeptProcessRiskControlComponent } from '@app/admin/processes/dept-process-risk-control/dept-process-risk-control.component';
import { CreateOrEditProcessRiskModalComponent } from '@app/admin/processes/process-risk/create-process-risk-modal/create-or-edit-processRisk-modal.component';
import { CreateOrEditProcessRiskControlModalComponent } from '@app/admin/processes/process-risk/create-process-risk-control-modal/create-or-edit-processRiskControl-modal.component';
import { CreateOrEditRiskModalComponent } from '../../main/risks/risks/create-or-edit-risk-modal.component';
import { CreateOrEditControlModalComponent } from '../../main/controls/controls/create-or-edit-control-modal.component';
import { ProcessRisksComponent } from '@app/admin/processes/process-risk/process-risks.component';
import { LossEventSampleModalComponent } from '@app/main/lossEvents/loss-event-sample-modal/loss-event-sample-modal.component';
//import { CreateEditQuestionModal } from '@app/main/testingTemplates/testingTemplates/create-or-edit-questions-modal.component';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CreateControlTestingModalComponent } from '@app/admin/processes/process-risk/create-process-risk-control-modal/create-control-testing-modal.component';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { LossEventUserLookupTableModalComponent } from '@app/main/lossEvents/lossEvent-user-lookup-table-modal.component';


@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        AbpModule,
        TreeModule,
        ContextMenuModule,
        CommonModule,
        TableModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        FullCalendarModule,
    ],
    declarations: [
       // CreateEditQuestionModal,
       LossEventUserLookupTableModalComponent,
       CreateControlTestingModalComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        ExceptionIncidentExceptionTypeLookupTableModalComponent,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        CreateOrEditTestingTemplateModalComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        CreateOrEditDepartmentRiskModalComponent,
        CreateOrEditDepartmentModalComponent,
        DepartmentUserLookupTableModalComponent,
        DepartmentOrganizationUnitLookupTableModalComponent,
        DepartmentRiskRiskLookupTableModalComponent,
        ViewDepartmentRiskControlModalComponent,
        CreateOrEditDepartmentRiskControlModalComponent,
        DepartmentRiskControlDepartmentRiskLookupTableModalComponent,
        DepartmentRiskControlControlLookupTableModalComponent,
        ViewDepartmentModalComponent,
        OrganizationUnitRisksComponent,
        DeptProcessRiskControlComponent,
        CreateOrEditProcessRiskModalComponent,
        CreateOrEditRiskModalComponent,
        CreateOrEditProcessRiskControlModalComponent,
        CreateOrEditControlModalComponent,
        ProcessRisksComponent,
        LossEventSampleModalComponent
    ],
    exports: [
        //CreateEditQuestionModal,
        LossEventUserLookupTableModalComponent,
        CreateControlTestingModalComponent,
        LossEventSampleModalComponent,
        ProcessRisksComponent,
        CreateOrEditProcessRiskModalComponent,
        CreateOrEditProcessRiskControlModalComponent,
        DeptProcessRiskControlComponent,
        OrganizationUnitRisksComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        ExceptionIncidentExceptionTypeLookupTableModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        CreateOrEditTestingTemplateModalComponent,
        NgxChartsModule,
        CreateOrEditRiskModalComponent,
        CreateOrEditControlModalComponent,
        CreateOrEditDepartmentRiskModalComponent,
        CreateOrEditDepartmentModalComponent,
        DepartmentUserLookupTableModalComponent,
        DepartmentOrganizationUnitLookupTableModalComponent,
        DepartmentRiskRiskLookupTableModalComponent,
        ViewDepartmentRiskControlModalComponent,
        CreateOrEditDepartmentRiskControlModalComponent,
        DepartmentRiskControlDepartmentRiskLookupTableModalComponent,
        DepartmentRiskControlControlLookupTableModalComponent,
        ViewDepartmentModalComponent,
        FullCalendarModule
    ],
    providers: [
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig }
    ],

    entryComponents: [
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
