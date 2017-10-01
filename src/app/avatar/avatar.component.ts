import { Component, OnInit } from '@angular/core';
import { AppearanceService } from "../appearance.service";
import { EmotionService } from "../emotion.service";
import { MovementService } from "../movement.service";
import { LightingService } from "../lighting.service";
import { StepsService } from "../steps.service";
import { randomIntClamp } from "../random.utils";
//sadly gsap is not very compatible with typescript
import * as anime from "animejs";


interface Coordinate{
  top:number,
  left:number
}

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers:[
    AppearanceService,
    EmotionService,
    MovementService,
    LightingService,
    StepsService
  ]
})
export class AvatarComponent implements OnInit {

  constructor(
    private appearance:AppearanceService,
    private emotion:EmotionService,
    private moves:MovementService,
    private lighting:LightingService,
    private timeline:StepsService
  ) {}
  
  
  async ngOnInit() {



    //Sets the point lighting
    this.lighting.init()
    //Sets the intial positon
    const intialPosition:Coordinate = <Coordinate>await this.appearance.initialPosition()
    
    //Sets the initial emotion
    this.appearance.initialEmotion()

    //Required
    await this.moves.fromTo({
      top:-(innerWidth),
      left:intialPosition.left
    },{
      top:(document.querySelector('#speech-wrapper').getBoundingClientRect().top / 2) - 68,
      left:intialPosition.left
    },600);


    await this.moves.toElement('#speech-wrapper', 'top');
    await this.moves.toElement('#speech-wrapper', 'left');
    await this.moves.toElement('#speech-wrapper', 'bottom');
    await this.moves.toElement('#speech-wrapper', 'right');
    
    
    await this.emotion.setEyeShape({
      eyeSelector:'left',
      shape:'circle',
      speed:300,
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
