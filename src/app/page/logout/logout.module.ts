import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { LogoutRoutingModule } from '@page/logout/logout-routing.module';
import { LogoutComponent } from '@page/logout/logout.component';

/**
 *
 *
 * @export
 * @class LogoutModule
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LogoutRoutingModule
  ],
  declarations: [LogoutComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LogoutComponent]
})
export class LogoutModule {}
