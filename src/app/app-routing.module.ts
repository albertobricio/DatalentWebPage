import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'newsletter', component: NewsletterComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

