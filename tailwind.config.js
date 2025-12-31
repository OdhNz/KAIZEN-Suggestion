/** @type {import('tailwindcss').Config} */
// const flowbite = require("flowbite-react/tailwind");

export default {
  darkMode: 'false',
  content: [ 
  "./resources/**/*.blade.php",
  "./resources/**/*.jsx",
  "./resources/**/*.js",
  // flowbite.content(),
],
  theme: {
    extend: {},
    // colors: {
    //   bg: {
    //     light: '#f5f5f5',
    //     DEFAULT: '#f5f5f5',
    //     dark: '#f5f5f5',
    //   },
    // }
  },
  daisyui: {
  },
  plugins: [  
    // flowbite.plugin(),
  ],
}

