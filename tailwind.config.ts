
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:{
      lightGrey: "#9E9E9E",
      black: "#000000",
      primaryGold: "#8D7A5B",
      deepPrimaryGold: "#705B38",
      primaryGold1: "#E8E4DE",
      primaryGold75: "rgba(141, 122, 91, 0.75)",
      primaryGold15: "#DDD7CE",
      primaryGold2: "#D1CABD",
      primaryGold3: "#BBAF9D",
      primaryGold4: "#A4957C",
      primaryGold05: "#F4F2EF",
      white: "#ffffff",
    },
    fontSize:{
      h1: ["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
      h2: ["34px", { lineHeight: "39px" }],
      h3: ["22px", { lineHeight: "46px" }],
      "8xl": ["2.85rem", { lineHeight: "48px" }],
      "7xl": ["2.71rem", { lineHeight: "44px" }],
      "6xl": ["2.42rem", { lineHeight: "40px" }],
      "5xl": ["2.14rem", { lineHeight: "36px" }],
      "4xl": ["1.85rem", { lineHeight: "32px" }],
      "3xl": ["1.57rem", { lineHeight: "28px" }],
      "2xl": ["1.28rem", { lineHeight: "24px" }],
      xl: ["1.14rem", { lineHeight: "20px" }],
      lg: ["1rem", { lineHeight: "20px" }],
      md: ["0.9rem", { lineHeight: "16px" }],
      base: ["0.85rem", { lineHeight: "14px" }],
      sm: ["0.72rem", { lineHeight: "12px" }],
      webProductName: ["1.8rem", { lineHeight: "32px" }],
    },
    backgroundImage:{
      MainBG: "url('../../../images/bg.png')",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          
      },
    },
  },
  plugins: [],
};
