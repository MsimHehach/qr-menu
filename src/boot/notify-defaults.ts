import { Notify } from 'quasar';

Notify.setDefaults({
  position: 'bottom-right',
  color: 'primary',
  timeout: 4000,

  textColor: 'on-primary',
  multiLine: true,
  classes: 'c-notification notification-text',
  actions: [
    {
      icon: 'close',

      color: 'white',
      class: 'pa-0 ma-0 absolute-top-right',
      // for individual action (button):
      // attrs: {
      //   role: 'Dismiss',
      // },
    },
  ],
});
