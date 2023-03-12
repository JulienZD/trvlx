/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        comicsans: ['Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),
  ],
};
