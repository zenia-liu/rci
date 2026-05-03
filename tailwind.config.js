/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#000000',
          panel: '#1a1a2e',
          amber: '#FF8C00',
          green: '#00FF41',
          red: '#FF3131',
          text: '#E0E0E0',
          border: '#333333',
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "'Courier New'", 'monospace'],
        sans: ["'Noto Sans SC'", "'PingFang SC'", "'Microsoft YaHei'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
