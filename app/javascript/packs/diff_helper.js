import OtDiff from 'ot-diff';
import unirest from 'unirest';

class DiffHelper {
  connected(opts, App) {
    this.buffer = [];
    this.wow = 'test';
    opts.textarea = document.getElementById('post_body');
    opts.content = opts.textarea.value;
    opts.identifier = Math.random().toString();

    opts.textarea.addEventListener('input', () => {
      this._applyDiff(opts);
    });

    return opts;
  }
  received(response, opts) {
    let transform = response.transform;
    let postId = document.getElementById('post_id').value;

    if(transform.sender !== opts.identifier) {
      let updated = OtDiff.transform(opts.textarea.value, transform),
        selectStart = opts.textarea.selectionStart,
        selectEnd = opts.textarea.selectionEnd;

      opts.content = updated;
      opts.textarea.value = updated;

      opts.textarea.selectionStart = selectStart;
      opts.textarea.selectionEnd = selectEnd;
    } else {
      this.buffer.shift();

      if(this.buffer.length > 0) {
        this._sendTransform(postId, this.buffer);
      }
    }
  }
  _applyDiff(opts) {
    let postId = document.getElementById('post_id').value;

    opts.transform = OtDiff.diff(opts.content, opts.textarea.value);
    opts.content = opts.textarea.value;
    opts.transform.sender = opts.identifier;
    opts.transform.post = opts.content;

    this.buffer.push(opts.transform);
    if(this.buffer.length === 1) {
      this._sendTransform(postId, this.buffer);
    }
  }
  _sendTransform(post, buffer) {
    let url = `https://ot-diff.herokuapp.com/transforms/${post}`,
      body = { transform: JSON.stringify(buffer[0]) };

    unirest.patch(url).send(body).end();
  }
}

export default new DiffHelper();
