import request from 'request';
import OtDiff from 'ot-diff';

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
      } else {
        this._mergeDiff();
      }
    });
  }

  apply(data) {
    console.log(data);
    if(data.transform.sender !== this.clientId) {
      this.content = OtDiff.transform(this.textarea.value, data.transform);
      this._insertDiff(() => {
        this.textarea.value = this.content;
      });
    } else {
      this.buffer.shift();
      if(this.buffer.length > 0) {
        this._sendDiff();
      }
    }
  }

  _setupEventListeners(callback) {
    this.textarea = document.getElementById('post_body');
    this.content = this.textarea.value;

    this.textarea.addEventListener('input', (e) => {
      callback();
    });
  }

  _createDiff() {
    let transform = OtDiff.diff(this.content, this.textarea.value);
    this.transform = Object.assign(transform, {
      sender: this.clientId
    });

    this.buffer.push({
      transform: this.transform,
      post: this.textarea.value
    });
  }

  _insertDiff(callback) {
    let cursorStart = this.textarea.selectionStart,
      cursorEnd = this.textarea.selectionEnd;

    callback();

    this.textarea.selectionStart = cursorStart;
    this.textarea.selectionEnd = cursorEnd;
  }

  // If there's a diff in the buffer, merge any new diffs into it
  _mergeDiff() {
    this.buffer = [];
    this.buffer.push({
      transform: this.transform,
      post: this.textarea.value
    });
  }

  _sendDiff() {
    let base = `${window.location.protocol}//${window.location.host}`;
    request.patch(`${base}/transforms/${this.postId}`, { form: this.buffer[0] });
  }
}

export default OperationalTransformation;
