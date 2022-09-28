import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import {
  Validators,
  AbstractControl,
  FormControl,
  FormGroup
} from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import {
  NEVER as NEVER$,
  Observable,
  of as of$,
  Subscription,
  from as fromPromise
} from 'rxjs';
import { take, delay, catchError, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CommonModalComponent } from '@shared/component/common-modal/common-modal.component';
import { ILoginParam } from '@shared/interface';
import { APP_LOGIN_CREDENTIALS, toTokenize } from '@shared/token';
import { ModalService, AuthService, StorageService } from '@shared/service';

/**
 *
 *
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof LoginComponent
   */
  private _isBusy: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LoginComponent
   */
  public set isBusy(isBusy: boolean) {
    this._isBusy = isBusy;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LoginComponent
   */
  public get isBusy(): boolean {
    return this._isBusy;
  }

  /**
   *
   *
   * @private
   * @type {Error}
   * @memberof LoginComponent
   */
  private _error: Error;

  /**
   *
   *
   * @public
   * @type {Error}
   * @memberof LoginComponent
   */
  public get error(): Error {
    return this._error;
  }

  /**
   *
   *
   * @public
   * @type {Error}
   * @memberof LoginComponent
   */
  public set error(error: Error) {
    if (_.isError(error)) {
      this._error = error;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof LoginComponent
   */
  private _storeKey: string = toTokenize(APP_LOGIN_CREDENTIALS);

  /**
   *
   *
   * @readonly
   * @type {FormGroup}
   * @memberof LoginComponent
   */
  public get form(): FormGroup {
    return this._form;
  }

  /**
   *
   *
   * @type {FormGroup}
   * @memberof LoginComponent
   */
  private _form: FormGroup;

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof LoginComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of LoginComponent.
   * @param {ModalService} _modalSvc
   * @param {StorageService} _storageSvc
   * @param {TranslateService} _translateSvc
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LoginComponent
   */
  public constructor(
    private _modalSvc: ModalService,
    private _storageSvc: StorageService,
    private _translateSvc: TranslateService,
    private _authSvc: AuthService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof LoginComponent
   */
  public ngOnInit() {
    this.initForm();
  }

  /**
   *
   *
   * @memberof LoginComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {string} ctrl
   * @param {FormGroup} [form=this._form]
   * @returns {AbstractControl}
   * @memberof LoginComponent
   */
  public getFormCtrl(
    ctrl: string,
    form: FormGroup = this._form
  ): AbstractControl {
    return form.get(ctrl);
  }

  /**
   *
   *
   * @param {string} group
   * @param {FormGroup} [form=this._form]
   * @returns {FormGroup}
   * @memberof LoginComponent
   */
  public getFormGroup(group: string, form: FormGroup = this._form): FormGroup {
    return form.controls
      ? (_.get(form.controls, `${group}`) as FormGroup)
      : form;
  }

  /**
   *
   *
   * @param {string} group
   * @param {string} [ctrl=null]
   * @param {FormGroup} [form=this._form]
   * @returns {*}
   * @memberof LoginComponent
   */
  public getFormValue(
    group: string,
    ctrl: string = null,
    form: FormGroup = this._form
  ): any {
    const formGroup: FormGroup = this.getFormGroup(group, form);
    const value: any = formGroup ? formGroup.value : form.value;
    if (!_.isEmpty(ctrl) && _.has(value, ctrl)) {
      return _.get(value, ctrl);
    }

    return value;
  }

  /**
   *
   *
   * @memberof LoginComponent
   */
  public initForm(): void {
    this._form = new FormGroup({
      playerCode: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32)
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32)
        ])
      ),
      remember: new FormControl(false, Validators.compose([]))
    });

    const {
      playerCode,
      password,
      remember
    }: ILoginParam = this.restoreCredentials();
    if (remember) {
      this.getFormCtrl('playerCode').setValue(playerCode);
      this.getFormCtrl('password').setValue(password);
      this.getFormCtrl('remember').setValue(remember);
    }
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {Observable<string>}
   * @memberof LoginComponent
   */
  public translate$(key: string, params: any = {}): Observable<string> {
    return this._translateSvc.get(key, params).pipe(take(1));
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {string}
   * @memberof LoginComponent
   */
  public translate(key: string, params: any = {}): string {
    return this._translateSvc.instant(key, params);
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof LoginComponent
   */
  public onSubmit(): Subscription {
    const navigationExtras: NavigationExtras = {};
    const playerCode: string = this.getFormCtrl('playerCode').value;
    const password: string = this.getFormCtrl('password').value;
    const remember: boolean = this.getFormCtrl('remember').value;
    const payload: ILoginParam = { playerCode, password };
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;

    return this._subscription.add(
      this._authSvc
        .attempt$(payload)
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = error;
            this.showDialog(
              this.translate('error'),
              this.translate('invalidLogin')
            );

            return NEVER$;
          }),
          take(1)
        )
        .subscribe(() => {
          this.flushCredentials();
          if (remember) {
            this.storeCredentials({ playerCode, password, remember });
          }

          return this._subscription.add(
            this.navigate$(['/lobby'], navigationExtras).subscribe()
          );
        })
    );
  }

  /**
   *
   *
   * @param {string} title
   * @param {string} body
   * @memberof LoginComponent
   */
  public showDialog(title: string, body: string): void {
    const modalRef$: NgbModalRef = this._modalSvc.open('CommonModalComponent');
    if (modalRef$) {
      (<CommonModalComponent>modalRef$.componentInstance).title = title;
      (<CommonModalComponent>modalRef$.componentInstance).body = body;
    }
  }

  /**
   *
   *
   * @private
   * @param {any[]} commands
   * @param {NavigationExtras} navigationExtras
   * @returns {Observable<boolean>}
   * @memberof LoginComponent
   */
  private navigate$(
    commands: any[],
    navigationExtras?: NavigationExtras,
    duration: number = 100
  ): Observable<boolean> {
    return fromPromise(this._router.navigate(commands, navigationExtras)).pipe(
      delay(duration),
      catchError(() => of$(false)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @returns {ILoginParam}
   * @memberof LoginComponent
   */
  private restoreCredentials(): ILoginParam {
    return (
      this._storageSvc.get(this._storeKey) || {
        playerCode: undefined,
        password: undefined,
        remember: false
      }
    );
  }

  /**
   *
   *
   * @private
   * @param {ILoginParam} param
   * @memberof LoginComponent
   */
  private storeCredentials(param: ILoginParam): void {
    this._storageSvc.set(this._storeKey, param);
  }

  /**
   *
   *
   * @private
   * @memberof LoginComponent
   */
  private flushCredentials(): void {
    this._storageSvc.remove(this._storeKey);
  }
}
