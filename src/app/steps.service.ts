import { Injectable } from '@angular/core';
import { SpeachService } from './speach.service';
import { randomIntClamp } from './random.utils';
import { EmotionService } from './emotion.service';
import { MovementService } from './movement.service';
import * as KUTE from "kute.js";

const emotion = new EmotionService();
const movement = new MovementService();

type Persona = 'tester'|'developer'|'project-manager'|'ux'|'creative';
interface PersonaScore{
  'tester':number,
  'developer':number,
  'project-manager':number,
  'creative':number,
  'ux':number
}

@Injectable()
export class StepsService {

  constructor() {

  }

  speech:SpeachService = new SpeachService();
  text = this.speech.say('');
  userSpeach:any = '';

  //visibility
  textIsShown = false;
  confirmCTAIsShown:boolean = false;
  isListening = false;
  startButtonIsShown = true;
  logoIsShown:boolean = true;
  listeningIndicatorIsShown:boolean = false;
  questionOneChoicesShown = false;
  questionTwoChoicesShown = false;
  questionThreeChoicesShown = false;
  questionFourChoicesShown = false;
  questionFiveChoicesShown = false;

  questionFiveAddonFunnyCake = false;
  questionFiveAddonAnswerA = false;
  questionFiveAddonAnswerB = false;
  questionFiveAddonAnswerC = false;
  questionFiveAddonAnswerD = false;

  jobsTableIsShown = false;

  //state
  nameIsCorrect = false;
  //manualInput (initial)
  manualInputPlaceholder = 'say your name or type it here...';
  manualInputName = 'username';


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
      this.intro()
    }
  }

  async intro(){
    
    this.listeningIndicatorIsShown = true;
    this.startButtonIsShown = false;
    return new Promise(resolve=>{
      setTimeout(()=>{
        this.myNameIs()
        resolve()
      },3000);
    })
  }

  myNameIs(){
    this.text = this.speech.say('My name is Anna');
    this.textIsShown = true;
    this.logoIsShown = false;

    return new Promise(resolve=>{
      setTimeout(()=>{
        this.yourNameIs()
        resolve()
      },3000);
    })
  }
  async yourNameIs(overide?:string){
    

    this.text = '';
    await movement.toElement('#path-disk','top')
    await movement.rotate(15,1000);

    await new Promise(resolve=>{
      setTimeout(()=>{
        this.showListeningIndicator();
        this.text = this.speech.say(overide||'What is your name?');
        resolve()

      },1000)
    })
    
    await emotion.setEyeShape({
      eyeSelector:'left',
      shape:'circle',
      speed:500,
      transforms:{
        scale:.8,
        morphPrecision: 4,
        reverseFirstPath: true,
        easing: 'easingCubicInOut'
      }
    })
    

    setTimeout( async ()=>{
      await movement.rotate(0,800);
    },5000)


    const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
    manualInput.onsubmit = (e)=>{
      const formData = new FormData(e.target as HTMLFormElement);
      const username = <string>formData['get']('username');
      const candidateName = window.localStorage.setItem('anna-username',username);
      this.greet(false);
      this.clearManualInput()
      this.speech.stopListening();
    }

    const failMessages = [
      'Sorry, I didnt catch that, what is your name?',
      'Gone all shy have you, what is your name?',
      'My accent chip is fried, what is your name again?',
      'Its very loud in here, What is your name again?'
    ]
    const useMessage = failMessages[randomIntClamp(0, failMessages.length)]
    

    this.userSpeach = await this.speech.ask()||'';
    
    if(this.userSpeach && this.userSpeach !== ''){
      window.localStorage.setItem('anna-username', this.userSpeach);
      this.yourNameIsConfirm();
    }
    else{
      await this.yourNameIs(useMessage)
    }

  }
  async yourNameIsConfirm(overide?:string){
    const candidateName = window.localStorage.getItem('anna-username');
    this.text = this.speech.say(overide||`I heard ${candidateName}, is that really your name?`);
    this.confirmCTAIsShown = true;

    //Each button
    const elements = document.querySelectorAll('.yes-no');
    Array.prototype.forEach.call(elements, (el, i)=>{
      el.onmouseup = (e)=>{
        const target = <HTMLElement>(e.target || e.srcElement);
        const value = target.getAttribute('value');
        if(value === 'true'){
          this.greet(false);
        }
        else{
          this.yourNameIs(`Sorry, I am still learning human pronounciation, what is your name?`);
        }
      }
    });


    this.userSpeach = await this.speech.ask()||'';

    if(this.userSpeach && this.userSpeach !== ''){
      if(/yes/g.test(this.userSpeach) || /no/g.test(this.userSpeach)){

        if(/yes/g.test(this.userSpeach)){
          document.querySelector('#select-yes').classList.add('selected');
          setTimeout(()=>{
            this.greet(true);
            document.querySelector('#select-yes').classList.remove('selected');
          },2000)
        }
        else if(/no/g.test(this.userSpeach)){
          document.querySelector('#select-no').classList.add('selected');
          setTimeout(()=>{
            this.yourNameIs();
          },2000)
        }
      }
      else{
        const candidateName = window.localStorage.getItem('anna-username');
        //heard not yes or no
        this.yourNameIsConfirm(`Are you sure your called ${candidateName}? You can say yes or no, I wont judge.`);
      }
    }
    else{
      this.yourNameIsConfirm()
    }
  }

  greet(voiceUsed:boolean){
    const username = window.localStorage.getItem('anna-username');
    this.hideListeningIndicator()
    this.confirmCTAIsShown = false;

    //emotion
    emotion.setEyeShape({
      eyeSelector:'both',
      shape:'heart',
      speed:300,
      transforms:{
        scale:1,
        morphPrecision: 4,
        reverseFirstPath: true,
        easing: 'easingCubicInOut'
      }
    })
    //triggers

    if(voiceUsed){
      this.text = 'What a lovely voice you have.'
      setTimeout(()=>{
        this.text = this.speech.say(`Hello ${username}, I'd like to get to know you some more.`);
      },4000)
      setTimeout(()=>{
        this.myIntent()
      },8000)
    }
    else{
      this.text = this.speech.say(`Hello ${username}, I'd like to get to know you.`);
      setTimeout(()=>{
        this.myIntent()
      },4000)
    }
    
  }

  myIntent(){
    emotion.setEyeShape({
      eyeSelector:'both',
      shape:'default',
      speed:200,
      transforms:{
        scale:1,
        morphPrecision: 4,
        reverseFirstPath: true,
        easing: 'easingCubicInOut'
      }
    })
    emotion.setEyeShape({
      eyeSelector:'left',
      shape:'default',
      speed:500,
      transforms:{
        scale:.6,
        translateX:20,
        morphPrecision: 4,
        reverseFirstPath: true,
        easing: 'easingCubicInOut'
      }
    })
    console.log('I am going to collect your details')
    //move avatar around
    const score:PersonaScore = {
      'developer':0,
      'project-manager':0,
      'tester':0,
      'ux':0,
      'creative':0
    }
    this.questionOnePictures(score)
  }

  async questionOnePictures(scoreSoFar){
    this.text = this.speech.say('Which of these images do you prefer?');
    this.showListeningIndicator()
    this.manualInputPlaceholder = 'say your choice or type it here...';
    this.userSpeach = '';
    this.manualInputName = 'imageChoice';
    this.questionOneChoicesShown = true;

    emotion.setEyeShape({
      eyeSelector:'both',
      shape:'circle',
      speed:800,
      transforms:{
        scale:.5,
        translateY:25,
        morphPrecision: 4,
        reverseFirstPath: true,
        easing: 'easingCubicInOut'
      }
    })

    const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
    manualInput.onsubmit = (e)=>{
      const formData = new FormData(e.target as HTMLFormElement);
      const choice = <string>formData['get'](this.manualInputName);
      this.clearManualInput();
      const candidateName = window.localStorage.setItem('anna-question-1',choice);
      this.greet(false);
    }
  
    await new Promise(resolve=>{
      //cant do this right now skipping
      resolve();
    })
    this.questionTwoActivities(scoreSoFar)
  }

  async questionTwoActivities(scoreSoFar){
    this.text = this.speech.say("Which activity do you prefer?");
    this.questionOneChoicesShown = false;
    this.questionTwoChoicesShown = true;

    await new Promise(async resolve=>{
      //move to next
      const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
      manualInput.onsubmit = (e)=>{
        const formData = new FormData(e.target as HTMLFormElement);
        const choice = <string>formData['get'](this.manualInputName);
        const safeChoice = choice.toLowerCase();
        
        this.clearManualInput();
        if(safeChoice === 'reading'){
          const values = document.querySelector('#choice-reading').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'talking'){
          const values = document.querySelector('#choice-talking').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'writing'){
          const values = document.querySelector('#choice-writing').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'drawing'){
          const values = document.querySelector('#choice-drawing').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
      }

      const answerByVoice = async ()=>{

        this.userSpeach = await this.speech.ask()||'';
        if(this.userSpeach && this.userSpeach !== ''){
          if(/read/gi.test(this.userSpeach)){
            const values = document.querySelector('#choice-reading').getAttribute('data-value')
            this.keepScore(values, scoreSoFar);
            resolve();
          }
          else if(/talk/gi.test(this.userSpeach)){
            const values = document.querySelector('#choice-talking').getAttribute('data-value')
            this.keepScore(values, scoreSoFar);
            resolve();
          }
          else if(/writ/gi.test(this.userSpeach)){
            const values = document.querySelector('#choice-writing').getAttribute('data-value')
            this.keepScore(values, scoreSoFar);
            resolve();
          }
          else if(/draw/gi.test(this.userSpeach)){
            const values = document.querySelector('#choice-drawing').getAttribute('data-value')
            this.keepScore(values, scoreSoFar);
            resolve();
          }
          else{
            answerByVoice()
          }
        }
      }
      answerByVoice();

      const elements = document.querySelectorAll('#questionTwo .choice');
      Array.prototype.forEach.call(elements, (el, i)=>{
        el.onmouseup = (e)=>{
          const target = <HTMLElement>(e.target || e.srcElement);
          let values = target.getAttribute('data-value');
          this.keepScore(values, scoreSoFar);
          resolve();
        }
      });
    })
    this.questionThreeAsociate(scoreSoFar)
  }

  async questionThreeAsociate(scoreSoFar){
    this.text = this.speech.say("Who do you associate with the most?");
    this.questionTwoChoicesShown = false;
    this.questionThreeChoicesShown = true;

    await new Promise(resolve=>{
      //move to next

      const elements = document.querySelectorAll('#questionThree  .choice');
      Array.prototype.forEach.call(elements, (el, i)=>{
        el.onmouseup = (e)=>{
          const target = <HTMLElement>(e.target || e.srcElement);
          let values = target.getAttribute('data-value');
          this.keepScore(values, scoreSoFar);
          resolve();
        }
      });

      const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
      manualInput.onsubmit = (e)=>{
        const formData = new FormData(e.target as HTMLFormElement);
        const choice = <string>formData['get'](this.manualInputName);
        const safeChoice = choice.toLowerCase();
        
        this.clearManualInput();
        if(safeChoice === 'a'){
          const values = document.querySelector('#choice-peter-pan').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'b'){
          const values = document.querySelector('#choice-pocahontas').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'c'){
          const values = document.querySelector('#choice-walle').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'd'){
          const values = document.querySelector('#choice-lion-king').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }

        const answerByVoice = async ()=>{
          
          this.userSpeach = await this.speech.ask()||'';
          if(this.userSpeach && this.userSpeach !== ''){
            if(/peter/gi.test(this.userSpeach)){
              const values = document.querySelector('#choice-reading').getAttribute('data-value')
              this.keepScore(values, scoreSoFar);
              resolve();
            }
            else if(/peter/gi.test(this.userSpeach)){
              const values = document.querySelector('#choice-talking').getAttribute('data-value')
              this.keepScore(values, scoreSoFar);
              resolve();
            }
            else if(/writ/gi.test(this.userSpeach)){
              const values = document.querySelector('#choice-writing').getAttribute('data-value')
              this.keepScore(values, scoreSoFar);
              resolve();
            }
            else if(/draw/gi.test(this.userSpeach)){
              const values = document.querySelector('#choice-drawing').getAttribute('data-value')
              this.keepScore(values, scoreSoFar);
              resolve();
            }
            else{
              answerByVoice()
            }
          }
        }
        //answerByVoice();

      }
    })
    this.questionFourFunny(scoreSoFar)
  }

  async questionFourFunny(scoreSoFar){
    this.text = this.speech.say("Which of these is the funniest?");
    this.questionThreeChoicesShown = false;
    this.questionFourChoicesShown = true;

    await new Promise(resolve=>{
      //move to next

      const elements = document.querySelectorAll('#questionFour .choice');
      Array.prototype.forEach.call(elements, (el, i)=>{
        el.onmouseup = (e)=>{
          const target = <HTMLElement>(e.target || e.srcElement);
          let values = target.getAttribute('data-value');
          this.keepScore(values, scoreSoFar);
          resolve();
        }
      });

      const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
      manualInput.onsubmit = (e)=>{
        const formData = new FormData(e.target as HTMLFormElement);
        const choice = <string>formData['get'](this.manualInputName);
        const safeChoice = choice.toLowerCase();
        
        this.clearManualInput();
        if(safeChoice === 'a'){
          const values = document.querySelector('#choice-stone').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'b'){
          const values = document.querySelector('#choice-dog-chase').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'c'){
          const values = document.querySelector('#choice-cat-apple').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'd'){
          const values = document.querySelector('#choice-css').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }

      }

    })
    this.questionFiveCake(scoreSoFar)
  }

  async questionFiveCake(scoreSoFar){
    this.text = this.speech.say("Okay, last one.");
    this.questionFourChoicesShown = false;
    this.hideListeningIndicator()

    const readingTime = 6000;
    setTimeout(()=>{
      this.text = this.speech.say("Your friend has made a birthday cake");
    },readingTime)
    
    setTimeout(()=>{
      //show the cake
      this.questionFiveAddonFunnyCake = true;

      this.text = this.speech.say("You feel like they might need a little assistance.");
    },readingTime * 2)

    setTimeout(()=>{

      this.questionFiveAddonFunnyCake = false;

      this.text = this.speech.say("How would you help them out?");
    },readingTime * 3)

    setTimeout(()=>{
      this.questionFiveAddonAnswerA = true;
      this.text = this.speech.say("");
    },readingTime * 4 + 3000)
    setTimeout(()=>{
      this.questionFiveAddonAnswerA = false;
      this.questionFiveAddonAnswerB = true;
      this.text = this.speech.say("");
    },readingTime * 5 + 3000)
    setTimeout(()=>{
      this.questionFiveAddonAnswerB = false;
      this.questionFiveAddonAnswerC = true;
      this.text = this.speech.say("");
    },readingTime * 6 + 3000)
    setTimeout(()=>{
      this.questionFiveAddonAnswerC = false;
      this.questionFiveAddonAnswerD = true;
      this.text = this.speech.say("");
    },readingTime * 7 + 3000)

    setTimeout(()=>{
      this.questionFiveAddonAnswerD = false;
      this.questionFiveChoicesShown = true;
      this.showListeningIndicator()
    },readingTime * 7 + 3000 + readingTime)

    //this.questionFourChoicesShown = true;
    await new Promise(resolve=>{
      //move to next

      const elements = document.querySelectorAll('#questionFive .choice');
      Array.prototype.forEach.call(elements, (el, i)=>{
        el.onmouseup = (e)=>{
          const target = <HTMLElement>(e.target || e.srcElement);
          let values = target.getAttribute('data-value');
          this.keepScore(values, scoreSoFar);
          resolve();
        }
      });

      const manualInput:HTMLFormElement = <HTMLFormElement>document.querySelector('#userManualAnswer')
      manualInput.onsubmit = (e)=>{
        const formData = new FormData(e.target as HTMLFormElement);
        const choice = <string>formData['get'](this.manualInputName);
        const safeChoice = choice.toLowerCase();
        
        this.clearManualInput();
        if(safeChoice === 'a' || safeChoice === 'sprinkles'){
          const values = document.querySelector('#choice-sprinkles').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'b' || safeChoice === 'start again'){
          const values = document.querySelector('#choice-start-again').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'c' || safeChoice === 'backtrack'){
          const values = document.querySelector('#choice-backtrack').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }
        else if(safeChoice === 'd' || safeChoice === 'sausage-rolls'){
          const values = document.querySelector('#choice-sausage-rolls').getAttribute('data-value')
          this.keepScore(values, scoreSoFar);
          resolve();
        }

      }

    })
    this.thanks(scoreSoFar)
  }
  async thanks(scoreSoFar){

    this.text = this.speech.say('I thought you would say that..')
    this.questionFiveChoicesShown = false;
    this.hideListeningIndicator()
    
    const readingTime = 4000;
    setTimeout(()=>{
      this.text = this.speech.say('Thanks for answering my questions')
    }, readingTime);

    await new Promise(resolve=>{

      setTimeout(()=>{
        this.text = this.speech.say('Let me just download a list of jobs that might suit you.')
      }, readingTime * 2);

      setTimeout(()=>{
        this.text = this.speech.say('Based on your answers here are some jobs you might like.')
        this.jobsTableIsShown = true;
      }, readingTime * 3);
      

      setTimeout(()=>{
        resolve()
      }, readingTime * 3);
    });
    this.jobsList(scoreSoFar)
  }
  async jobsList(scoreSoFar){
    const scoreSort = [];
    for(let role in scoreSoFar){
      scoreSort.push({
        role:role,
        value:scoreSoFar[role]
      });
    }
    
    const reliventJobs = scoreSort.filter(role=>role.value > 0);
    const orderByWight = reliventJobs.sort((a, b)=>{
        return a.value - b.value
    })
    const order = orderByWight.reverse();
    
    console.log('SCORED', order)

    
    await new Promise(resolve=>{

      //resolve()
    });

    this.email()
  }
  async email(){
    await new Promise(resolve=>{
      
      //resolve()
    });
    this.reset()
  }
  async reset(){
    console.log('reseting')
    this.idle = true;
  }

  keepScore(values:string,scoreSoFar){
    let valuesArr:string[] = values.split(',');
    valuesArr.forEach(role=>{
      scoreSoFar[role] += 1;
    })
    console.log(scoreSoFar);
  }

  clearManualInput(){
    var elements = document.querySelectorAll('#userManualAnswer input');
    Array.prototype.forEach.call(elements, function(el:HTMLInputElement, i){
      el.setAttribute('value',null);
      el.value = '';
    });
  }

  showConfirmCTA(){
    this.confirmCTAIsShown = true;
  }

  showListeningIndicator(){
    KUTE.to(document.querySelector('#double-wave-closed'), {
      path:'M0,50C40,10,60,10,100,50C140,90,160,90,200,50C240,10,260,10,300,50C340,90,360,90,400,50L400,100L0,100Z'
    },{
      complete(){
        document.querySelector('#double-wave-closed').classList.add('listening');
      }
    }).start()

    this.isListening = true;
  }
  hideListeningIndicator(){
    KUTE.to(document.querySelector('#double-wave-closed'), {
      path:'M-112,61.2c43,0,67,0,120,0c67.9,0,77,0,120,0c67.9,0,79.7,0,120,0c67.9,0,78.3,0,120,0v91.1h-480'
    },{
      complete(){
        document.querySelector('#double-wave-closed').classList.remove('listening');
      }
    }).start()

    this.isListening = false;
  }


}
