import { Injectable } from '@angular/core';

@Injectable()
export class SpeachService {

  recognition:any;
  constructor() {
    this.recognition = new (window['SpeechRecognition'] || window['webkitSpeechRecognition'] || window['mozSpeechRecognition'] || window['msSpeechRecognition'])();
    this.recognition.lang = 'en-GB';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 5;
    this.recognition.continuous = true;
  }
  
  say(message){
    //updates the text to say
    return message;
  }
  
  stopListening(){
    this.recognition.abort();
  }

  ask(){
    this.recognition.abort();
    setTimeout(()=>{
      this.recognition.start();
      console.log('starting speach recognition.')
    },800)

    return new Promise(resolve=>{
      
      this.recognition.onresult = event=> {
          console.log('You said: ', event.results[0][0].transcript);
          let speech = event.results[0][0].transcript;
          resolve(speech);
          console.log('stopping speech recognition')
          this.recognition.stop();
      };

    });

  }

}
