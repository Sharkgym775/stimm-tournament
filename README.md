# STIMM Tournament Ranking

*Sticks In My Mouth — Our clan. Our code. Our victory.*

A neon cyberpunk vehicle-combat arena game for the browser (three.js, procedural low-poly 3D, PWA).
It plays in landscape on iPhone Safari and on desktop. All names, vehicles, avatars and art are original.

**Play:** https://sharkgym775.github.io/stimm-tournament/

## Features
- An account profile with a gamer tag, a clan tag and 10 procedural 3D avatars. You can change their colors, and 3 avatars unlock through achievements.
- 17 original vehicles, each with its own special weapon. Pickups: homing and fire missiles, mines, napalm, repair kits, shield cells and overshield. Pickups come in rarity tiers.
- Health and shield: your shield takes damage first and regenerates after a short delay. Gear rarity and mods add to both.
- Matches end at 15 kills or when the 10:00 timer runs out. Alert mode runs in the last 2 minutes and brings rainbow MEGA weapons.
- After each match, the top 2 players become **captains** and draft two teams for a team-vs-team match.
- Ranked tiers from Bronze to Champion, achievements with exclusive rewards, and an inventory with rarities.
- An emote wheel with 15 emotes. In Ultra quality, a live 3D avatar head in the HUD reacts to the action.
- A rotating proximity minimap, directional sound indicators and stereo-panned audio.
- Online play for up to 10 players through peer-to-peer WebRTC rooms (PeerJS). One player hosts and runs the match. Bots fill empty slots.
- Progress is saved in localStorage. You can export and import a save code.

Controls: touch joystick and buttons, or keyboard (WASD/arrows to drive, Space to shoot, E for the weapon, Q for the special, Shift for turbo, X to brake, R to switch weapons, T for emotes, Esc to pause).

## Screen fit & display settings (iPhone 15 Pro Max ready)
- Full-screen fit: `viewport-fit=cover`, every HUD element/menu offset by `env(safe-area-inset-*)` (Dynamic Island + home indicator), height from `visualViewport` (Safari toolbar show/hide), renderer resized to the real visible size on resize/orientation change.
- Portrait shows a **Rotate your phone** overlay (solo match auto-pauses).
- **Settings → Display**: HUD scale, button size, button opacity, edge margin, joystick Floating/Fixed, field of view, camera distance, resolution scale (50–100 %), dynamic resolution, FPS counter, **Edit HUD layout** (drag any HUD element; Reset). All saved permanently. Edit layout is also in the pause menu.
- Menus scroll inside the panel in landscape.

## Graphics
- **High** (default): DPR up to 2.25, 1024 shadows, ACES.
- **Ultra**: native DPR 3, PBR reflective cars with RoomEnvironment/PMREM env map, wet glossy neon floor, neon wall strips + coloured point lights, 4096 soft shadows, bloom (half-float) + ACES, contact AO, sparks/smoke/flash-light explosions, live 3D HUD head. Dynamic resolution drops the render scale (down to 55 %) when FPS < 45 and restores it when stable.

## Maps
- **Neon Rooftop XL** (300×300, ~4× the old area): central plaza, container yard (N), skate park (S), highway with long sightlines (W), raised tower deck (E).
- **Cyber Docks** (280×280): elevated cross bridge, container quays, cranes, warehouses, ramps onto containers.
- Choose the map in vehicle select (solo) or in the online lobby (host; synced to all guests). Pickups and props scale with the map; the minimap radar range is 80 m.

## Driving & controls
- Top speeds −36 %, acceleration −40 %, smoother steering (input smoothing), better grip, hand-brake drift (brake + steer) with tyre smoke; turbo is +60 %.
- Touch: dead zone, response curve, steering sensitivity, optional auto-accelerate (Settings → Controls).
- **Gamepad** (PS5 DualSense / Xbox / MFi via Bluetooth, Gamepad API): left stick steer, R2 accelerate, L2 brake/reverse (+steer = drift), R1 fire, □ weapon, L1/△ special, ✕/○ turbo, D-pad switch weapon, Options pause, Touchpad/Create emote wheel. Menus: D-pad/stick move the focus, ✕ confirm, ○ back. Touch controls hide while the pad is used; toast on connect; remappable in Settings → Controls.

## New content
- Vehicles: **Hot Diggity** (cyber dog car, flapping ears, wagging tail; special *Mega Bark* cone shockwave; unlock level 7) and **Frosty Freeze** (ice-cream truck with a giant neon-scarf snowman; special *Brain Freeze*: 3 homing ice-cream cones that freeze/slow enemies 50 % for 3 s, plays the jingle; unlock: Flawless achievement).
- Avatars: **Cyber Pup** (headset + visor dog, unlock: 100 kills) and **Neon Snowman** (top hat, neon scarf; unlock: Legendary item), both with the full 15-emote face rig.
