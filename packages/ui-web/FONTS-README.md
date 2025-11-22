# Shared Fonts Setup

## Overview
Fonts are centrally managed in the `@mishwari/ui-web` package and automatically copied to each app during development and build.

## Structure

```
packages/ui-web/
├── public/fonts/              # Source of truth for all fonts
│   ├── Cairo-VariableFont_slnt,wght.ttf
│   └── NotoColorEmoji-Regular.ttf
└── src/styles/
    ├── fonts.css              # Font declarations and classes
    └── globals.css            # Imports fonts.css + all styles

apps/passenger-web/ & apps/driver-web/
└── public/fonts/              # Auto-copied (gitignored)
```

## How It Works

1. **Source**: Fonts live in `packages/ui-web/public/fonts/`
2. **Auto-Copy**: Before dev/build, fonts are copied to each app's `public/fonts/`
3. **Styles**: Apps import `@mishwari/ui-web/styles/globals.css` which includes font declarations
4. **Git**: App font folders are gitignored since they're auto-generated

## Adding New Fonts

1. Add font file to `packages/ui-web/public/fonts/`
2. Add `@font-face` declaration in `packages/ui-web/src/styles/fonts.css`
3. Add CSS class if needed (e.g., `.font-name`)
4. Run `npm run dev` in any app - fonts will be auto-copied

## Scripts

Each app has a `copy-fonts` script that runs before dev/build:
```json
"copy-fonts": "node -e \"const fs=require('fs');const path=require('path');const src=path.join(__dirname,'../../packages/ui-web/public/fonts');const dest=path.join(__dirname,'public/fonts');if(!fs.existsSync(dest))fs.mkdirSync(dest,{recursive:true});fs.readdirSync(src).forEach(f=>fs.copyFileSync(path.join(src,f),path.join(dest,f)));\""
```

## Benefits

✅ Single source of truth for fonts
✅ No manual copying needed
✅ Apps stay in sync automatically
✅ Cleaner git history (no duplicate font commits)
✅ Easier to update fonts across all apps
