import { Component, OnInit } from '@angular/core';
import { StepsService } from '../steps.service';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  providers:[
    StepsService
  ]
})
export class StageComponent implements OnInit {

  constructor(private timeline:StepsService) { }

  inputType:string = 'text';
  inputPlaceholder:string = 'say your name or type it here..';

  listeningIndicatorStyle(){
    return {
      opacity:this.timeline.isListening?1:0,
      height:this.timeline.isListening?'auto':'0px'
    }
  }

  speech:string;
  ngOnInit() {
  }

  startRecruitment(){
    this.timeline.idle = false;
    console.log('Starting recruitment program.')
  }
}
