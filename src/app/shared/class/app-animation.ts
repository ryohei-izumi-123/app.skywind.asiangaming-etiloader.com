import {
  trigger,
  state,
  animate,
  style,
  transition
} from '@angular/animations';

/**
 *
 */
export const SlideContentAnimation = [
  trigger('SlideFadeAnimation', [
    state('fadeOut', style({ opacity: 0 })),
    state('fadeIn', style({ opacity: 1 })),
    transition('* => fadeIn', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
  ]),
  trigger('SlideContentAnimation', [
    state(
      'void',
      style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })
    ),
    state('enter', style({ transform: 'none', opacity: 1 })),
    state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
  ])
];

/**
 *
 */
export const OnSideNavChangeAnimation = [
  trigger('OnSideNavChangeAnimation', [
    state('close', style({ width: '64px' })),
    state('open', style({ width: '250px' })),
    transition('close => open', animate('250ms ease-in')),
    transition('open => close', animate('250ms ease-in'))
  ])
];

/**
 *
 */
export const OnPageReadyAnimation = [
  trigger('OnPageReadyAnimation', [
    state('inactive', style({ opacity: 0.4 })),
    state('active', style({ opacity: 1 })),
    transition('inactive => active', animate('250ms ease-in')),
    transition('active => inactive', animate('250ms ease-in'))
  ])
];

/**
 * define animation for toggle row expand/collapse
 */
export const ToggleExpandAnimation = [
  trigger('ToggleExpandAnimation', [
    state('collapsed', style({ height: '0', minHeight: '0', display: 'none' })),
    state('expanded', style({ height: '*' })),
    transition(
      'expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    )
  ])
];

/**
 *
 */
export const MoveInAnimation = () => {
  return trigger('MoveInAnimation', [
    state('void', style({ position: 'fixed', width: '100%' })),
    state('*', style({ position: 'fixed', width: '100%' })),
    transition(': enter', [
      style({ opacity: '0', transform: 'translateX(100px)' }),
      animate(
        '.6s ease-in-out',
        style({ opacity: '1', transform: 'translateX(0)' })
      )
    ]),
    transition(': leave', [
      style({ opacity: '1', transform: 'translateX(0)' }),
      animate(
        '.3s ease-in-out',
        style({ opacity: '0', transform: 'translateX(-200px)' })
      )
    ])
  ]);
};

/**
 *
 */
export const FallInAnimation = () => {
  return trigger('FallInAnimation', [
    transition(': enter', [
      style({ opacity: '0', transform: 'translateY(40px)' }),
      animate(
        '.4s .2s ease-in-out',
        style({ opacity: '1', transform: 'translateY(0)' })
      )
    ]),
    transition(': leave', [
      style({ opacity: '1', transform: 'translateX(0)' }),
      animate(
        '.3s ease-in-out',
        style({ opacity: '0', transform: 'translateX(-200px)' })
      )
    ])
  ]);
};

/**
 *
 */
export const MoveInLeftAnimation = () => {
  return trigger('MoveInLeftAnimation', [
    transition(': enter', [
      style({ opacity: '0', transform: 'translateX(-100px)' }),
      animate(
        '.6s .2s ease-in-out',
        style({ opacity: '1', transform: 'translateX(0)' })
      )
    ])
  ]);
};

/**
 * https://coursetro.com/posts/code/32/Create-a-Full-Angular-Authentication-System-with-Firebase
 * @usage
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css'],
  animations: [MoveInAnimation(), FallInAnimation(), MoveInLeftAnimation()],
  host: {'[@MoveInAnimation]': ''}
})
    <section id="page" [@MoveInLeftAnimation]="state">
    </section>
 *
 */
