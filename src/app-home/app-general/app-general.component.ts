import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-general',
  templateUrl: './app-general.component.html',
  styleUrls: ['./app-general.component.css']
})
export class GeneralComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _router: Router
    ) {
        super(injector);
    }

  ngOnInit() {
  }

}
