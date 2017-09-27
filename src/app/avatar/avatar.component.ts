import { Component, OnInit } from '@angular/core';
import { AppearanceService } from "../appearance.service";
import { EmotionService } from "../emotion.service";

//sadly gsap is not very compatible with typescript
import * as anime from "animejs";


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers:[
    AppearanceService,
    EmotionService
  ]
})
export class AvatarComponent implements OnInit {

  constructor(
    private appearance:AppearanceService,
    private emotion:EmotionService
  ) {
    
  }
  
  
  async ngOnInit() {
    console.log(this.emotion.getEyes())
    
    //TODO group the svg and try and move with animate
    const tl = anime({
      targets:document.querySelector('#avatar'),
      translateY:'100px',
      duration:3000
    })

    console.log( document.querySelector('#avatar') )

    await this.emotion.setEyeShape({
      eyeSelector:'left',
      shape:'default',
      speed:200,
      transforms:{
        scaleY:.3,
        morphPrecision: 4,
        reverseFirstPath: true,
      }
    });




    // await this.emotion.setEyeShape({
    //   eyeSelector:'random',
    //   shape:'circle',
    //   speed:2000,
    //   transforms:{
    //     scale:.1,
    //     transformOrigin:'center',
    //   }
    // });

    // await this.emotion.resetEye('both');
    
    // await this.emotion.setEyeShape({
    //   eyeSelector:'random',
    //   shape:'heart',
    //   speed:300,
    //   transforms:{
    //     scale:1,
    //     transformOrigin:'center',
    //   }
    // });

  }

}
