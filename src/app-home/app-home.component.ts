import { Component, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

  _AppConsts = AppConsts;

  constructor() { }

  ngOnInit() {
  }

  setSelectedModule(module: string) {
    localStorage.setItem(AppConsts.SelectedModuleKey, module);
  }

}
