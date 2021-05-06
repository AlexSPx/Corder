module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        "(screen-16)": "calc(100vh - 9rem)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
