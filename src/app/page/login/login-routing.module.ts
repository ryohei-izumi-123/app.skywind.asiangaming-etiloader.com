import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@page/login/login.component';
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
    component: LoginComponent
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
 * @class LoginRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule {}
