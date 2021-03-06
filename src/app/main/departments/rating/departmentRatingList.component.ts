import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestingTemplatesServiceProxy, TestingTemplateDto , Frequency, DepartmentsServiceProxy, RatingsServiceProxy, GetDepartmentForViewDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CreateOrEditDepartmentRatingModalComponent } from '@app/main/departmentRatingHistory/departmentRatingHistory/create-or-edit-departmentRating-modal.component';

@Component({
    templateUrl: './departmentRatingList.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DepartmentRatingListComponent extends AppComponentBase {

    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createOrEditDepartmentRatingModal', { static: true }) createOrEditDepartmentRatingModal: CreateOrEditDepartmentRatingModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    ratingFilter = -1;
    ratings = [];
    _entityTypeFullName = 'ICMSDemo.TestingTemplates.TestingTemplate';
    entityHistoryEnabled = false;

    constructor(
        injector: Injector,
        private _departmentsServiceProxy: DepartmentsServiceProxy,
        private _ratingsServiceProxy: RatingsServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
     
    }


    getDepartments(event?: LazyLoadEvent) {

        if (this.ratings.length == 0) {
            this._ratingsServiceProxy.getAll('', '', 0, 1000).subscribe(result => {
                this.ratings = result.items;

            });
        }


        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._departmentsServiceProxy.getAllForRating(
            this.filterText,
            this.ratingFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createTestingTemplate(): void {
      //  this.createOrEditTestingTemplateModal.show();
    }



    deleteTestingTemplate(testingTemplate: TestingTemplateDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    //this._testingTemplatesServiceProxy.delete(testingTemplate.id)
                    //    .subscribe(() => {
                    //        this.reloadPage();
                    //        this.message.success(this.l('SuccessfullyDeleted'));
                    //    });
                }
            }
        );
    }



    view(id: number): void {
        this._router.navigate(['app/main/departments/view', id ]);
    }

    overrideDepartmentRating(department: GetDepartmentForViewDto): void {
        this.createOrEditDepartmentRatingModal.overrideDepartmentRating(department.department.departmentId, department.organizationUnitDisplayName);
    }
}
