import { Component, OnInit } from '@angular/core';
import { AppearanceService } from "../appearance.service";
import { EmotionService } from "../emotion.service";
import { MovementService } from "../movement.service";
import { LightingService } from "../lighting.service";
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
    LightingService
  ]
})
export class AvatarComponent implements OnInit {

  constructor(
    private appearance:AppearanceService,
    private emotion:EmotionService,
    private moves:MovementService,
    private lighting:LightingService
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
      top:intialPosition.top,
      left:intialPosition.left
    },{
      top:intialPosition.top,
      left:intialPosition.left
    }, 0);

    await this.moves.to({
      left:400,
      top:300
    }, 3000);

    await this.moves.toElement('#speech-wrapper p', 'top' ,4000);
    await this.moves.toElement('#speech-wrapper p', 'left' ,4000);
    await this.moves.toElement('#speech-wrapper p', 'bottom' ,4000);
    await this.moves.toElement('#speech-wrapper p', 'right' ,4000);
    
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
