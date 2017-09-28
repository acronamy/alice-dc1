import { Injectable } from '@angular/core';
import * as anime from "animejs";

interface Coordinate{
  top:number,
  left:number
}

@Injectable()
export class AppearanceService {

  constructor() {
  }

  get wrapper(){
    return document.querySelector('#move-wrapper'); 
  }

  avatar = {
    eyeColor:"#2a8fe6",
    eyeSize:20,
    outerDiskColor:"#A5AFB9",
    innerDiskColor:"rgba(24, 28, 33, .9)",
    size:300,
  }

  static publicAvatar = {
    size:300
  }

  screen = {
    width:innerWidth,
    height:innerHeight
  }

  position = {
    top: (innerHeight / 2) - (this.avatar.size / 2),
    left: (innerWidth / 2) - (this.avatar.size / 2)
  }

  
  public async initialPosition(){
    let self = this;

    return new Promise(async resolve=>{
      this.wrapper.setAttribute('style','transform:translateY('+self.position.top+'px) translateX('+self.position.left+'px);');
      resolve({
        top:self.position.top,
        left:self.position.left
      } as Coordinate)
    })
  }

  public initialEmotion(){

  }

}
