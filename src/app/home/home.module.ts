import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
import { CalendarComponent } from '../components/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];


@NgModule({
  declarations: [HomeComponent, CalendarComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class HomeModule {

}

