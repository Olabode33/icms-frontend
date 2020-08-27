import { Component, OnInit, Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent extends AppComponentBase implements OnInit {

  _AppConsts = AppConsts;
  userName = '';

  constructor(
      injector: Injector
  ) {
      super(injector);
  }

  ngOnInit() {
      this.userName = this.appSession.user.name;
  }

  setSelectedModule(module: string) {
    localStorage.setItem(AppConsts.SelectedModuleKey, module);
  }

}
