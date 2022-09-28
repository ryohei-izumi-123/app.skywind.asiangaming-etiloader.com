// test
import { inject, TestBed } from '@angular/core/testing';

// http
import { HttpClient } from '@angular/common/http';

// ngx-translate
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';

// app
import { TranslateLoaderFactory } from '@app/app.module';

// pipe
import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: TranslateLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    });
  });
  it('create an instance', inject(
    [TranslateService],
    (_translateSvc: TranslateService) => {
      const pipe = new StatusPipe(_translateSvc);
      expect(pipe).toBeTruthy();
    }
  ));
});
