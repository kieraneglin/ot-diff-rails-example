import OtDiff from 'ot-diff';
import unirest from 'unirest';
import App from './posts_cable';
import DiffHelper from './diff_helper';

import OT from './operational-transformation';

let transformer = new OT();
let channel = {
  channel: 'PostsChannel',
  post_id: document.getElementById('post_id').value
};

App.posts = App.cable.subscriptions.create(channel, {
  connected() {
    console.log('connected');
  },
  received(data) {
    if (data.action === 'connected') {
      transformer.clientId = data.client_id;
      transformer.setup(App);

      return;
    }
    console.log(data);
  }
});
