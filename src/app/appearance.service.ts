import { Injectable } from '@angular/core';

@Injectable()
export class AppearanceService {

  constructor() { }

  avatar = {
    eyeColor:"#007abc",
    eyeSize:20,
    eyeLightStrength:.5,
    outerDiskColor:"#A5AFB9",
    innerDiskColor:"rgba(24, 28, 33, .9)",
    size:300,
  }

  screen = {
    width:innerWidth,
    height:innerHeight
  }

}
