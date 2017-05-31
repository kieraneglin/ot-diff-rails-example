class PostsChannel < ApplicationCable::Channel
  on_subscribe :connect

  def connect
    transmit action: 'connected', client_id: SecureRandom.uuid
  end

  def subscribed
    stream_from "posts-#{params[:post_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
