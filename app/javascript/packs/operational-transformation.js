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
      this._sendDiff();
    });
  }

  apply(data){
    if(data.transform.sender !== this.clientId) {
      let transformed = OtDiff.transform(this.textarea.value, data.transform);
      this.content = transformed;
      this.textarea.value = transformed;
    }
  }

  _setupEventListeners(callback) {
    this.textarea = document.getElementById('post_body');
    this.content = this.textarea.value;

    this.textarea.addEventListener('input', () => {
      callback();
    });
  }

  _createDiff() {
    let transform = OtDiff.diff(this.content, this.textarea.value);
    this.transform = Object.assign(transform, {
      sender: this.clientId
    });
    this.content = this.textarea.value;
  }

  _sendDiff() {
    request.patch(`http://localhost:3000/transforms/${this.postId}`, {
      form: {
        transform: this.transform,
        post: this.content
      }
    });
  }
}

export default OperationalTransformation;
