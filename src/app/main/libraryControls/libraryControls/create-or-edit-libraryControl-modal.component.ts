import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LibraryControlsServiceProxy, CreateOrEditLibraryControlDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditLibraryControlModal',
    templateUrl: './create-or-edit-libraryControl-modal.component.html'
})
export class CreateOrEditLibraryControlModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    libraryControl: CreateOrEditLibraryControlDto = new CreateOrEditLibraryControlDto();



    constructor(
        injector: Injector,
        private _libraryControlsServiceProxy: LibraryControlsServiceProxy
    ) {
        super(injector);
    }

    show(libraryControlId?: number): void {

        if (!libraryControlId) {
            this.libraryControl = new CreateOrEditLibraryControlDto();
            this.libraryControl.id = libraryControlId;

            this.active = true;
            this.modal.show();
        } else {
            this._libraryControlsServiceProxy.getLibraryControlForEdit(libraryControlId).subscribe(result => {
                this.libraryControl = result.libraryControl;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._libraryControlsServiceProxy.createOrEdit(this.libraryControl)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
