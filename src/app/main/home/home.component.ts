import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorkingPaper } from '@app/UIModel/WorkingPaper';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase implements OnInit {


    workingpapers= [];

    constructor(private r: Router,
        injector: Injector,
    ) {
        super(injector);

    }

    ngOnInit() {

        
        let itm1 :WorkingPaper={
            Id:1,
            Score:18,
            TestingTemplateData:'Apply resolution to incidence',
            Code:'8945869', TaskStatus:'Pending'
                    };
            
                    let itm2 :WorkingPaper={
                        Id:2,
                        Score:9,
                        TestingTemplateData:'Minify risk spreading',
                        Code:'6986594', TaskStatus:'Pending'
                                };
                                let itm3 :WorkingPaper={
                                    Id:3,
                                    Score:6,
                                    TestingTemplateData:'Quarantine affected machines',
                                    Code:'657543', TaskStatus:'Pending'
                                            };
                    
                    this.workingpapers.push(itm1);
                    this.workingpapers.push(itm2);
                    this.workingpapers.push(itm3);

    }



    OpenDetails(id:number) {
        this.r.navigateByUrl('app/main/workpaperdetail')
      }

}
