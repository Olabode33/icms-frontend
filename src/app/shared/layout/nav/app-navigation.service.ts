import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {

    }

    getInternalAuditMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('IA Home', 'Pages.HomePage', 'flaticon-home', '/app/main/home'),
            new AppMenuItem('IA Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('IA Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('IA Tenants', 'Pages.Tenants', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('IA Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('My Projects', '', 'flaticon-squares-4', '/app/main/projects/projects'),
            new AppMenuItem('IA Exceptions', 'Pages.ExceptionIncidents', 'fa fa-gavel', '/app/main/exceptionIncidents/exceptionIncidents'),


            //    new AppMenuItem('Working Papers', 'Pages.WorkingPaperNews', 'flaticon-layer', '/app/main/workingPaperNews/workingPaperNews'),
            new AppMenuItem('IA Testing Templates', 'Pages.TestingTemplates', 'flaticon2-document', '/app/main/testingTemplates/testingTemplates'),

            new AppMenuItem('IA Business Units', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),







            //new AppMenuItem('DepartmentRatingHistory', 'Pages.DepartmentRatingHistory', 'flaticon-more', '/app/main/departmentRatingHistory/departmentRatingHistory'),




            new AppMenuItem('Administration', '', 'flaticon-interface-8', '', [

                new AppMenuItem('IA Planning', '', 'fa fa-briefcase', '', [
                    new AppMenuItem('IA Project Scheduling', 'Pages.Projects', 'flaticon-calendar', '/app/main/projects/planning'),
                    new AppMenuItem('IA Internal Rating', 'Pages.Ratings', 'fa fa-balance-scale', '/app/main/ratings/ratings'),
                    new AppMenuItem('IA Department Rating', 'Pages.Ratings', 'fa fa-cubes', '/app/main/departmentRatingList/departmentRatingList'),
                ]),

                new AppMenuItem('IA Risk Management', '', 'flaticon2-dashboard', '', [
                    new AppMenuItem('IA Processes', 'Pages.Processes', 'flaticon-tabs', '/app/admin/processes'),
                    new AppMenuItem('IA Risks', 'Pages.Risks', 'flaticon-warning-sign', '/app/main/risks/risks'),
                    new AppMenuItem('IA Controls', 'Pages.Controls', 'fa fa-cog', '/app/main/controls/controls'),
                    new AppMenuItem('IA Exception Types', 'Pages.ExceptionTypes', 'flaticon-more', '/app/main/exceptionTypes/exceptionTypes')
                ]),

                new AppMenuItem('IA Library', '', 'fa fa-book', '', [
                    new AppMenuItem('IA Risks', 'Pages.LibraryRisks', 'flaticon-more', '/app/main/libraryRisks/libraryRisks'),
                    new AppMenuItem('IA Controls', 'Pages.LibraryControls', 'flaticon-more', '/app/main/libraryControls/libraryControls'),
                ]),


                new AppMenuItem('IA Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('IA Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('IA Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('IA DataLists', 'Pages.DataLists', 'flaticon-more', '/app/main/dataLists/dataLists'),
                new AppMenuItem('IA AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('IA Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                //       new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                //      new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('IA Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('IA Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ])
            //  new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    getInternalControlMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Home', 'Pages.HomePage', 'flaticon-home', '/app/main/home'),
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pages.Tenants', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('My Projects', '', 'flaticon-squares-4', '/app/main/projects/projects'),
            new AppMenuItem('Exceptions', 'Pages.ExceptionIncidents', 'fa fa-gavel', '/app/main/exceptionIncidents/exceptionIncidents'),


            //    new AppMenuItem('Working Papers', 'Pages.WorkingPaperNews', 'flaticon-layer', '/app/main/workingPaperNews/workingPaperNews'),
            new AppMenuItem('Testing Templates', 'Pages.TestingTemplates', 'flaticon2-document', '/app/main/testingTemplates/testingTemplates'),

            new AppMenuItem('Business Units', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),







            //new AppMenuItem('DepartmentRatingHistory', 'Pages.DepartmentRatingHistory', 'flaticon-more', '/app/main/departmentRatingHistory/departmentRatingHistory'),




            new AppMenuItem('Administration', '', 'flaticon-interface-8', '', [

                new AppMenuItem('Planning', '', 'fa fa-briefcase', '', [
                    new AppMenuItem('Project Scheduling', 'Pages.Projects', 'flaticon-calendar', '/app/main/projects/planning'),
                    new AppMenuItem('Internal Rating', 'Pages.Ratings', 'fa fa-balance-scale', '/app/main/ratings/ratings'),
                    new AppMenuItem('Department Rating', 'Pages.Ratings', 'fa fa-cubes', '/app/main/departmentRatingList/departmentRatingList'),
                ]),

                new AppMenuItem('Risk Management', '', 'flaticon2-dashboard', '', [
                    new AppMenuItem('Processes', 'Pages.Processes', 'flaticon-tabs', '/app/admin/processes'),
                    new AppMenuItem('Risks', 'Pages.Risks', 'flaticon-warning-sign', '/app/main/risks/risks'),
                    new AppMenuItem('Controls', 'Pages.Controls', 'fa fa-cog', '/app/main/controls/controls'),
                    new AppMenuItem('Exception Types', 'Pages.ExceptionTypes', 'flaticon-more', '/app/main/exceptionTypes/exceptionTypes')
                ]),

                new AppMenuItem('Library', '', 'fa fa-book', '', [
                    new AppMenuItem('Risks', 'Pages.LibraryRisks', 'flaticon-more', '/app/main/libraryRisks/libraryRisks'),
                    new AppMenuItem('Controls', 'Pages.LibraryControls', 'flaticon-more', '/app/main/libraryControls/libraryControls'),
                ]),


                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('DataLists', 'Pages.DataLists', 'flaticon-more', '/app/main/dataLists/dataLists'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                //       new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                //      new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ])
            //  new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    getOpRiskMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Op Risk Home', 'Pages.HomePage', 'flaticon-home', '/app/main/home'),
            new AppMenuItem('Op Risk Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Op Risk Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Op Risk Tenants', 'Pages.Tenants', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('Op Risk Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('Op Risk My Projects', '', 'flaticon-squares-4', '/app/main/projects/projects'),
            new AppMenuItem('Op Risk Exceptions', 'Pages.ExceptionIncidents', 'fa fa-gavel', '/app/main/exceptionIncidents/exceptionIncidents'),


            //    new AppMenuItem('Working Papers', 'Pages.WorkingPaperNews', 'flaticon-layer', '/app/main/workingPaperNews/workingPaperNews'),
            new AppMenuItem('Op Risk Testing Templates', 'Pages.TestingTemplates', 'flaticon2-document', '/app/main/testingTemplates/testingTemplates'),

            new AppMenuItem('Op Risk Business Units', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),







            //new AppMenuItem('DepartmentRatingHistory', 'Pages.DepartmentRatingHistory', 'flaticon-more', '/app/main/departmentRatingHistory/departmentRatingHistory'),




            new AppMenuItem('Op Risk Administration', '', 'flaticon-interface-8', '', [

                new AppMenuItem('Op Risk Planning', '', 'fa fa-briefcase', '', [
                    new AppMenuItem('Op Risk Project Scheduling', 'Pages.Projects', 'flaticon-calendar', '/app/main/projects/planning'),
                    new AppMenuItem('Op Risk Internal Rating', 'Pages.Ratings', 'fa fa-balance-scale', '/app/main/ratings/ratings'),
                    new AppMenuItem('Op Risk Department Rating', 'Pages.Ratings', 'fa fa-cubes', '/app/main/departmentRatingList/departmentRatingList'),
                ]),

                new AppMenuItem('Risk Management', '', 'flaticon2-dashboard', '', [
                    new AppMenuItem('Op Risk Processes', 'Pages.Processes', 'flaticon-tabs', '/app/admin/processes'),
                    new AppMenuItem('Risks', 'Pages.Risks', 'flaticon-warning-sign', '/app/main/risks/risks'),
                    new AppMenuItem('Op Risk Controls', 'Pages.Controls', 'fa fa-cog', '/app/main/controls/controls'),
                    new AppMenuItem('Op Risk Exception Types', 'Pages.ExceptionTypes', 'flaticon-more', '/app/main/exceptionTypes/exceptionTypes')
                ]),

                new AppMenuItem('Op Risk Library', '', 'fa fa-book', '', [
                    new AppMenuItem('Risks', 'Pages.LibraryRisks', 'flaticon-more', '/app/main/libraryRisks/libraryRisks'),
                    new AppMenuItem('Op Risk Controls', 'Pages.LibraryControls', 'flaticon-more', '/app/main/libraryControls/libraryControls'),
                ]),


                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('DataLists', 'Pages.DataLists', 'flaticon-more', '/app/main/dataLists/dataLists'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                //       new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                //      new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ])
            //  new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    getGeneralMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Home', 'Pages.HomePage', 'flaticon-home', '/app/main/home'),
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pages.Tenants', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('My Projects', '', 'flaticon-squares-4', '/app/main/projects/projects'),
            new AppMenuItem('Exceptions', 'Pages.ExceptionIncidents', 'fa fa-gavel', '/app/main/exceptionIncidents/exceptionIncidents'),


            //    new AppMenuItem('Working Papers', 'Pages.WorkingPaperNews', 'flaticon-layer', '/app/main/workingPaperNews/workingPaperNews'),
            new AppMenuItem('Testing Templates', 'Pages.TestingTemplates', 'flaticon2-document', '/app/main/testingTemplates/testingTemplates'),

            new AppMenuItem('Business Units', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),







            //new AppMenuItem('DepartmentRatingHistory', 'Pages.DepartmentRatingHistory', 'flaticon-more', '/app/main/departmentRatingHistory/departmentRatingHistory'),




            new AppMenuItem('Administration', '', 'flaticon-interface-8', '', [

                new AppMenuItem('Planning', '', 'fa fa-briefcase', '', [
                    new AppMenuItem('Project Scheduling', 'Pages.Projects', 'flaticon-calendar', '/app/main/projects/planning'),
                    new AppMenuItem('Internal Rating', 'Pages.Ratings', 'fa fa-balance-scale', '/app/main/ratings/ratings'),
                    new AppMenuItem('Department Rating', 'Pages.Ratings', 'fa fa-cubes', '/app/main/departmentRatingList/departmentRatingList'),
                ]),

                new AppMenuItem('Risk Management', '', 'flaticon2-dashboard', '', [
                    new AppMenuItem('Processes', 'Pages.Processes', 'flaticon-tabs', '/app/admin/processes'),
                    new AppMenuItem('Risks', 'Pages.Risks', 'flaticon-warning-sign', '/app/main/risks/risks'),
                    new AppMenuItem('Controls', 'Pages.Controls', 'fa fa-cog', '/app/main/controls/controls'),
                    new AppMenuItem('Exception Types', 'Pages.ExceptionTypes', 'flaticon-more', '/app/main/exceptionTypes/exceptionTypes')
                ]),

                new AppMenuItem('Library', '', 'fa fa-book', '', [
                    new AppMenuItem('Risks', 'Pages.LibraryRisks', 'flaticon-more', '/app/main/libraryRisks/libraryRisks'),
                    new AppMenuItem('Controls', 'Pages.LibraryControls', 'flaticon-more', '/app/main/libraryControls/libraryControls'),
                ]),


                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('DataLists', 'Pages.DataLists', 'flaticon-more', '/app/main/dataLists/dataLists'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                //       new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                //      new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ])
            //  new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null || subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            } else if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let module = localStorage.getItem('selectedModule');
        let menu = null;
        switch (module) {
            case 'internalControl':
                menu = this.getInternalControlMenu();
                break;
            case 'internalAudit':
                menu = this.getInternalAuditMenu();
                break;
            case 'opRisk':
                menu = this.getOpRiskMenu();
                break;
            case 'general':
                menu = this.getGeneralMenu();
                break;
            default:
                break;
        }

        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }

    private getAllMenuItemsRecursive(menuItem: AppMenuItem): AppMenuItem[] {
        if (!menuItem.items) {
            return [menuItem];
        }

        let menuItems = [menuItem];
        menuItem.items.forEach(subMenu => {
            menuItems = menuItems.concat(this.getAllMenuItemsRecursive(subMenu));
        });

        return menuItems;
    }
}
