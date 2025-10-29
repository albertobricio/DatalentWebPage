import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { MainTopbarComponent } from './components/main-topbar/main-topbar.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HomeComponent,
    MapComponent, 
    FooterComponent,
    MainTopbarComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AppModule {}
