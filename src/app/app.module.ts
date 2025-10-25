import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, HomeComponent, MapComponent],
  providers: []
})
export class AppModule {}
