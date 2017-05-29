class TransformsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def update
    ActionCable.server.broadcast('posts', transform: params[:transform])

    render json: Post.last
  end
end
