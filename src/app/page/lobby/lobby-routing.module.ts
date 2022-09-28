import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@shared/component';
import { AuthGuard } from '@shared/guard';
import { LobbyComponent } from './lobby.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index'
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: LobbyComponent,
    canActivate: [AuthGuard]
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
 * @class LobbyRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LobbyRoutingModule {}
