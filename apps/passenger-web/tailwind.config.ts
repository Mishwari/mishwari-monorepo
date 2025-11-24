import type { Config } from 'tailwindcss'
const { nextui } = require("@nextui-org/react");
const sharedConfig = require('@mishwari/ui-web/tailwind.config');
const { nextuiTheme } = require('@mishwari/ui-web/theme/tokens');

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    nextui({ themes: nextuiTheme })
  ],
}
export default config
