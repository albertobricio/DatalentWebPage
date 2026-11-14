import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  // La portada vive en "/", no en "/home". Antes la raíz redirigía a /home:
  // la URL que veía y compartía el visitante era /home mientras el canónico
  // decía "/", y el enlace "Inicio" de la cabecera nunca se marcaba como
  // activo porque compara con "/". /home se conserva como redirección para
  // no romper los enlaces que ya circulan.
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/services/services-hub/services-hub.component').then(
        (m) => m.ServicesHubComponent,
      ),
  },
  {
    path: 'servicios/gobernanza-ia',
    loadComponent: () =>
      import('./pages/services/ai-governance/ai-governance.component').then(
        (m) => m.AiGovernanceComponent,
      ),
  },
  {
    path: 'servicios/agentic-ai-rrhh',
    loadComponent: () =>
      import('./pages/services/agentic-ai/agentic-ai.component').then(
        (m) => m.AgenticAiComponent,
      ),
  },
  {
    path: 'servicios/compensacion-total-rewards',
    loadComponent: () =>
      import('./pages/services/compensation-total-rewards/compensation-total-rewards.component').then(
        (m) => m.CompensationTotalRewardsComponent,
      ),
  },
  {
    path: 'servicios/workforce-intelligence',
    loadComponent: () =>
      import('./pages/services/workforce-intelligence/workforce-intelligence.component').then(
        (m) => m.WorkforceIntelligenceComponent,
      ),
  },
  {
    path: 'servicios/people-analytics',
    loadComponent: () =>
      import('./pages/services/people-analytics/people-analytics.component').then(
        (m) => m.PeopleAnalyticsComponent,
      ),
  },
  {
    path: 'por-que-datalent',
    loadComponent: () =>
      import('./pages/why-datalent/why-datalent.component').then((m) => m.WhyDatalentComponent),
  },
  {
    path: 'confianza',
    loadComponent: () =>
      import('./pages/trust/trust.component').then((m) => m.TrustComponent),
  },
  // Una URL que no existe muestra una página de error con salidas, no la
  // portada. Redirigir todo a "/" hacía que un enlace roto pareciera
  // funcionar: el visitante aterrizaba en Home sin saber que lo que buscaba
  // no estaba, y para un buscador cada URL inventada era una copia de la
  // portada (un "soft 404").
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

@NgModule({
  imports: [
    // Sin scrollPositionRestoration, Angular conserva el scroll entre rutas:
    // pulsar una tarjeta al final de Home abría la página de destino a media
    // altura. 'enabled' sube arriba en cada navegación y restaura la posición
    // al volver atrás. anchorScrolling hace que /servicios#radar baje a la
    // tarjeta (el menú y el pie enlazan así a cada solución).
    //
    // initialNavigation 'enabledBlocking': Angular no pinta nada hasta haber
    // resuelto la primera ruta, incluida la descarga de su chunk. Sin esto,
    // en cualquier página que no fuera Home pasaba lo siguiente: el HTML
    // prerenderizado se veía bien, Angular arrancaba y lo sustituía por
    // cabecera + <main> vacío + pie (el pie subía hasta arriba), y cuando
    // llegaba el chunk de la página el pie volvía a bajar. Medido con
    // Lighthouse en móvil: CLS de 0,93 (el umbral de "bueno" es 0,1) y LCP
    // de 5,4 s en Contacto, Confianza y las páginas de servicio, frente a
    // CLS 0 en Home, que no carga chunk. Ahora el HTML prerenderizado sigue
    // en pantalla hasta que la página completa está lista para sustituirlo.
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

