import unirest from 'unirest';

this.App = {};

App.cable = ActionCable.createConsumer();

App.posts = App.cable.subscriptions.create('PostsChannel', {
  received: (data) => {
    console.log(data);
  }
});

App.sendTransform = (post, transform) => {
  let url = `http://localhost:3000/transforms/${post}`;
  let body = { transform: JSON.stringify(transform) };

  unirest
    .patch(url)
    .send(body)
    .end();
};

export default App;
