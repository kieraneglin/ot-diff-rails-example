Rails.application.routes.draw do
  resources :posts
  resources :transforms, only: :update
  mount ActionCable.server => '/cable'
end
