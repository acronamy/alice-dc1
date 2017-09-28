import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  say = 'Really long line of text for testing purposes'

}
