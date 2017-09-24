import { Component } from '@angular/core';
import { AppearanceService } from "./appearance.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[
    AppearanceService
  ]
})
export class AppComponent {
  constructor(
    private appearance:AppearanceService
  ){}
}
