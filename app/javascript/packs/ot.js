import OtDiff from 'ot-diff';

import PostsCable from './posts_cable';

document.addEventListener('turbolinks:load', () => {
  let textarea = document.getElementById('post_body');
  let postId = document.getElementById('post_id').value;

  let contents = textarea.value;

  textarea.addEventListener('input', () => {
    let transform = OtDiff.diff(contents, textarea.value);

    PostsCable.sendTransform(postId, transform);
    contents = textarea.value;
  });
});
