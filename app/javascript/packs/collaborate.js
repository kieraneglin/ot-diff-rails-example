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
  received(data) {
    if (data.action === 'connected') {
      transformer.setup(App, data);
      return;
    }
    transformer.apply(data);
  }
});
