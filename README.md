# Beep 🚦  
*The Traffic-Light for Real Chemistry*

---

> **One-liner:**  
> **Beep** is the *traffic-light* for real-world chemistry—scan, see green 💚, and start talking.

---

## ✨ Why Beep Exists

Modern dating apps made it easy to swipe, but awkward to connect in person.  
**Beep** flips that script: at singles or speed-dating events, two guests scan each other’s QR codes (or “Beep” via Bluetooth) and **instantly see a simple compatibility color**:

| Color    | Meaning        | Action                  |
|----------|----------------|------------------------|
| 💚 Green | High match     | Lean in, start chatting! |
| 💛 Yellow| Medium         | Worth a short convo    |
| ❤️ Red   | Low            | Politely move on       |

No endless bios, no small-talk roulette—just an ice-breaker you can feel.

---

## 🌍 Vision & Mission

|            |                                                                                           |
|------------|-------------------------------------------------------------------------------------------|
| **Vision** | A world where you *never* walk past your perfect match without knowing.                   |
| **Mission**| Give singles and event hosts a privacy-first tool that reveals genuine compatibility in real time, then fades into the background. |

---

## 🥑 Product Phases

| Phase                  | What Users Get                                                        | Status      |
|------------------------|-----------------------------------------------------------------------|-------------|
| **MVP**                | 20-Q quiz → QR scan → color result at curated dating events.          | Building    |
| **v1.0 – Organizer**   | Event dashboard, analytics, white-label options.                      | Planned     |
| **v2.0 – “Walk-Past”** | Phone vibrates when *mutual* matches pass within 5m (BLE/NFC).        | R&D         |
| **v3.0 – Social Graph**| Smart recommendations, post-event chat, paid boosts.                  | Future      |

---

## 🔑 Core Features (MVP)

1. **Two-Layer Quiz**
    - *Who I Am* (personality & lifestyle)
    - *What I’m Looking For* (deal-breakers & preferences)
2. **Instant QR Match**
    - Front camera scans peer’s code → local match algo → color + %.
3. **Privacy by Design**
    - QR stores **only** a short-lived token; raw answers stay on the server.
4. **Organizer Mode**
    - Generate event codes, limit app access to ticket-holders, view live stats.

---

## 🖼️ How Beep Works

1. **Join Event**: Guests enter a 4-digit code or scan an event QR.
2. **Complete Two-Layer Quiz** (~90 sec):
    - **Layer A**: “Who I Am” (Big-5 mini, lifestyle)
    - **Layer B**: “What I’m Looking For” (deal-breakers, preferences)
    - Set importance for each answer and toggle personal deal-breakers
3. **Get Personal QR**: Rotates every 90s for privacy.
4. **Scan or Beep**: Scan camera or BLE tap.
5. **See Result**: Color + % appears (fades after 10s).
6. **Optional Prompt**: (“Ask them about their ideal weekend 🏕️”)

**Scoring Logic:**
```ini
compat_score = Σ layerA_i * w_A + Σ layerB_i * w_B
color = {score ≥ 0.8 → green, ≥0.5 → yellow, else red}
```
Weights are refined by organiser feedback (“Did these two chat for ≥5min?”).

---

## 💡 Why Now?

- **Swipe Fatigue:** Dating apps generate overload and shallow connections. IRL curated events are rising in popularity.
- **Social Anxiety:** Most people hate small-talk roulette and want easier ice-breakers.
- **Privacy Backlash:** Users are tired of apps that track and sell their data. Beep is privacy-by-design.

---

## 🏦 Market & Model

| Segment                                     | TAM         | Notes                                                                  |
|---------------------------------------------|-------------|-----------------------------------------------------------------------|
| Singles events (speed-dating, mixers, etc.) | €1.4B¹      | Fragmented, tech-poor. Organisers crave novelty & retention tools.    |
| Social discovery apps (Tinder, etc.)        | €8B (2024)² | Swipe fatigue → need for offline tools.                               |
| BLE networking/contact-exchange tech        | Emerging    | Proves willingness to pay for IRL “who’s near me” utilities.          |

¹ IBISWorld "Singles & Dating Services" 2024  
² SensorTower, Match Group filings

**Strategic wedge:** Start B2B (events) → own the “end of swipe fatigue” narrative → layer consumer buzz → expand to bars, festivals, conferences.

---

## 💰 Business Model

- **SaaS License** (per guest) for event organisers (B2B)
- **Premium Consumer Tier** for “walk-past buzz” and advanced features (B2C)

**Moat:**  
Unique real-world UX (BLE proximity + two-layer match model + event ops) that incumbents can’t copy overnight.

---

## 🧠 Psychology & Sociology: Why It Works

- **Reduces Social Anxiety:** Instantly signals when it’s worth leaning in.
- **Minimises Decision Fatigue:** Outsources first-glance matching to a fun, color-coded system.
- **Promotes Authenticity:** Fosters real conversations, not endless swiping.

### **Backed by Research:**
- *Leary (1983)*, *Spielberger (1983)* – Social anxiety inhibits approach.
- *Berger & Calabrese (1975)* – Uncertainty reduction theory: clarity increases connection.
- *Vohs et al. (2008)* – Decision fatigue lowers decision quality.
- *Ambady & Rosenthal (1992)* – "Thin slices" often miss true compatibility.

---

## 🔒 Technology (High Level)

- **Front-end:** React + Vite PWA, Tailwind (fast, installable, offline-ready)
- **Mobile APIs:** html5-qrcode, Web-BLE (no app-store block)
- **Back-end:** Supabase (Postgres, Auth, Realtime) – secure, scalable, privacy-focused
- **Infra:** Vercel/Fly.io for CI/CD, global edge
- **Privacy:** Only hashed userID + answer vector stored; ISO-27001 hosting
- **Data store:** Pluggable session storage – localStorage in-browser, optional HTTP adapter via `VITE_BACKEND_URL`

**Planned:** Native wrapper via Capacitor for always-on BLE

---

## ⚡ Risks & Mitigations

| Risk                          | Mitigation                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------|
| Battery drain / BLE flaky      | Hybrid: BLE + user scan fallback. Backend throttles polling.                                   |
| Privacy backlash               | Opt-in tracking, no raw data exchanged, GDPR/CH compliance, external audits.                   |
| Incumbent copycats             | First-mover event moats, provisional patent, organiser contracts.                              |
| Event adoption friction        | Plug-and-play portal, revenue-share model, white-label CSS for brand hosts.                    |

---

## 🚀 Roadmap & Ask

- **Ask:** €400k pre-seed to finish MVP, run 3 paid pilots, and file provisional patent on "mutual BLE + tokenised quiz matching"
- **Pilots:** Target top-tier speed-dating providers for first rollouts
- **Future:** Expand from events to “always-on” B2C, targeting bars, festivals, conferences

---

## 📚 Further Reading / References

- IBISWorld “Singles & Dating Services” (2024)
- SensorTower, Match Group filings (2024)
- Pew Research (2020), “Dating & Privacy”
- Cavoukian (2009), *Privacy by Design*
- Faragher & Harle (2015), BLE proximity
- Berger & Calabrese (1975), Uncertainty reduction theory
- Ambady & Rosenthal (1992), “Thin slices” research

---

## ✅ At a Glance

- **Problem:** Small-talk roulette, swipe fatigue, privacy worries
- **Solution:** Instant, private, real-world match signals
- **Go-to-Market:** B2B → B2C, starting with paid singles events
- **Edge:** Event UX, dual-layer match, privacy-first, BLE handshake
- **Status:** MVP in build – ready for pilot partners & investors

---

*Beep is thoughtfully designed from psychological, sociological, market, and technological standpoints to enhance genuine human connection—in a fun, intuitive, and privacy-respecting way.*

## Development

This project uses pnpm with Vite and React.

```bash
pnpm install
pnpm dev
```

### Supabase Setup

Run `supabase/init.sql` in your project database to create the `sessions` table.
After running the script, enable **Row Level Security (RLS)** for `sessions` in
the Supabase dashboard and add a policy allowing users to read only rows where
`event_code` matches their JWT context.
