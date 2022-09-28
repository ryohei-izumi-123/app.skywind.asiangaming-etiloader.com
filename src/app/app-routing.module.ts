import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@shared/component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    pathMatch: 'prefix',
    loadChildren: '@page/login/login.module#LoginModule'
  },
  {
    path: 'logout',
    pathMatch: 'prefix',
    loadChildren: '@page/logout/logout.module#LogoutModule'
  },
  {
    path: 'lobby',
    pathMatch: 'prefix',
    loadChildren: '@page/lobby/lobby.module#LobbyModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

/**
 *
 *
 * @export
 * @class AppRoutingModule
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
