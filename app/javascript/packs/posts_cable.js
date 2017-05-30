import unirest from 'unirest';

this.App = {};

App.cable = ActionCable.createConsumer();

App.posts = App.cable.subscriptions.create('PostsChannel', {
  connected: () => {
    console.log('connected');
  },
  received: (data) => {
    let transform = JSON.parse(data.transform);
    let textarea = document.getElementById('post_body');

    if(transform.action === 'insert') {
      if(transform.sender === window.consumerId) {
        console.log('from me');
      } else {
        let doc = textarea.value;
        let updated = doc.slice(0, transform.start) + transform.payload + doc.slice(transform.start);
        window.contents = updated;
        textarea.value = updated;

        // action:"insert"
        // payload:"a"
        // sender:"0.05636868005365292"
        // start: 16
      }
    }
  }
});

App.sendTransform = (post, transform) => {
  let url = `http://localhost:3000/transforms/${post}`;
  let body = { transform: JSON.stringify(transform) };

  unirest.patch(url).send(body).end();
};

export default App;
