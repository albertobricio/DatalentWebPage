import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

// Red de seguridad: si alguien llega al dominio de producción por HTTP, pasa a
// HTTPS. La redirección de verdad la hace GitHub Pages ("Enforce HTTPS"); esto
// solo cubre el caso de que esa opción se desactive por error. No sustituye a
// HSTS: un script que corre en una página ya servida sin cifrar no protege de
// quien esté en medio de la conexión.
//
// Antes la condición era "cualquier host que no sea localhost" y la URL de
// destino se construía sin el puerto. Resultado: abrir el sitio en
// 127.0.0.1:4200 o en la IP de la red local (lo que se hace para probarlo en
// un móvil real) redirigía a https://<ip>/ y daba "no se puede acceder a este
// sitio". Tampoco se podía auditar con herramientas que usan 127.0.0.1. Ahora
// solo actúa en el dominio propio.
if (location.protocol === 'http:' && /(^|\.)datalentsolutions\.com$/.test(location.hostname)) {
  location.replace('https://' + location.host + location.pathname + location.search + location.hash);
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule)]
}).catch(err => console.error(err));
