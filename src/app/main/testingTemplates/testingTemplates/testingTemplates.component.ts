import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestingTemplatesServiceProxy, TestingTemplateDto , Frequency } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
//import { CreateOrEditTestingTemplateModalComponent } from './create-or-edit-testingTemplate-modal.component';
import { ViewTestingTemplateModalComponent } from './view-testingTemplate-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './testingTemplates.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TestingTemplatesComponent extends AppComponentBase {

    //@ViewChild('createOrEditTestingTemplateModal', { static: true }) createOrEditTestingTemplateModal: CreateOrEditTestingTemplateModalComponent;
    @ViewChild('viewTestingTemplateModalComponent', { static: true }) viewTestingTemplateModal: ViewTestingTemplateModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    titleFilter = '';
    frequencyFilter = -1;
        departmentRiskControlCodeFilter = '';

    frequency = Frequency;

    _entityTypeFullName = 'ICMSDemo.TestingTemplates.TestingTemplate';
    entityHistoryEnabled = false;

    constructor(
        injector: Injector,
        private _testingTemplatesServiceProxy: TestingTemplatesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.entityHistoryEnabled = this.setIsEntityHistoryEnabled();
    }

    private setIsEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getTestingTemplates(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._testingTemplatesServiceProxy.getAll(
            this.filterText,
            this.titleFilter,
            this.frequencyFilter,
            this.departmentRiskControlCodeFilter,
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
        //this._router.navigate(['/app/main/testingTemplates/createOrEdit'], { queryParams: { id: id } });
        //this.createOrEditTestingTemplateModal.show();
    }

    showHistory(testingTemplate: TestingTemplateDto): void {
        this.entityTypeHistoryModal.show({
            entityId: testingTemplate.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteTestingTemplate(testingTemplate: TestingTemplateDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._testingTemplatesServiceProxy.delete(testingTemplate.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._testingTemplatesServiceProxy.getTestingTemplatesToExcel(
        this.filterText,
            this.titleFilter,
            this.frequencyFilter,
            this.departmentRiskControlCodeFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }

    view(id: number): void {
        this._router.navigate(['app/main/testingTemplates', id ]);
    }
}
