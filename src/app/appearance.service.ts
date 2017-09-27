import { Injectable } from '@angular/core';

@Injectable()
export class AppearanceService {

  constructor() { }

  avatar = {
    eyeColor:"#2a8fe6",
    eyeSize:20,
    outerDiskColor:"#A5AFB9",
    innerDiskColor:"rgba(24, 28, 33, .9)",
    size:300,
  }

  screen = {
    width:innerWidth,
    height:innerHeight
  }

  position = {
    top: (innerHeight / 2) - (this.avatar.size / 2),
    left: (innerWidth / 2) - (this.avatar.size / 2)
  }

  

}
