module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :client_id

    def connect
      self.client_id = SecureRandom.uuid
      logger.add_tags 'ActionCable', client_id
    end
  end
end
