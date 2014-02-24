activate :livereload
activate :syntax

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
end
