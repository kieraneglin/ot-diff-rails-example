class TransformsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def update
    transform = JSON.parse(params[:transform])
    Post.find(params[:id]).update(body: transform['post'])

    ActionCable.server.broadcast('posts', transform: transform)

    render json: transform
  end
end
