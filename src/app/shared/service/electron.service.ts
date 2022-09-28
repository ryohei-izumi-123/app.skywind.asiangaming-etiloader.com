import { Injectable, OnDestroy } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, skipWhile, take } from 'rxjs/operators';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { IGameRequest, ISoundOptions } from '@shared/interface';

/**
 *
 *
 * @export
 * @class ElectronService
 */
@Injectable({
  providedIn: 'root'
})
export class ElectronService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof ElectronService
   */
  private _windowStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(null);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof ElectronService
   */
  public windowState$: Observable<
    boolean
  > = this._windowStateSubject.asObservable().pipe(
    filter((windowState: boolean) => windowState !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @memberof ElectronService
   */
  public set windowState(windowState: boolean) {
    this._windowStateSubject.next(windowState);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof ElectronService
   */
  public get windowState(): boolean {
    return this._windowStateSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof ElectronService
   */
  private _isOpenDialogSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof ElectronService
   */
  public isOpenDialog$: Observable<
    boolean
  > = this._isOpenDialogSubject.asObservable().pipe(
    filter((isOpenDialog: boolean) => isOpenDialog !== null),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @memberof ElectronService
   */
  public set isOpenDialog(isOpenDialog: boolean) {
    this._isOpenDialogSubject.next(isOpenDialog);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof ElectronService
   */
  public get isOpenDialog(): boolean {
    return this._isOpenDialogSubject.getValue();
  }

  /**
   *
   *
   * @type {typeof ipcRenderer}
   * @memberof ElectronService
   */
  public ipcRenderer: typeof ipcRenderer;

  /**
   *
   *
   * @type {typeof webFrame}
   * @memberof ElectronService
   */
  public webFrame: typeof webFrame;

  /**
   *
   *
   * @type {typeof remote}
   * @memberof ElectronService
   */
  public remote: typeof remote;

  /**
   *
   *
   * @type {typeof childProcess}
   * @memberof ElectronService
   */
  public childProcess: typeof childProcess;

  /**
   *
   *
   * @type {typeof fs}
   * @memberof ElectronService
   */
  public fs: typeof fs;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ElectronService
   */
  get isElectron(): boolean {
    return window && window.process && window.process.type;
  }

  /**
   *Creates an instance of ElectronService.
   * @memberof ElectronService
   */
  public constructor() {
    if (this.isElectron) {
      this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
      this.webFrame = (<any>window).require('electron').webFrame;
      this.remote = (<any>window).require('electron').remote;
      this.childProcess = (<any>window).require('child_process');
      this.fs = (<any>window).require('fs');
      this.ipcRenderer
        .on(
          'ipc-reply-change-window-state',
          this.onReplyChangeWindowState.bind(this)
        )
        .on('ipc-reply-check-game', this.onReplyCheckGame.bind(this))
        .on('ipc-reply-show-dialog', this.onReplyShowDialog.bind(this));
      this.sendRequestWindowState();
    }
  }

  /**
   *
   *
   * @memberof ElectronService
   */
  public ngOnDestroy() {
    this._windowStateSubject.complete();
  }

  /**
   *
   *
   * @private
   * @param {Event} event
   * @param {boolean} windowState
   * @memberof ElectronService
   */
  private onReplyChangeWindowState(event: Event, windowState: boolean) {
    this._windowStateSubject.next(windowState);
  }

  /**
   *
   *
   * @private
   * @param {Event} event
   * @param {boolean} isExists
   * @memberof ElectronService
   */
  private onReplyCheckGame(event: Event, isExists: boolean) {}

  /**
   *
   *
   * @private
   * @param {Event} event
   * @param {number} result
   * @memberof ElectronService
   */
  private onReplyShowDialog(event: Event, result: number) {
    this.isOpenDialog = false;
  }

  /**
   *
   *
   * @memberof ElectronService
   */
  public sendRequestLogout(): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-logout');
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @memberof ElectronService
   */
  public sendRequestWindowState(): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-window-state');
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {IGameRequest} payload
   * @memberof ElectronService
   */
  public sendRequestOpenGame(payload: IGameRequest): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-open-game', payload);
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {IGameRequest} payload
   * @memberof ElectronService
   */
  public sendRequestCheckGame(payload: IGameRequest): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-check-game', payload);
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {{ message: string }} [payload={ message: undefined }]
   * @memberof ElectronService
   */
  public sendRequestShowDialog(
    payload: { message: string } = { message: undefined }
  ): void {
    try {
      if (this.isElectron) {
        this.isOpenDialog$
          .pipe(
            skipWhile((isOpen: boolean) => isOpen),
            take(1)
          )
          .subscribe(() =>
            this.ipcRenderer.send('ipc-request-show-dialog', payload)
          );
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @memberof ElectronService
   */
  public sendRequestFullscreen(): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-fullscreen');
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {ISoundOptions} payload
   * @memberof ElectronService
   */
  public sendRequestChangeVolume(payload: ISoundOptions): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-change-volume', payload);
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {{ status: boolean }} [payload={ status: false }]
   * @memberof ElectronService
   */
  public sendRequestNetworkStatus(payload: { status: boolean }): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-network-status', payload);
      }
    } catch (error) {}
  }

  /**
   *
   *
   * @param {({ env: string })} payload
   * @memberof ElectronService
   */
  public sendSetEnv(payload: { env: string }): void {
    try {
      if (this.isElectron) {
        this.ipcRenderer.send('ipc-request-set-env', payload);
      }
    } catch (error) {}
  }
}
