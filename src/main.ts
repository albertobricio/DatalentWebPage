import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

// Seguridad: Forzar HTTPS en producción
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.href = 'https://' + location.hostname + location.pathname + location.search + location.hash;
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule)]
}).catch(err => console.error(err));
