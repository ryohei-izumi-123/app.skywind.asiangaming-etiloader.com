// test
import { inject, TestBed, async } from '@angular/core/testing';

// platform
import {
  BrowserModule,
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

// pipe
import { Nl2brPipe } from './nl2br.pipe';

describe('Nl2brPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule]
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (_domSanitizer: DomSanitizer) => {
      const pipe = new Nl2brPipe(_domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
