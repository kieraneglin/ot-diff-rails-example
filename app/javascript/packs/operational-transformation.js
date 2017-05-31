import request from 'request';
import OtDiff from 'ot-diff';
import Cursor from './cursor';

class OperationalTransformation {
  constructor() {
    this.buffer = [];
  }

  setup(App, data) {
    this.clientId = data.client_id;
    this.postId = JSON.parse(App.posts.identifier).post_id;
    this._setupEventListeners(() => {
      this._createDiff();
      if(this.buffer.length === 1) {
        this.content = this.textarea.value;
        this._sendDiff();
      }
    });
  }

  apply(data) {
    if(data.transform.sender !== this.clientId) {
      this.content = OtDiff.transform(this.textarea.value, data.transform);
      Cursor.preserve(this.textarea);
      this.textarea.value = this.content;
      Cursor.restore(data.transform);
    } else {
      this.buffer.shift();
      if(this.buffer.length > 0) {
        this._sendDiff();
      } else {
        this.content = this.textarea.value;
      }
    }
  }

  update(data) {
    this.textarea.value = data.post;
  }

  _setupEventListeners(callback) {
    this.textarea = document.getElementById('post_body');
    this.content = this.textarea.value;

    this.textarea.addEventListener('input', (e) => {
      callback();
    });
  }

  _createDiff() {
    let transform;
    if(this.buffer.length > 0) {
      transform = OtDiff.diff(this.buffer[this.buffer.length - 1].post, this.textarea.value);
    } else {
      transform = OtDiff.diff(this.content, this.textarea.value);
    }

    this.buffer.push({
      transform: Object.assign(transform, {
        sender: this.clientId
      }),
      post: this.textarea.value
    });
  }

  _sendDiff() {
    request.patch(`${window.location.protocol}//${window.location.host}/transforms/${this.postId}`, {
      form: this.buffer[0]
    });
  }
}

export default OperationalTransformation;
