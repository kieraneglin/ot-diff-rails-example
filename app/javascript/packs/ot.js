import OtDiff from 'ot-diff';

import PostsCable from './posts_cable';

document.addEventListener('turbolinks:load', () => {
  let textarea = document.getElementById('post_body');
  let postId = document.getElementById('post_id').value;

  window.consumerId = Math.random().toString();
  window.contents = textarea.value;

  textarea.addEventListener('input', (e) => {
    let transform = OtDiff.diff(window.contents, textarea.value);
    transform.sender = window.consumerId;

    PostsCable.sendTransform(postId, transform);
    window.contents = textarea.value;
  });
});
