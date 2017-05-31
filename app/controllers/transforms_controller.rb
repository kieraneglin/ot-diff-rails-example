class TransformsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def update
    # Post.find(params[:id]).update(body: params[:post])
    ActionCable.server.broadcast(
      "posts-#{params[:id]}",
      transform: params[:transform],
      post: params[:post]
    )

    render json: {}
  end
end
