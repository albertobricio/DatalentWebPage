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
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

