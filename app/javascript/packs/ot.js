import OtDiff from 'ot-diff';
import unirest from 'unirest';
import App from './posts_cable';
import DiffHelper from './diff_helper';

let opts = {};
App.posts = App.cable.subscriptions.create('PostsChannel', {
  connected: () => {
    DiffHelper.connected(opts, App);
  },
  received: (data) => {
    DiffHelper.received(data, opts, App);
  }
});

App.sendTransform = (post, transform) => {
  let url = `http://localhost:3000/transforms/${post}`;
  let body = { transform: JSON.stringify(transform) };

  unirest.patch(url).send(body).end();
};

App.insertTransform = (opts, transform) => {
  let string = opts.textarea.value;
  let updated = string.slice(0, transform.start) + transform.payload + string.slice(transform.start);

  opts.content = updated;
  opts.textarea.value = updated;
};

App.deleteTransform = (opts, transform) => {
  let string = opts.textarea.value;
  let updated = string.slice(0, transform.start) + string.slice(transform.start + transform.remove);

  opts.content = updated;
  opts.textarea.value = updated;
};

App.replaceTransform = (opts, transform) => {
  let string = opts.textarea.value;
  let removed = string.slice(0, transform.start) + string.slice(transform.start + transform.remove);
  let updated = removed.slice(0, transform.start) + transform.payload + removed.slice(transform.start);

  opts.content = updated;
  opts.textarea.value = updated;
};




// document.addEventListener('turbolinks:load', () => {
//   let textarea = document.getElementById('post_body');
//   let postId = document.getElementById('post_id').value;
//
//   window.consumerId = Math.random().toString();
//   window.contents = textarea.value;
//
//   textarea.addEventListener('input', (e) => {
//     let transform = OtDiff.diff(window.contents, textarea.value);
//     transform.sender = window.consumerId;
//
//     PostsCable.sendTransform(postId, transform);
//     window.contents = textarea.value;
//   });
// });
