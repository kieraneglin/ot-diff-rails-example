import OtDiff from 'ot-diff';

document.addEventListener('turbolinks:load', () => {
  let textarea = document.getElementById('post_body');
  let contents = textarea.value;

  textarea.addEventListener('input', () => {
    console.log(OtDiff.diff(contents, textarea.value));
    contents = textarea.value;
  });
});
