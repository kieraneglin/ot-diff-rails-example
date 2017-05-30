import OtDiff from 'ot-diff';

class DiffHelper {
  connected(opts, App) {
    let postId = document.getElementById('post_id').value;

    opts.textarea = document.getElementById('post_body');
    opts.content = opts.textarea.value;
    opts.identifier = Math.random().toString();

    opts.textarea.addEventListener('input', () => {
      opts.transform = OtDiff.diff(opts.content, opts.textarea.value);
      opts.transform.sender = opts.identifier;

      App.sendTransform(postId, opts.transform);
      opts.content = opts.textarea.value;
    });

    return opts;
  }
  received(response, opts, App) {
    let transform = JSON.parse(response.transform);

    if(transform.sender !== opts.identifier) {
      if(transform.action === 'insert') {
        App.insertTransform(opts, transform);
      } else if(transform.action === 'delete') {
        App.deleteTransform(opts, transform);
      } else if(transform.action === 'replace') {
        App.replaceTransform(opts, transform);
      } else if(transform.action === 'noop') {
        return;
      }
    }
  }
}

export default new DiffHelper();
