import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { NewEntryComponent } from '../components/new-entry/new-entry.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent, CalendarComponent, NewEntryComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
})
export class HomeModule {

}

