import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'newsletter', component: NewsletterComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
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
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

