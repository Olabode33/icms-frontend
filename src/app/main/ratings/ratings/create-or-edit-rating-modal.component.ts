import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { RatingsServiceProxy, CreateOrEditRatingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditRatingModal',
    templateUrl: './create-or-edit-rating-modal.component.html'
})
export class CreateOrEditRatingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    rating: CreateOrEditRatingDto = new CreateOrEditRatingDto();



    constructor(
        injector: Injector,
        private _ratingsServiceProxy: RatingsServiceProxy
    ) {
        super(injector);
    }

    show(ratingId?: number): void {

        if (!ratingId) {
            this.rating = new CreateOrEditRatingDto();
            this.rating.id = ratingId;

            this.active = true;
            this.modal.show();
        } else {
            this._ratingsServiceProxy.getRatingForEdit(ratingId).subscribe(result => {
                this.rating = result.rating;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._ratingsServiceProxy.createOrEdit(this.rating)
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
