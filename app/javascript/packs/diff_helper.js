import OtDiff from 'ot-diff';
import unirest from 'unirest';

class DiffHelper {
  connected(opts, App) {
    opts.textarea = document.getElementById('post_body');
    opts.content = opts.textarea.value;
    opts.identifier = Math.random().toString();

    opts.textarea.addEventListener('input', () => {
      this._applyDiff(opts);
    });

    return opts;
  }
  received(response, opts) {
    let transform = JSON.parse(response.transform);

    if(transform.sender !== opts.identifier) {
      let updated = OtDiff.transform(opts.textarea.value, transform);

      opts.content = updated;
      opts.textarea.value = updated;
    }
  }
  _applyDiff(opts) {
    let postId = document.getElementById('post_id').value;

    opts.transform = OtDiff.diff(opts.content, opts.textarea.value);
    opts.transform.sender = opts.identifier;

    this._sendTransform(postId, opts.transform);
    opts.content = opts.textarea.value;
  }
  _sendTransform(post, transform) {
    let url = `http://localhost:3000/transforms/${post}`;
    let body = { transform: JSON.stringify(transform) };

    unirest.patch(url).send(body).end();
  }
}

export default new DiffHelper();
