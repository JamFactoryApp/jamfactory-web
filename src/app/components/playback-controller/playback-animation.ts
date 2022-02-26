import {trigger, keyframes, state, style, transition, animate} from '@angular/animations';

export const PlaybackAnimation = [
  trigger('playbackAnimation', [
    state('*', style({
      backgroundPosition: 'right {{songProgress}}% bottom 100%',
    }), {params: {songProgress: 0}}),
    state('false', style({
      backgroundPosition: 'right {{songProgress}}% bottom 100%',
    }), {params: {songProgress: 0}}),
    state('true', style({
      backgroundPosition: 'right 100% bottom 100%',
    })),
    transition('* => true', [
      animate('{{duration}}s ease-in')
    ], {params: {duration: 0}}),
    transition('false => true', [
      animate('{{duration}}s ease-in')
    ], {params: {duration: 0}}),
    transition('true => false', [
      animate('0.5s')
    ]),
    // transition('* <=> *', [
    //   animate('{{duration}}s ease-in', keyframes([
    //     style({backgroundPosition: 'right {{songProgress}}% bottom 100%'}),
    //     style({backgroundPosition: 'right 100% bottom 100%'})
    //   ]))
    // ], {params: {songProgress: 0, duration: 1}}),
    //   transition('false => true', [
    //     animate('{{duration}}s ease-in', keyframes([
    //       style({backgroundPosition: 'right {{songProgress}}% bottom 100%'}),
    //       style({backgroundPosition: 'right 100% bottom 100%'})
    //     ]))
    //   ], {params : { songProgress: 0, duration: 1 }}),
    // ]),
  ]),
];
