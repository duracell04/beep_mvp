# beep brandbook (mini)

## Logo variants
- **Ping (primary):** sonar/pulse mark (universal, simple)
- **Traffic:** three-stack “lights” (tops to bottoms)
- **Scan:** four QR corners with meet-dot
- **Monogram:** geometric “b” in a circle

All marks inherit `currentColor`. Use brand tokens in CSS to theme.

```css
:root {
  --brand:#0f172a;
  --beep-top:#ef4444; /* red */
  --beep-mid:#f59e0b; /* yellow */
  --beep-bot:#10b981; /* green  */
}

React usage
import BeepLogo from '../components/BeepLogo';

<BeepLogo withWordmark className="text-slate-900" />
<BeepLogo variant="traffic" className="state-green" />
<BeepLogo variant="scan" sizeEm={2} />

State colors (traffic variant)
.state-red   { color: var(--beep-top);  --beep-top: var(--beep-top); }
.state-yellow{ color: var(--beep-mid);  --beep-mid: var(--beep-mid); }
.state-green { color: var(--beep-bot);  --beep-bot: var(--beep-bot); }

Favicons / PWA

public/logo.svg is the app icon (scales cleanly).

public/manifest.json points to logo.svg with "type": "image/svg+xml".

vite.config.ts includes logo.svg in includeAssets.
