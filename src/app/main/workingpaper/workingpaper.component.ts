import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'app-workingpaper',
  templateUrl: './workingpaper.component.html',
  styleUrls: ['./workingpaper.component.css']
})
export class WorkingpaperComponent extends AppComponentBase implements OnInit {

  constructor(
    private injector: Injector
  ) {
    super(injector);
   }

  ngOnInit() {
  }

}
