const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
      './_drafts/**/*.html',
      './_includes/**/*.html',
      './_layouts/**/*.html',
      './_posts/*.md',
      './*.md',
      './*.html',
    ],
    darkMode: 'media',
    daisyui: {
      themes: ["light", "dark"],
    },
    theme: {
      container: {
        center: true,
      },
      extend: {
        typography: {
          DEFAULT: {
            css: {
              pre: false,
              code: false,
              "pre code": false,
              "code::before": false,
              "code::after": false,
              "blockquote p:first-of-type::before": false,
              "blockquote p:last-of-type::after": false,
            },
          },
        },
        fontFamily: {
          sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        },
      },
    },
    plugins: [
        require('@tailwindcss/typography'), require("daisyui")
    ]
  }