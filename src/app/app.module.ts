import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AvatarComponent } from './avatar/avatar.component';
import { StageComponent } from './stage/stage.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    StageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
