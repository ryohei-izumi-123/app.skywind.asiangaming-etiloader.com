import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { LobbyRoutingModule } from '@page/lobby/lobby-routing.module';
import { LobbyComponent } from '@page/lobby/lobby.component';

/**
 *
 *
 * @export
 * @class LobbyModule
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LobbyRoutingModule
  ],
  declarations: [LobbyComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LobbyComponent]
})
export class LobbyModule {}
