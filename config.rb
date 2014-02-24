activate :livereload
activate :syntax
activate :relative_assets
activate :directory_indexes

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

ignore "/test.html" if build?

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
end
