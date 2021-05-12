module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        "(screen-16)": "calc(100vh - 8rem)",
        "(screen-24)": "calc(100vh - 14rem)",
      },
      minWidth: {
        "(message-4)": "4rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
