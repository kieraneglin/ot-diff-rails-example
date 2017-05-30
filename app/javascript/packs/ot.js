import OtDiff from 'ot-diff';
import unirest from 'unirest';
import App from './posts_cable';
import DiffHelper from './diff_helper';

let opts = {};

App.posts = App.cable.subscriptions.create('PostsChannel', {
  connected: () => {
    DiffHelper.connected(opts, App);
    console.log(DiffHelper);
  },
  received: (data) => {
    DiffHelper.received(data, opts);
    console.log(DiffHelper);
  }
});
