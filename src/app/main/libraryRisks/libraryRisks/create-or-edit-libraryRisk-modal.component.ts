import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LibraryRisksServiceProxy, CreateOrEditLibraryRiskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditLibraryRiskModal',
    templateUrl: './create-or-edit-libraryRisk-modal.component.html'
})
export class CreateOrEditLibraryRiskModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    libraryRisk: CreateOrEditLibraryRiskDto = new CreateOrEditLibraryRiskDto();


    constructor(
        injector: Injector,
        private _libraryRisksServiceProxy: LibraryRisksServiceProxy
    ) {
        super(injector);
    }

    show(libraryRiskId?: number): void {

        if (!libraryRiskId) {
            this.libraryRisk = new CreateOrEditLibraryRiskDto();
            this.libraryRisk.id = libraryRiskId;

            this.active = true;
            this.modal.show();
        } else {
            this._libraryRisksServiceProxy.getLibraryRiskForEdit(libraryRiskId).subscribe(result => {
                this.libraryRisk = result.libraryRisk;


                this.active = true;
                this.modal.show();
            });
        }

    }

    save(): void {
            this.saving = true;

            this._libraryRisksServiceProxy.createOrEdit(this.libraryRisk)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.message.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
