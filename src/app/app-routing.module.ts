import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplacementsComponent } from './components/displacements/displacements.component';

const routes: Routes = [{ path: '', component: DisplacementsComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
