source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', "=231"
gem 'html-proofer'
gem "sprockets", "~> 3.7"

group :jekyll_plugins do
  gem 'jekyll-postcss'
  gem "jekyll-archives"
  gem 'jekyll-sitemap'
  gem 'jekyll-assets'
  
  # gem 'jekyll-pdf', :git => "https://github.com/abemedia/jekyll-pdf.git"
end
