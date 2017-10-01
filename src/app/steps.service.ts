import { Injectable } from '@angular/core';
import { SpeachService } from './speach.service';

@Injectable()
export class StepsService {

  constructor() {}

  speech:SpeachService = new SpeachService();
  text = this.speech.say('Dyson Digital IT');
  userSpeach:any = '';
  confirmCTAIsShown:boolean = false;
  isListening = false;

  isIdle:boolean = true;
  set idle(bool){
    this.isIdle = bool;
    const self = this;
    if(bool){
      //do the idle stuff
      //do reset
    }
    //start hiring
    else{
      async function runTimeline(){
        for(let step of self.steps){
          
          await step()
        }
      }

      runTimeline.bind(self)()
    }
  }
  
  confirm(trys:Function, catchs:Function){
    return async ()=>{
      await trys.bind(this)();
      catchs.bind(this)();
    }
  }

  steps = [
    this.intro.bind(this),
    this.myNameIs.bind(this),
    this.confirm(this.yourNameIs, this.yourNameIsConfirm),
    this.myIntent.bind(this),
    this.reset.bind(this)
  ]

  intro(){
    
    return new Promise(resolve=>{
      setTimeout(function(){

        resolve()
      },3000);
    })
  }

  myNameIs(){
    this.text = this.speech.say('My name is Anna');
    return new Promise(resolve=>{
      setTimeout(()=>{
        
        resolve()
      },3000);
    })
  }
  async yourNameIs(){
    this.text = this.speech.say('What is your name?');
    this.isListening = true;
    this.userSpeach = await this.speech.ask();
    window.localStorage.setItem('anna-username',this.userSpeach);
  }
  yourNameIsConfirm(){
    const candidateName = window.localStorage.getItem('anna-username');
    this.text = this.speech.say(`I heard ${candidateName}, is that really your name?`);
    
  }

  myIntent(){

  }

  questionOne(){

  }

  questionTwo(){
    
  }

  questionThree(){
    
  }

  questionFour(){
    
  }

  questionFive(){
    
  }

  jobsList(){
    
  }
  email(){
    
  }
  emailConfirm(){
    
  }
  thanks(){

  }

  reset(){
    console.log('reseting')
    this.idle = true;
  }

  showConfirmCTA(){
    this.confirmCTAIsShown = true;
  }

  showListeningIndicator(){
    this.isListening = true;
  }
  hideListeningIndicator(){
    this.isListening = false;
  }


}
