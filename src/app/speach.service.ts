import { Injectable } from '@angular/core';


@Injectable()
export class SpeachService {

  recognition:any;
  constructor() {
    const speechRecognitionApi:any = window['webkitSpeechRecognition'];
    const recognition = new (speechRecognitionApi)();
    this.recognition = recognition;
    this.recognition.lang = 'en-GB';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 5;
  }
  
  say(message){
    return message;
  }
  
  ask(){
    this.recognition.start();
    
    return new Promise(resolve=>{
      this.recognition.onresult = function(event) {
        const answer = event.results[0][0].transcript;  
        resolve(answer);
      };
    });

  }

}
