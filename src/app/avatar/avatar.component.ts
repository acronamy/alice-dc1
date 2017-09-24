import { Component, OnInit } from '@angular/core';
import { AppearanceService } from "../appearance.service";
const TweenMax:any = <gsap.TweenMax>window["TweenMax"];


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers:[
    AppearanceService
  ]
})
export class AvatarComponent implements OnInit {

  constructor(
    private appearance:AppearanceService
  ) {}

  ngOnInit() {
    const css:any = {
      rotation:180
    }
    TweenMax.to("#eye-lighting-right",3,{
      rotation:45,
      transformOrigin:"center"
    })
  }

}
