import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from '@page/logout/logout.component';
import { PageNotFoundComponent } from '@shared/component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index'
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: LogoutComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { view: 'default' }
  }
];

/**
 *
 *
 * @export
 * @class LogoutRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LogoutRoutingModule {}
