import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withDebugTracing } from '@angular/router';
import { StepperEditableComponent } from './components/stepper-editable/stepper-editable.component';
import { ApplicationConfig } from '@angular/platform-browser';
import { CombinationsTableComponent } from './components/combinations-table/combinations-table.component';

export const routes: Routes = [
  { path: 'app-stepper-editable', component: StepperEditableComponent },
  { path: 'app-combinations-table', component: CombinationsTableComponent },
];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withDebugTracing())]
}
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
