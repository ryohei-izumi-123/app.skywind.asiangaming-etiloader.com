import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ElectronService } from '@shared/service/electron.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof NetworkService
   */
  public set status(status: boolean) {
    this._statusSubject.next(status);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof NetworkService
   */
  public get status(): boolean {
    return this._statusSubject.getValue();
  }
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof AuthService
   */
  private _statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(window.navigator.onLine);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof AuthService
   */
  public status$: Observable<boolean> = this._statusSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof NetworkService
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of NetworkService.
   * @memberof NetworkService
   */
  public constructor(
    @Inject(ElectronService) private _electronSvc: ElectronService
  ) {
    this._subscription.add(this.status$.pipe().subscribe());
    window.addEventListener('online', this.setStatus.bind(this));
    window.addEventListener('offline', this.setStatus.bind(this));
    this.setStatus();
  }

  /**
   *
   *
   * @memberof NetworkService
   */
  public ngOnDestroy() {
    this._statusSubject.complete();
    this._subscription.unsubscribe();
    window.removeEventListener('online', this.setStatus.bind(this));
    window.removeEventListener('offline', this.setStatus.bind(this));
  }

  /**
   *
   *
   * @memberof NetworkService
   */
  private setStatus(): void {
    this.status = window.navigator.onLine;
    this._electronSvc.sendRequestNetworkStatus({ status: this.status });
  }
}
