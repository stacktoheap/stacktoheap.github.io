module.exports = {
    content: [
      './_drafts/**/*.html',
      './_includes/**/*.html',
      './_layouts/**/*.html',
      './_posts/*.md',
      './*.md',
      './*.html',
    ],
    theme: {
      container: {
        center: true,
      },
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
  }