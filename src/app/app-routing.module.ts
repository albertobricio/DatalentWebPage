import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

