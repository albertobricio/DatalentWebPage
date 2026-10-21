import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
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
  { path: '**', redirectTo: '' }
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

