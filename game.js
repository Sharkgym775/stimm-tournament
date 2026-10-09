/* STIMM Tournament Ranking — vehicle combat (three.js) */
import * as THREE from 'three';
import { AVATARS, AVK, AV_OUTFIT, AV_NEON, buildAvatar, disposeAvatar, EMOTES, EMOJI } from './avatars.js';
const TITRE = 'STIMM Tournament Ranking';
const SAVE_KEY = 'sharkgym_smash_v1';
const SAVE_PREFIX = 'SGS1-';
const NET_PREFIX = 'sgsmash-salle-';
const MAX_JOUEURS = 10;
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = a => a[Math.random() * a.length | 0];
document.title = TITRE;
/* ================== Textes (toutes les chaînes de l'interface) ==================
   Pour ajouter le français plus tard : copier STR.en vers STR.fr et traduire, puis régler la sauvegarde « lang: 'fr' ». */
const STR = {
  en: {
    _lang: 'en',
    tagline: 'Our clan. Our code. Our victory.',
    account: '👤 Profile', createAccount: 'Create your STIMM profile', editAccount: 'Your STIMM profile', accountSub: 'Pick your gamer tag, clan tag and the 3D avatar that represents you.', gamerTag: 'Gamer tag', clanTag: 'Clan tag', avatar: 'Avatar', outfitCol: 'Outfit color', neonCol: 'Neon color', saveProfile: 'Save profile', createBtn: 'Create account', needTag: 'Enter a gamer tag first.', avLockedBy: a => `🔒 Unlock: ${a}`, avReward: 'Avatar',
    avNames: { chicken: 'Neon Rooster', shark: 'SharkGym', teddy: 'Teddy Bruiser', operator: 'Shadow Op', frost: 'Frost Visor', neko: 'Neko Static', gamer: 'Red Visor', toxic: 'Toxic Bloom', king: 'Crown Leader', ronin: 'Red Ronin' },
    emotes: 'Emotes', keysEmote: ' · T: emotes',
    draft: '👑 Captain Draft', draftBtn: '👑 Captain draft', draftSub: 'Top 2 of the last match are captains and take turns picking.', teamA: 'Team Neon', teamB: 'Team Cyber', yourPick: '👉 Your pick! Tap a player.', picking: n => `${n} is picking…`, draftDone: '✅ Teams locked! Team match starting…', captain: 'Captain', teamGoal: n => `Team goal ${n}`, teamWin: t => `🏆 ${t} wins!`, teamLose: t => `${t} wins — your team lost`, teamMatch: 'Team match', lastKills: 'kills', pool: 'Available players',
    play: 'Solo', online: 'Online', inventory: 'Inventory', stats: 'Stats', settings: 'Settings', back: 'Back',
    level: 'Level', lv: 'Lv', wave: 'Wave', win1: 'win', winN: 'wins',
    chooseVehicle: 'Choose your ride', paint: 'Paint', loadout: 'Loadout', letsGo: "Let's go!", confirm: 'Confirm', edit: 'Edit',
    speed: 'Speed', weight: 'Weight', armor: 'Armor', handling: 'Handling', special: 'Special',
    unlockAt: n => `Unlocks at level ${n}`,
    totalXp: 'Total XP', bestWave: 'Best wave', wins: 'Wins', podiums: 'Podiums (top 3)', matches: 'Matches played', onlineMatches: 'Online matches', kills: 'Kills', bestKills: 'Most kills in a match', dmgDealt: 'Damage dealt', items: 'Items owned',
    pilotName: 'Driver name', namePh: 'Your name', soundOn: '🔊 Sound: on', soundOff: '🔇 Sound: off', graphics: 'Graphics quality',
    q_low: 'Low', q_medium: 'Medium', q_high: 'High', q_ultra: 'Ultra', gfxNote: 'High is recommended. Ultra adds glow (bloom), sharper shadows and more particles — your phone may get warm.',
    saveCode: 'Save code', saveCodeNote: 'Export a code to keep your progress safe or move it to another device. Paste a code and tap Import to restore it.',
    savePh: 'SGS1-…', exportBtn: 'Export', importBtn: 'Import', copied: '✅ Code copied!', copyManual: 'Code shown above: select it and copy it.',
    imported: (n, k) => `✅ Save restored: level ${n}, ${k} items.`,
    resetAll: 'Erase everything', resetConfirm: 'Tap again to erase', resetDone: 'Progress erased.',
    errPrefix: 'This code must start with ', errIncomplete: 'Incomplete code.', errInvalid: 'Invalid or badly copied code.', errUnreadable: 'Unreadable code.',
    pause: 'Paused', resume: 'Resume', quit: 'Quit match', pauseNote: 'Online match: the game keeps running while paused!',
    victory: '🏆 Victory!', destroyed: 'Wrecked!', place: r => `${STR.en.ord(r)} place!`, ord: r => r + (r % 10 === 1 && r % 100 !== 11 ? 'st' : r % 10 === 2 && r % 100 !== 12 ? 'nd' : r % 10 === 3 && r % 100 !== 13 ? 'rd' : 'th'),
    onlineMatch: n => `Online match · ${n} vehicles`, waveCleared: w => `Wave ${w} cleared! The next one will be tougher.`, waveLost: (w, r, n) => `Wave ${w} · you finished ${STR.en.ord(r)} of ${n}`,
    rank: 'Rank', xpEarned: 'XP earned', loot: 'Loot:', results: 'Results',
    nextWave: 'Next wave', retry: 'Try again', backLobby: 'Back to lobby', vehiclesBtn: 'Vehicles', menu: 'Menu',
    levelUp: 'LEVEL UP!', rewards: 'Rewards', awesome: 'Awesome!', newVehicle: 'New vehicle:', newPaint: 'New paint:', pickInGarage: 'Pick it in the garage',
    hp: 'HP', tapSwitch: 'Tap to switch', pressWeapon: 'Press WEAPON to fire', grabWeapons: 'Grab weapon pickups!', machineGun: 'Gun',
    enemies: 'Enemies', cdHint: 'Last one standing wins!', go: 'GO!', wrecked: 'WRECKED!', wreckedBig: '💥 WRECKED!', spectating: 'Spectating until the match ends…',
    youKilled: n => `You wrecked ${n}`, killedYou: n => `${n} wrecked you`, selfDestruct: 'You wrecked yourself', exploded: n => `${n} blew up`, leftBot: n => `${n} left (bot takes over)`,
    fire: 'FIRE', weapon: 'WEAPON', specialBtn: 'SPECIAL', turbo: 'TURBO', brake: 'BRAKE', joyHint: 'Drag here<br>to drive',
    keysHelp: 'WASD/arrows: drive · Space: gun · E: weapon · Q: special · Shift: turbo · X: brake · R: switch weapon · T: emotes · Esc: pause',
    rotate: 'Turn your phone sideways', rotateSub: 'STIMM Tournament Ranking plays in landscape',
    slotWeapon: 'Main gun', slotMod: 'Mod', empty: 'Empty', equip: 'Equip', recycle: 'Recycle', recycleConfirm: 'Tap again to recycle', noItems: 'No items yet. Win matches to earn loot!', itemsWord: 'items',
    gunDps: 'Gun DPS', hpBonus: 'HP', speedBonus: 'Speed', invNote: 'Pick a slot, then tap an item and Equip. Loot drops after matches and level ups.',
    rarity: ['Common', 'Rare', 'Epic', 'Legendary'], gunType: 'Gun', modType: 'Mod',
    weaponDesc: (d, n, r, dps) => `Damage ${d}${n > 1 ? ' × ' + n : ''} · Fire rate ${r}/s · ${dps} DPS`,
    onlineTitle: 'Online battle', onlineIntro: 'Create a room and share the code, or join a friend\'s room. Up to 10 players, bots fill empty spots.',
    createRoom: 'Create a room', join: 'Join', codePh: 'CODE', roomCode: 'Room code', totalVehicles: 'Vehicles in the match', start: 'Start match', changeVehicle: 'Change vehicle', leave: 'Leave',
    waitingHost: 'Waiting for the host to start…', human: 'player', humans: 'players', vehicles: 'vehicles', bot: 'Bot', botFill: 'fills the spot', player: 'Player',
    connServer: 'Connecting to server…', errModule: 'Could not load the online module. Check your Internet connection.', giveCode: 'Share this code with your friends (up to 9). Empty spots are filled by bots.',
    enterCode: 'Enter the 4-character room code.', connecting: 'Connecting…', noAnswer: 'No answer. Check the code and try again.', connected: 'Connected! Waiting for the host to start the match.',
    roomNotFound: 'Room not found. Check the code.', roomFull: 'The room is full (10 players max).', roomBusy: 'A match is already running in this room. Try again in a moment.',
    hostLeft: 'The host left the match.', hostClosed: 'The host closed the room.', serverDown: 'Connection server unreachable. Try again in a moment.', connError: 'Connection error. Try again.',
    onlineNote: 'Works best on Wi-Fi. Some mobile networks block direct connections.',
    botNames: ['Rusty', 'Viper', 'Show-Off', 'Twister', 'Scrapper', 'Bulldozer', 'Ghost', 'Brutus', 'Piranha', 'Barracuda', 'Big Bill', 'Sparky', 'Chrome', 'Hurricane'],
    veh: {
      megabite: ['Megabite', 'SharkGym flagship: a shark on wheels, balanced and mean.', 'Feeding Frenzy', 'Fan of 8 missiles (12 dmg each).'],
      cluck: ['Cluckinator', 'A giant chicken on wheels. Do not laugh.', 'Egg Barrage', 'Lays 3 explosive eggs behind you (30 dmg each).'],
      hornet: ['Hornet Type-X', 'Hot hatch with a huge wing. Quick and sharp.', 'Stingers', '3 fast straight missiles (16 dmg each).'],
      mini: ['Mighty Mini', 'Tiny classic city car. Turns on a dime.', 'Pocket Rockets', '2 homing rockets (26 dmg each).'],
      bike: ['Pedal Pusher', 'A bicycle. Super agile, super fragile.', 'Bell Blast', 'Sonic ring that knocks back nearby enemies (25 dmg).'],
      scooter: ['Kick Rocket', 'Kick scooter. Tiny target, big attitude.', 'Ghost Glide', 'Turn invisible to enemies for 4 seconds.'],
      moto: ['Road Ripper', 'Motorcycle. The fastest thing on two wheels.', 'Wheelie Ram', 'Wheelie charge that smashes the first enemy hit (35 dmg).'],
      titan: ['Titan 650', 'Heavy-duty medium truck. A rolling fortress.', 'Bed Mortar', 'Lobs a huge fire shell (65 dmg + burn).'],
      bus: ['City Bus', 'Next stop: your face. Slow and very tanky.', 'Passenger Shield', 'Blocks 85% of damage for 5 seconds.'],
      bigrig: ['Big Rig', '18-wheeler semi with trailer. The heaviest hitter.', 'Jackknife Slam', 'Swings the trailer: huge shockwave (45 dmg).'],
      stutt: ['Stuttgart Nine', 'Rear-engine classic sports car. Precise handling.', 'Boxer Boost', 'Full turbo, +30% speed and -40% damage taken for 4 s.'],
      rosso: ['Rosso Furia', 'Italian exotic. Pure speed, thin armor.', 'Flamethrower', 'Torches everything in front (50 dmg/s + burn).'],
      toro: ['Toro Venom', 'Wedge supercar with a raging-bull attitude.', 'Horn Charge', 'Rocket charge that smashes the first enemy hit (55 dmg).'],
      sky34: ['Skyrunner 34', 'Legendary JDM coupe. Grip for days.', 'Thunder Drift', 'Lightning hits the closest enemy (35) and chains to another (20).'],
      godzira: ['Godzira R', 'Japanese super-coupe. A monster in every way.', 'Atomic Beam', 'Instant beam straight ahead (50 dmg).'],
      flyer: ['Hover Hawk', 'Flying car: hovers over obstacles and gaps.', 'Sky Bombs', 'Drops 3 bombs along your path (35 dmg each).'],
      blades: ['Inline Fury', 'A rider on inline skates. Fastest turns in the game.', 'Skate Tornado', 'Spin attack that hits everyone close (30 dmg).'],
    },
    guns: { mitrailleuse: 'Machine Gun', canon: 'Heavy Cannon', laser: 'Pulse Laser', pompe: 'Shotgun' },
    mods: {
      ogives: ['Reinforced Warheads', v => `+${v}% pickup weapon damage`], chargeur: ['Extended Mag', v => `+${v} ammo per pickup`], blindage: ['Armor Plating', v => `+${v}% max HP`], emetteur: ['Shield Emitter', v => `+${v} max shield`],
      moteur: ['Tuned Engine', v => `+${v}% top speed`], recharge: ['Fast Recharge', v => `-${v}% special cooldown`], refroid: ['Coolant System', v => `+${v}% fire rate`],
    },
    skins: { victoire: 'Victory Red', chrome: 'Ranked Chrome', origine: 'Stock', requin: 'Shark Grey', camo: 'Urban Camo', flammes: 'Flames', neon: 'Neon', or: 'Solid Gold', megalodon: 'Black Megalodon' },
    killGoal: n => `First to ${n} kills`, myKills: 'Your kills', respawning: 'Respawning…', top3: 'Top 3', timeUp: "Time's up!", reachedGoal: n => `${n} reached the kill goal!`,
    alert: '⚠️ FINAL 2 MINUTES ⚠️', alertSub: 'Rainbow weapons incoming!', megaSpawn: '🌈 Rainbow weapons are on the map!', mega: 'MEGA ATTACK', megaName: 'Megalodon Strike', deaths: 'Deaths',
    tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Champion'],
    casual: 'Casual', ranked: 'Ranked', rp: 'RP', rankPts: 'Rank points', rankedBoard: 'Ranked leaderboard (this device)', boardNote: 'Local leaderboard vs. rival drivers. A worldwide leaderboard would need an online server.',
    tierUp: t => `Promoted to ${t}!`, tierDown: t => `Dropped to ${t}`, you: 'You', profile: 'Profile', modeLabel: 'Mode', rankedNote: 'Ranked: win rank points by finishing high, lose some by finishing low.',
    achievements: 'Achievements', achUnlocked: '🏆 Achievement unlocked!', reward: 'Reward', exclusive: 'Exclusive', equipped: 'Equipped', locked: 'Locked', unlocked: 'Unlocked',
    rwSkin: 'Paint', rwTrail: 'Turbo trail', rwHorn: 'Horn', rwTitle: 'Title', none: 'None', achNote: 'Rewards here are exclusive: you can only get them from achievements.', achLock: 'Exclusive: unlock it in Achievements',
    rivalNames: ['Nitro Nadia', 'Dented Dave', 'Kara Crash', 'Turbo Tom', 'Rex Riot', 'Mia Mayhem', 'Big Lou', 'Zed Zoom', 'Jet Jackie', 'Bolt Benny', 'Rhea Wreck', 'Max Torque', 'Sasha Skid', 'Gus Grinder'],
    ach: {
      first_win: ['First Win', 'Win a match.'], kills100: ['Centurion', 'Wreck 100 vehicles in total.'], flawless: ['Untouchable', 'Win a match without taking any damage.'],
      ranked10: ['Ranked Shark', 'Win 10 ranked matches.'], legendary: ['Jackpot', 'Find a Legendary item.'], wave10: ['Survivor', 'Reach wave 10 in solo.'],
      online5: ['Social Shark', 'Play 5 online matches.'], multi5: ['Rampage', 'Wreck 5 vehicles in a single match.'], level10: ['Veteran', 'Reach level 10.'],
      special50: ['Special Agent', 'Use your special 50 times.'], champion: ['Apex Predator', 'Reach Champion rank (2000 RP).'],
    },
    titles: { untouchable: 'Untouchable', waverider: 'Wave Rider', veteran: 'Veteran', apex: 'Apex Predator' },
    trails: { inferno: 'Inferno', electric: 'Violet Storm', rainbow: 'Rainbow' },
    horns: { airhorn: 'Air Horn', roar: 'Shark Roar' },
    picks: { mega: 'Rainbow Mega', missile: 'Homing Missiles', feu: 'Fire Missiles', mine: 'Mines', napalm: 'Napalm', sante: 'Repair Kit', turbo: 'Turbo', bouc: 'Shield Cell', over: 'Overshield' },
    health: 'Health', shield: 'Shield', baseW: 'base', gearW: 'gear', shBonus: 'Shield', regenNote: 'Shield absorbs damage first and regenerates after 3.5 s without hits.',
  },
};
const LANG = (() => { try { return JSON.parse(localStorage.getItem('sharkgym_smash_v1')).lang; } catch (e) { return null; } })();
const L = STR[LANG] || STR.en;


/* ================== Données ================== */
const VEH = {
  megabite: { coul: 0x5b7c99, acc: 0xf2f4f7, vitesse: 28, accel: 23, blindage: 125, maniement: 2.4, grip: 5.5, rayon: 1.7, masse: 1.3, niv: 1, special: { id: 'frenzy', cd: 12 } },
  cluck: { coul: 0xf5f3ea, acc: 0xd62828, vitesse: 27, accel: 22, blindage: 110, maniement: 2.4, grip: 5.5, rayon: 1.6, masse: 1.2, niv: 1, special: { id: 'eggs', cd: 9 } },
  hornet: { coul: 0xf2f2f2, acc: 0xd62828, vitesse: 30, accel: 28, blindage: 92, maniement: 2.9, grip: 5.6, rayon: 1.45, masse: .9, niv: 1, special: { id: 'sting', cd: 7 } },
  mini: { coul: 0x1f7a3a, acc: 0xf2f2f2, vitesse: 29, accel: 30, blindage: 82, maniement: 3.0, grip: 6, rayon: 1.3, masse: .8, niv: 1, special: { id: 'rockets', cd: 8 } },
  bike: { coul: 0x2fa8ff, acc: 0xffc21f, vitesse: 30, accel: 31, blindage: 48, maniement: 3.6, grip: 6.5, rayon: .9, masse: .4, niv: 1, rider: 1, special: { id: 'bell', cd: 7 } },
  scooter: { coul: 0x7ef29d, acc: 0x222222, vitesse: 31, accel: 33, blindage: 46, maniement: 3.6, grip: 6.5, rayon: .85, masse: .4, niv: 1, rider: 1, special: { id: 'cloak', cd: 13 } },
  moto: { coul: 0x111111, acc: 0xff6a1f, vitesse: 36, accel: 34, blindage: 62, maniement: 3.2, grip: 6, rayon: 1.0, masse: .6, niv: 2, rider: 1, special: { id: 'charge', cd: 9, dmg: 35 } },
  titan: { coul: 0x23395d, acc: 0xc9ced6, vitesse: 23, accel: 16, blindage: 190, maniement: 1.7, grip: 6, rayon: 2.0, masse: 2.0, niv: 3, special: { id: 'mortar', cd: 10 } },
  bus: { coul: 0xffc21f, acc: 0x1b6ca8, vitesse: 22, accel: 14, blindage: 210, maniement: 1.5, grip: 6, rayon: 2.1, masse: 2.3, niv: 4, special: { id: 'shield', cd: 14 } },
  bigrig: { coul: 0xb3261e, acc: 0xd9dde3, vitesse: 21, accel: 13, blindage: 235, maniement: 1.4, grip: 6, rayon: 2.2, masse: 2.6, niv: 5, special: { id: 'jack', cd: 11 } },
  stutt: { coul: 0xc7ccd3, acc: 0x222222, vitesse: 32, accel: 28, blindage: 95, maniement: 2.8, grip: 5.5, rayon: 1.55, masse: 1.0, niv: 6, special: { id: 'nitro', cd: 12 } },
  rosso: { coul: 0xd10f1f, acc: 0x111111, vitesse: 34, accel: 30, blindage: 88, maniement: 2.6, grip: 5.2, rayon: 1.6, masse: 1.0, niv: 8, special: { id: 'flame', cd: 8 } },
  toro: { coul: 0x8fd400, acc: 0x111111, vitesse: 35, accel: 31, blindage: 90, maniement: 2.5, grip: 5.2, rayon: 1.65, masse: 1.1, niv: 10, special: { id: 'charge', cd: 9, dmg: 55 } },
  sky34: { coul: 0x1f4fbf, acc: 0x111111, vitesse: 31, accel: 27, blindage: 100, maniement: 2.7, grip: 5.4, rayon: 1.6, masse: 1.05, niv: 12, special: { id: 'zap', cd: 9 } },
  godzira: { coul: 0x4a4f57, acc: 0xe3261a, vitesse: 33, accel: 29, blindage: 105, maniement: 2.6, grip: 5.8, rayon: 1.65, masse: 1.15, niv: 999, tier: 2, special: { id: 'beam', cd: 10 } },
  flyer: { coul: 0x9fe8ff, acc: 0x7b2cff, vitesse: 28, accel: 22, blindage: 95, maniement: 2.4, grip: 3.5, rayon: 1.6, masse: 1.0, niv: 999, ach: 'wave10', vol: 1, special: { id: 'bombs', cd: 10 } },
  blades: { coul: 0xff70a6, acc: 0x22e5ff, vitesse: 33, accel: 32, blindage: 42, maniement: 3.8, grip: 6.5, rayon: .8, masse: .35, niv: 999, ach: 'multi5', rider: 1, special: { id: 'spin', cd: 7 } },
};
const VKEYS = Object.keys(VEH);
const RAR = [
  { coul: '#b8c4d0', m: 1, cad: 0 },
  { coul: '#3fa9ff', m: 1.15, cad: .05 },
  { coul: '#b06cff', m: 1.32, cad: .1 },
  { coul: '#ffb21f', m: 1.55, cad: .15 },
];
const ARMES = {
  mitrailleuse: { ic: '🔫', dmg: 2.2, cad: 11, vit: 110, balles: 1, disp: .02, vie: .6 },
  canon: { ic: '💥', dmg: 7, cad: 3.6, vit: 95, balles: 1, disp: .01, vie: .8, gros: 1 },
  laser: { ic: '✨', dmg: 1.5, cad: 18, vit: 150, balles: 1, disp: .005, vie: .45, laser: 1 },
  pompe: { ic: '🧨', dmg: 2.3, cad: 2.6, vit: 90, balles: 6, disp: .12, vie: .35 },
};
const MODS = {
  ogives: { ic: '🚀', val: [10, 18, 28, 40], k: 'dmgPk' },
  chargeur: { ic: '📦', val: [1, 1, 2, 3], k: 'ammo' },
  blindage: { ic: '🛡️', val: [10, 18, 26, 36], k: 'hp' },
  moteur: { ic: '⚙️', val: [5, 8, 11, 15], k: 'vit' },
  recharge: { ic: '🔋', val: [10, 18, 26, 35], k: 'cd' },
  refroid: { ic: '❄️', val: [8, 14, 20, 28], k: 'cad' },
  emetteur: { ic: '🔰', val: [15, 25, 38, 55], k: 'sh' },
};
const W_SH = [0, 5, 10, 18]; // weapon rarity -> bonus shield
const VSH = v => Math.round(20 + v.blindage * .2); // base shield of a vehicle
const RADAR_RANGE = 60;
const PK_RAR = [0, 0, 1, 0, 2, 1, 0, 3]; // pickup rarity per spot
const PK_AMT = { sante: [.4, .55, .7, 1], bouc: [.35, .5, .7, 1], over: [1.3, 1.45, 1.6, 1.8] };
const SKINS = [
  { id: 'origine', niv: 1 },
  { id: 'requin', niv: 2, c: 0x7d8b99, a: 0xeef3f7 },
  { id: 'camo', niv: 4, c: 0x5d6b4a, a: 0x2e3527 },
  { id: 'flammes', niv: 5, c: 0x1b1b1f, a: 0xff5a1f },
  { id: 'neon', niv: 7, c: 0x111827, a: 0x22e5ff, em: 1 },
  { id: 'or', niv: 9, c: 0xd4a017, a: 0x7a5200 },
  { id: 'megalodon', niv: 12, c: 0x0b0b0f, a: 0xd61f1f, em: 1 },
  { id: 'victoire', niv: 999, ach: 'first_win', c: 0xb3001b, a: 0xffd700 },
  { id: 'chrome', niv: 999, ach: 'ranked10', c: 0xdfe6ee, a: 0x3fa9ff, em: 1 },
];
const TIERS = [{ min: 0, coul: '#cd7f32', ic: '🥉' }, { min: 200, coul: '#c0c8d0', ic: '🥈' }, { min: 500, coul: '#ffc21f', ic: '🥇' }, { min: 900, coul: '#5fe0d0', ic: '💠' }, { min: 1400, coul: '#7ab8ff', ic: '💎' }, { min: 2000, coul: '#ff4d6d', ic: '👑' }];
const tierOf = rp => { let t = 0; TIERS.forEach((x, i) => { if (rp >= x.min) t = i; }); return t; };
const TRAILS = { '': [0x22e5ff, 0x9fe8ff, 0xffffff], inferno: [0xff5a1f, 0xffc21f, 0xe3261a], electric: [0x7b2cff, 0xd0a0ff, 0xffffff], rainbow: [0xff3b3b, 0xffc21f, 0x7ef29d, 0x2fa8ff, 0xb06cff] };
const ACH = [
  { id: 'first_win', ic: '🏆', goal: 1, val: () => S.victoires, rw: { t: 'skin', id: 'victoire' }, av: 'king' },
  { id: 'kills100', ic: '💥', goal: 100, val: () => S.kills, rw: { t: 'trail', id: 'inferno' } },
  { id: 'flawless', ic: '🛡️', goal: 1, val: () => S.flawless, rw: { t: 'title', id: 'untouchable' } },
  { id: 'ranked10', ic: '🥇', goal: 10, val: () => S.rankedWins, rw: { t: 'skin', id: 'chrome' } },
  { id: 'legendary', ic: '🌟', goal: 1, val: () => S.legend, rw: { t: 'horn', id: 'airhorn' } },
  { id: 'wave10', ic: '🌊', goal: 10, val: () => S.meilleureVague, rw: { t: 'title', id: 'waverider' }, veh: 'flyer' },
  { id: 'online5', ic: '🌐', goal: 5, val: () => S.enLigne, rw: { t: 'trail', id: 'electric' } },
  { id: 'multi5', ic: '🔥', goal: 5, val: () => S.meilleursKills, rw: { t: 'horn', id: 'roar' }, veh: 'blades', av: 'ronin' },
  { id: 'level10', ic: '⭐', goal: 10, val: () => xpInfo().n, rw: { t: 'title', id: 'veteran' }, av: 'toxic' },
  { id: 'special50', ic: '🦈', goal: 50, val: () => S.specials, rw: { t: 'trail', id: 'rainbow' } },
  { id: 'champion', ic: '👑', goal: 2000, val: () => S.rpMax, rw: { t: 'title', id: 'apex' } },
];
const PICK = {
  missile: { ic: '🎯', coul: 0x3fa9ff, n: 2 },
  feu: { ic: '🔥', coul: 0xff5a1f, n: 2 },
  mine: { ic: '💣', coul: 0xb06cff, n: 3 },
  napalm: { ic: '☄️', coul: 0xffc21f, n: 1 },
  sante: { ic: '🔧', coul: 0x35e06a },
  bouc: { ic: '🔰', coul: 0x3fd0ff },
  over: { ic: '💠', coul: 0x9b5cff },
  turbo: { ic: '⚡', coul: 0x22e5ff },
  mega: { ic: '🌈', coul: 0xffffff, n: 1 },
};
const WPK = ['missile', 'feu', 'mine', 'napalm', 'mega'];
const KILL_GOAL = 15, MATCH_TIME = 600, ALERT_AT = 480;
const BOT_NOMS = L.botNames;
const BOT_COUL = [[0xd62828, 0x222222], [0x2a9d4a, 0xe9c46a], [0x7b2cbf, 0xf0f0f0], [0xffd60a, 0x111111], [0x00b4d8, 0x03045e], [0xe76f51, 0x264653], [0x8d99ae, 0xef233c], [0xff70a6, 0x2b2d42], [0x6a994e, 0x386641]];

// noms et descriptions tirés du dictionnaire
for (const k in VEH) { const t = L.veh[k]; VEH[k].nom = t[0]; VEH[k].desc = t[1]; VEH[k].special.nom = t[2]; VEH[k].special.desc = t[3]; }
RAR.forEach((r, i) => r.nom = L.rarity[i]); TIERS.forEach((t, i) => t.nom = L.tiers[i]);
for (const k in ARMES) ARMES[k].nom = L.guns[k];
for (const k in MODS) { MODS[k].nom = L.mods[k][0]; MODS[k].d = L.mods[k][1]; }
SKINS.forEach(s => s.nom = L.skins[s.id]);
for (const k in PICK) PICK[k].nom = L.picks[k];

/* ================== Sauvegarde ================== */
const DEF = () => ({ v: 1, pseudo: '', xp: 0, niveau: 1, vague: 1, meilleureVague: 1, victoires: 0, parties: 0, kills: 0, meilleursKills: 0, degats: 0, podiums: 0,
  son: true, gfx: 'high', lang: 'en', vehicule: 'megabite', skin: 'origine', items: [{ u: 1, t: 'arme', b: 'mitrailleuse', r: 0 }], uid: 2, equip: { arme: 1, mods: [0, 0] }, enLigne: 0, rp: 0, rpMax: 0, rankedWins: 0, rankedMatches: 0, flawless: 0, legend: 0, specials: 0, ach: {}, style: { trail: '', horn: '', title: '' }, rivals: null, ranked: false, clan: 'STIMM', av: { id: 'shark', a: '', n: '' }, acct: 0 });
const HEX = v => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : '';
const sanAv = o => { o = o && typeof o === 'object' ? o : {}; return { id: AVK.includes(o.id) ? o.id : 'operator', a: HEX(o.a), n: HEX(o.n) }; };
const sanClan = v => String(v == null ? 'STIMM' : v).replace(/[^A-Za-z0-9_]/g, '').toUpperCase().slice(0, 5);
let S = load();
function sanitize(o) {
  const d = DEF(); if (!o || typeof o !== 'object') throw new Error('format');
  const num = (v, max) => { v = Math.floor(+v); if (!isFinite(v) || v < 0) return 0; return Math.min(v, max); };
  d.pseudo = String(o.pseudo || '').replace(/[<>]/g, '').slice(0, 12);
  for (const k of ['xp', 'victoires', 'parties', 'kills', 'meilleursKills', 'degats', 'podiums', 'enLigne', 'rp', 'rpMax', 'rankedWins', 'rankedMatches', 'flawless', 'legend', 'specials']) d[k] = num(o[k], 1e10);
  d.niveau = Math.max(1, num(o.niveau, 999)); d.vague = Math.max(1, num(o.vague, 999)); d.meilleureVague = Math.max(d.vague, num(o.meilleureVague, 999));
  d.ranked = !!o.ranked; d.clan = sanClan(o.clan); d.av = sanAv(o.av || { id: 'shark' }); d.acct = o.acct ? 1 : 0;
  if (o.ach && typeof o.ach === 'object') for (const a of ACH) if (o.ach[a.id]) d.ach[a.id] = 1;
  if (o.style && typeof o.style === 'object') { d.style.trail = TRAILS[o.style.trail] ? String(o.style.trail) : ''; d.style.horn = L.horns[o.style.horn] ? String(o.style.horn) : ''; d.style.title = L.titles[o.style.title] ? String(o.style.title) : ''; }
  if (Array.isArray(o.rivals)) d.rivals = o.rivals.slice(0, 20).filter(r => r && typeof r === 'object').map(r => ({ n: String(r.n || '?').replace(/[<>]/g, '').slice(0, 20), rp: num(r.rp, 99999) }));
  d.son = o.son !== false; d.gfx = ['low', 'medium', 'high', 'ultra'].includes(o.gfx) ? o.gfx : 'high'; d.lang = STR[o.lang] ? o.lang : 'en';
  d.vehicule = VEH[o.vehicule] ? o.vehicule : 'megabite';
  d.skin = SKINS.some(s => s.id === o.skin) ? o.skin : 'origine';
  if (Array.isArray(o.items)) {
    const seen = new Set(); d.items = [];
    for (const it of o.items.slice(0, 80)) {
      if (!it || typeof it !== 'object') continue; const u = num(it.u, 1e9); if (!u || seen.has(u)) continue;
      const t = it.t === 'mod' ? 'mod' : 'arme'; const b = String(it.b); if (t === 'arme' ? !ARMES[b] : !MODS[b]) continue;
      seen.add(u); d.items.push({ u, t, b, r: Math.min(3, num(it.r, 3)) });
    }
    if (!d.items.length) d.items = DEF().items;
  }
  d.uid = Math.max(num(o.uid, 1e9), ...d.items.map(i => i.u + 1));
  const has = (u, t) => d.items.some(i => i.u === u && i.t === t);
  if (o.equip && typeof o.equip === 'object') {
    const a = num(o.equip.arme, 1e9); d.equip.arme = has(a, 'arme') ? a : (d.items.find(i => i.t === 'arme') || {}).u || 0;
    const m = Array.isArray(o.equip.mods) ? o.equip.mods : []; d.equip.mods = [0, 1].map(i => { const u = num(m[i], 1e9); return has(u, 'mod') ? u : 0; });
    if (d.equip.mods[0] && d.equip.mods[0] === d.equip.mods[1]) d.equip.mods[1] = 0;
  } else d.equip.arme = (d.items.find(i => i.t === 'arme') || {}).u || 0;
  return d;
}
function load() { try { const o = JSON.parse(localStorage.getItem(SAVE_KEY)); return o ? sanitize(o) : DEF(); } catch (e) { return DEF(); } }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }
function hash32(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); }
function exportCode() { const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); return SAVE_PREFIX + b64 + '-' + hash32(b64); }
function parseCode(code) {
  code = String(code || '').replace(/\s+/g, '');
  if (!code.startsWith(SAVE_PREFIX)) throw new Error(L.errPrefix + SAVE_PREFIX);
  const body = code.slice(SAVE_PREFIX.length), k = body.lastIndexOf('-'); if (k < 1) throw new Error(L.errIncomplete);
  const b64 = body.slice(0, k), h = body.slice(k + 1); if (hash32(b64) !== h) throw new Error(L.errInvalid);
  let o; try { o = JSON.parse(decodeURIComponent(escape(atob(b64)))); } catch (e) { throw new Error(L.errUnreadable); }
  return sanitize(o);
}
const pseudo = () => S.pseudo || L.player;
function checkAch() { const out = []; for (const a of ACH) { if (!S.ach[a.id] && a.val() >= a.goal) { S.ach[a.id] = 1; out.push(a); } } if (out.length) save(); return out; }
function rwName(rw) { return rw.t === 'skin' ? L.skins[rw.id] : rw.t === 'trail' ? L.trails[rw.id] : rw.t === 'horn' ? L.horns[rw.id] : L.titles[rw.id]; }
function rwType(rw) { return { skin: L.rwSkin, trail: L.rwTrail, horn: L.rwHorn, title: L.rwTitle }[rw.t]; }
function ensureRivals() { if (S.rivals && S.rivals.length) return; S.rivals = L.rivalNames.map((n, i) => ({ n, rp: Math.round(60 + i * 160 + Math.random() * 90) })); }
function tierHTML(rp) { const t = TIERS[tierOf(rp)]; return `<span class="tier" style="color:${t.coul}">${t.ic} ${t.nom}</span>`; }

/* XP / niveaux */
const xpNeed = n => 200 + (n - 1) * 120;
function xpInfo() { let n = 1, x = S.xp; while (x >= xpNeed(n) && n < 999) { x -= xpNeed(n); n++; } return { n, x, need: xpNeed(n) }; }

/* Objets */
const itemById = u => S.items.find(i => i.u === u);
function itemNom(it) { return it.t === 'arme' ? ARMES[it.b].nom : MODS[it.b].nom; }
function itemIc(it) { return it.t === 'arme' ? ARMES[it.b].ic : MODS[it.b].ic; }
function itemDesc(it) {
  const R = RAR[it.r];
  if (it.t === 'arme') { const a = ARMES[it.b]; const dps = a.dmg * R.m * a.balles * a.cad * (1 + R.cad); return L.weaponDesc((a.dmg * R.m).toFixed(1), a.balles, (a.cad * (1 + R.cad)).toFixed(1), Math.round(dps)); }
  return MODS[it.b].d(MODS[it.b].val[it.r]);
}
function rollItem(bonus = 0) {
  const x = Math.random(); const pl = .03 + bonus * .03, pe = pl + .1 + bonus * .05, pr = pe + .3 + bonus * .05;
  const r = x < pl ? 3 : x < pe ? 2 : x < pr ? 1 : 0;
  const t = Math.random() < .35 ? 'arme' : 'mod';
  const b = pick(Object.keys(t === 'arme' ? ARMES : MODS));
  return { u: S.uid++, t, b, r };
}
function addItem(it) { if (it.r === 3) S.legend++; S.items.push(it); if (S.items.length > 60) { const i = S.items.findIndex(x => x.r === 0 && x.u !== S.equip.arme && !S.equip.mods.includes(x.u)); if (i >= 0) S.items.splice(i, 1); } }
function myLoadout() {
  const lo = { arme: null, dmgPk: 0, ammo: 0, hp: 0, vit: 0, cd: 0, cad: 0, sh: 0 };
  const a = itemById(S.equip.arme); const base = a ? ARMES[a.b] : ARMES.mitrailleuse; const R = RAR[a ? a.r : 0];
  for (const u of S.equip.mods) { const m = itemById(u); if (m) lo[MODS[m.b].k] += MODS[m.b].val[m.r]; }
  lo.sh += W_SH[a ? a.r : 0];
  lo.arme = { b: a ? a.b : 'mitrailleuse', r: a ? a.r : 0, dmg: base.dmg * R.m, cad: base.cad * (1 + R.cad) * (1 + lo.cad / 100), vit: base.vit, balles: base.balles, disp: base.disp, vie: base.vie, gros: base.gros || 0, laser: base.laser || 0 };
  return lo;
}
function botLoadout(k) {
  const b = pick(Object.keys(ARMES)), r = Math.random() < k * .5 ? 1 + (Math.random() < k * .4 ? 1 : 0) : 0, base = ARMES[b], R = RAR[r];
  return { arme: { b, r, dmg: base.dmg * R.m, cad: base.cad * (1 + R.cad), vit: base.vit, balles: base.balles, disp: base.disp, vie: base.vie, gros: base.gros || 0, laser: base.laser || 0 }, dmgPk: 0, ammo: 0, hp: 0, vit: 0, cd: 0, cad: 0, sh: W_SH[r] };
}
function sanitizeLo(lo) {
  try { const a = lo.arme, base = ARMES[a.b]; if (!base) throw 0; const r = clamp(a.r | 0, 0, 3), R = RAR[r]; const n = (v, m) => clamp(+v || 0, 0, m);
    const out = { dmgPk: n(lo.dmgPk, 80), ammo: n(lo.ammo, 6), hp: n(lo.hp, 72), vit: n(lo.vit, 30), cd: n(lo.cd, 70), cad: n(lo.cad, 56), sh: n(lo.sh, 130) };
    out.arme = { b: a.b, r, dmg: base.dmg * R.m, cad: base.cad * (1 + R.cad) * (1 + out.cad / 100), vit: base.vit, balles: base.balles, disp: base.disp, vie: base.vie, gros: base.gros || 0, laser: base.laser || 0 }; return out;
  } catch (e) { return botLoadout(0); }
}

/* ================== Son (WebAudio) ================== */
const SFX = (() => {
  let AC = null, master = null, nb = null, eng = null, engG = null, dest = null;
  function init() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = AC.createGain(); master.gain.value = S.son ? .55 : 0; master.connect(AC.destination);
    nb = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const ok = () => AC && S.son && AC.state === 'running';
  function noise(dur, type, f, vol, f2) {
    if (!ok()) return; const t = AC.currentTime, s = AC.createBufferSource(); s.buffer = nb;
    const fl = AC.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = AC.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(dest || master); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
  }
  function tone(type, f1, f2, dur, vol, delay = 0) {
    if (!ok()) return; const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain(); o.type = type;
    o.frequency.setValueAtTime(f1, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + .02);
  }
  let lastMg = 0;
  return {
    init, get ctx() { return AC; },
    at(x, y, z, fn) { // play fn() through a PannerNode placed at world position (x,y,z) → correct left/right side
      if (!ok()) return; let pn; try { pn = AC.createPanner(); pn.panningModel = 'equalpower'; pn.distanceModel = 'linear'; pn.rolloffFactor = 0; pn.refDistance = 1; pn.maxDistance = 1e4;
        if (pn.positionX) { pn.positionX.value = x; pn.positionY.value = y; pn.positionZ.value = z; } else pn.setPosition(x, y, z); pn.connect(master); } catch (e) { fn(); return; }
      dest = pn; try { fn(); } finally { dest = null; } setTimeout(() => { try { pn.disconnect(); } catch (e) { } }, 2500);
    },
    listen(cam) { if (!AC) return; const L = AC.listener, p = cam.position, f = cam.getWorldDirection(new THREE.Vector3());
      if (L.positionX) { const t = AC.currentTime; L.positionX.setValueAtTime(p.x, t); L.positionY.setValueAtTime(p.y, t); L.positionZ.setValueAtTime(p.z, t); L.forwardX.setValueAtTime(f.x, t); L.forwardY.setValueAtTime(f.y, t); L.forwardZ.setValueAtTime(f.z, t); L.upX.setValueAtTime(0, t); L.upY.setValueAtTime(1, t); L.upZ.setValueAtTime(0, t); }
      else { L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, 0, 1, 0); } },
    setOn(v) { if (master) master.gain.value = v ? .55 : 0; if (!v) this.engine(0, false); },
    mg(v = 1, laser) { if (!AC) return; const t = AC.currentTime; if (t - lastMg < .045) return; lastMg = t; if (laser) tone('square', 1800, 600, .07, .05 * v); else noise(.06, 'highpass', 1800, .22 * v); },
    canon(v = 1) { noise(.18, 'lowpass', 1400, .4 * v, 200); },
    boom(big = 1, v = 1) { noise(.5 + big * .4, 'lowpass', 900, .7 * v * Math.min(1.3, big), 60); tone('sine', 120, 35, .4 + big * .2, .4 * v); },
    missile(v = 1) { tone('sawtooth', 300, 900, .3, .08 * v); noise(.3, 'bandpass', 1200, .15 * v); },
    pick() { tone('square', 660, 0, .07, .08); tone('square', 990, 0, .09, .08, .07); },
    hit(v = 1) { tone('square', 220, 90, .06, .07 * v); },
    zap() { noise(.25, 'highpass', 3000, .3); tone('sawtooth', 1600, 200, .25, .12); },
    onde() { tone('sine', 90, 30, .6, .5); noise(.5, 'lowpass', 600, .5, 80); },
    clic() { tone('triangle', 520, 0, .05, .08); },
    bip(f = 660) { tone('square', f, 0, .12, .1); },
    go() { tone('square', 990, 0, .3, .12); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, 0, .25, .15, i * .12)); },
    lose() { [392, 330, 262].forEach((f, i) => tone('triangle', f, 0, .3, .14, i * .18)); },
    horn(t) { if (t === 'airhorn') { tone('sawtooth', 466, 0, .5, .12); tone('sawtooth', 587, 0, .5, .1); tone('sawtooth', 698, 0, .5, .08); } else if (t === 'roar') { noise(.8, 'lowpass', 300, .6, 80); tone('sawtooth', 90, 55, .8, .2); } },
    siren(v = 1) { if (!ok()) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; for (let i = 0; i < 4; i++) { o.frequency.setValueAtTime(600, t + i * .7); o.frequency.linearRampToValueAtTime(1100, t + i * .7 + .35); o.frequency.linearRampToValueAtTime(600, t + i * .7 + .7); } g.gain.setValueAtTime(.07 * v, t); g.gain.setValueAtTime(.07 * v, t + 2.6); g.gain.exponentialRampToValueAtTime(.001, t + 2.8); o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.9); },
    levelUp() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone('square', f, 0, .18, .09, i * .08)); },
    engine(speed, on) {
      if (!AC) return;
      if (!eng && on && S.son) { eng = AC.createOscillator(); eng.type = 'sawtooth'; engG = AC.createGain(); engG.gain.value = 0; const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; eng.connect(f); f.connect(engG); engG.connect(master); eng.start(); }
      if (!eng) return; const t = AC.currentTime;
      eng.frequency.setTargetAtTime(45 + Math.abs(speed) * 3.2, t, .08); engG.gain.setTargetAtTime(on && S.son ? .05 : 0, t, .1);
    },
  };
})();
const unlockAudio = () => SFX.init();
addEventListener('pointerdown', unlockAudio, true); addEventListener('touchend', unlockAudio, true); addEventListener('keydown', unlockAudio, true);

/* ================== Rendu ================== */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, .1, 600);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 1.2 ? 75 : 62; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
{
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#0d1b3d'); g.addColorStop(.45, '#4a2d6b'); g.addColorStop(.75, '#e8604c'); g.addColorStop(1, '#ffb36b'); x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
}
scene.fog = new THREE.Fog(0x6b4a7a, 90, 260);
const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x4a3a30, 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffd2a8, 2.2); sun.position.set(-60, 90, -40); scene.add(sun);
const MAT = {};
const lam = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
function tex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; }

/* ================== Arène ================== */
const A = 72, STEP = .7;
const blocks = [];
const world = new THREE.Group(); scene.add(world);
function surf(b, x, z) {
  if (x < b.x0 || x > b.x1 || z < b.z0 || z > b.z1) return -1; if (!b.ramp) return b.h;
  let t; switch (b.ramp) { case 'z+': t = (z - b.z0) / b.d; break; case 'z-': t = (b.z1 - z) / b.d; break; case 'x+': t = (x - b.x0) / b.w; break; default: t = (b.x1 - x) / b.w; }
  return b.h * clamp(t, 0, 1);
}
function groundAt(x, z, y, st = STEP) { let g = 0; for (const b of blocks) { const s = surf(b, x, z); if (s > g && s <= y + st) g = s; } return g; }
function solidAt(x, z, y) { for (const b of blocks) { if (surf(b, x, z) > y) return true; } return false; }
function addBlock(x, z, w, d, h, mat, ramp, noMesh) {
  const b = { x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, w, d, h, ramp };
  blocks.push(b);
  if (!noMesh) {
    const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0);
    if (ramp) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { if (p.getY(i) > h * .5) { const lx = p.getX(i), lz = p.getZ(i); if ((ramp === 'z+' && lz < 0) || (ramp === 'z-' && lz > 0) || (ramp === 'x+' && lx < 0) || (ramp === 'x-' && lx > 0)) p.setY(i, .02); } } g.computeVertexNormals(); }
    const m = new THREE.Mesh(g, mat); m.position.set(x, 0, z); world.add(m); b.mesh = m;
  }
  return b;
}
function buildArena() {
  const sol = tex(512, 512, (x, w, h) => {
    x.fillStyle = '#4a4d55'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 2500; i++) { const v = 60 + Math.random() * 40 | 0; x.fillStyle = `rgba(${v},${v},${v + 6},.35)`; x.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
    x.strokeStyle = 'rgba(20,20,24,.6)'; x.lineWidth = 3; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 128, 0); x.lineTo(i * 128, h); x.moveTo(0, i * 128); x.lineTo(w, i * 128); x.stroke(); }
    x.fillStyle = 'rgba(255,200,40,.75)'; for (let i = 0; i < 8; i++) x.fillRect(60 + i * 56, 250, 30, 8);
    x.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 30 + Math.random() * 40, 15 + Math.random() * 20, Math.random() * 3, 0, 7); x.fill(); }
  }, [12, 12]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(A * 2 + 6, A * 2 + 6), lam(0xffffff, { map: sol })); ground.rotation.x = -Math.PI / 2; world.add(ground);
  // logo requin au centre du toit (peint au sol)
  const logo = tex(256, 256, (x) => { x.translate(128, 128); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 10; x.beginPath(); x.arc(0, 0, 110, 0, 7); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.moveTo(-70, 45); x.quadraticCurveTo(-10, -20, 10, -85); x.quadraticCurveTo(30, -10, 75, 45); x.closePath(); x.fill(); });
  const hazard = tex(256, 64, (x, w, h) => { x.fillStyle = '#20232a'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffc21f'; for (let i = -2; i < 10; i++) { x.beginPath(); x.moveTo(i * 32, h); x.lineTo(i * 32 + 16, h); x.lineTo(i * 32 + 48, 0); x.lineTo(i * 32 + 32, 0); x.fill(); } }, [8, 1]);
  const mur = lam(0xffffff, { map: hazard });
  MAT.beton = lam(0x8b8f99); MAT.betonF = lam(0x6c707a); MAT.rampe = lam(0xa36b2b);
  const cont = [lam(0xc0392b), lam(0x2a6fdb), lam(0x2a9d4a), lam(0xe0a020)];
  // murs
  addBlock(0, -A - 1.5, A * 2 + 6, 3, 4.5, mur); addBlock(0, A + 1.5, A * 2 + 6, 3, 4.5, mur);
  addBlock(-A - 1.5, 0, 3, A * 2, 4.5, mur); addBlock(A + 1.5, 0, 3, A * 2, 4.5, mur);
  // plateforme centrale + rampes
  addBlock(0, 0, 26, 26, 3, MAT.beton);
  const lg = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), new THREE.MeshBasicMaterial({ map: logo, transparent: true, depthWrite: false })); lg.rotation.x = -Math.PI / 2; lg.position.y = 3.02; world.add(lg);
  addBlock(0, -19, 9, 12, 3, MAT.rampe, 'z+'); addBlock(0, 19, 9, 12, 3, MAT.rampe, 'z-');
  addBlock(-19, 0, 12, 9, 3, MAT.rampe, 'x+'); addBlock(19, 0, 12, 9, 3, MAT.rampe, 'x-');
  // tremplins
  addBlock(-44, 0, 8, 8, 2.2, MAT.rampe, 'z+'); addBlock(44, 0, 8, 8, 2.2, MAT.rampe, 'z-');
  addBlock(0, -48, 8, 8, 2, MAT.rampe, 'x+'); addBlock(0, 48, 8, 8, 2, MAT.rampe, 'x-');
  // conteneurs
  [[-30, -42, 12, 4.5], [32, -36, 4.5, 12], [-34, 38, 4.5, 12], [30, 44, 12, 4.5], [-58, -20, 4.5, 12], [58, 22, 4.5, 12]].forEach((c, i) => addBlock(c[0], c[1], c[2], c[3], 3.6, cont[i % 4]));
  // piliers / tour
  [[-50, -50], [50, -50], [-50, 50], [50, 50]].forEach(p => addBlock(p[0], p[1], 4, 4, 7, MAT.betonF));
  [[-16, -52], [18, 54], [-60, 8], [60, -8], [24, -60], [-26, 60]].forEach(p => addBlock(p[0], p[1], 3.5, 3.5, 1.5, lam(0x9aa3ad)));
  // décor : ville autour (toits voisins)
  const vg = new THREE.BoxGeometry(1, 1, 1); vg.translate(0, .5, 0);
  const vm = [lam(0x2b3350), lam(0x3a3050), lam(0x24324a)];
  const win = new THREE.MeshBasicMaterial({ color: 0xffd27a });
  for (let i = 0; i < 46; i++) {
    const ang = i / 46 * Math.PI * 2 + rand(-.05, .05), r = rand(110, 190), w = rand(12, 26), h = rand(10, 70);
    const m = new THREE.Mesh(vg, pick(vm)); m.scale.set(w, h, rand(12, 26)); m.position.set(Math.cos(ang) * r, -25, Math.sin(ang) * r); world.add(m);
    if (Math.random() < .6) { const wl = new THREE.Mesh(vg, win); wl.scale.set(w * .2, 1.2, w * 1.02); wl.position.set(m.position.x, -25 + h * rand(.3, .9), m.position.z); world.add(wl); }
  }
  // cheminées décoratives
  for (let i = 0; i < 3; i++) { const ch = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.2, 40, 10), lam(0x6b3a2a)); ch.position.set(-90 + i * 25, 0, -100 - i * 12); world.add(ch); }
}
buildArena();

/* ================== Effets ================== */
const dummy = new THREE.Object3D();
const PMAX = 700;
const pMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial(), PMAX);
pMesh.frustumCulled = false; scene.add(pMesh);
const parts = []; for (let i = 0; i < PMAX; i++) { parts.push({ life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 1, g: 0 }); pMesh.setColorAt(i, new THREE.Color(1, 1, 1)); }
let pIdx = 0; const tmpC = new THREE.Color();
function spawnP(x, y, z, vx, vy, vz, life, size, color, grav = 0) {
  const p = parts[pIdx]; pMesh.setColorAt(pIdx, tmpC.set(color)); pIdx = (pIdx + 1) % PMAX;
  p.p.set(x, y, z); p.v.set(vx, vy, vz); p.life = p.max = life; p.s = size; p.g = grav; pMesh.instanceColor.needsUpdate = true;
}
function updParts(dt) {
  for (let i = 0; i < PMAX; i++) {
    const p = parts[i];
    if (p.life > 0) { p.life -= dt; p.v.y -= p.g * dt; p.p.addScaledVector(p.v, dt); if (p.p.y < 0) { p.p.y = 0; p.v.y *= -.3; } const k = Math.max(0, p.life / p.max); dummy.position.copy(p.p); dummy.scale.setScalar(p.s * (.3 + .7 * k)); dummy.rotation.set(p.life * 5, p.life * 3, 0); }
    else dummy.scale.setScalar(0), dummy.position.set(0, -50, 0);
    dummy.updateMatrix(); pMesh.setMatrixAt(i, dummy.matrix);
  }
  pMesh.instanceMatrix.needsUpdate = true;
}
const FIRE = [0xffe066, 0xffa21f, 0xff5a1f, 0xe3261a];
// balles (visuelles + logiques)
const BMAX = 260;
const bMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial(), BMAX); bMesh.frustumCulled = false; scene.add(bMesh);
const bullets = []; for (let i = 0; i < BMAX; i++) { bullets.push({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0 }); bMesh.setColorAt(i, new THREE.Color(1, 1, .5)); }
let bIdx = 0;
function spawnBullet(owner, p, v, dmg, life, fake, look) {
  const b = bullets[bIdx]; bMesh.setColorAt(bIdx, tmpC.set(look === 2 ? 0x22e5ff : look === 1 ? 0xff8a3c : 0xfff07a)); bMesh.instanceColor.needsUpdate = true; bIdx = (bIdx + 1) % BMAX;
  b.on = true; b.p.copy(p); b.v.copy(v); b.life = life; b.owner = owner; b.dmg = dmg; b.fake = fake; b.sz = look === 1 ? .35 : .14;
}
// boules de feu
const fbGeo = new THREE.SphereGeometry(1, 14, 10); const fballs = [];
for (let i = 0; i < 18; i++) { const m = new THREE.Mesh(fbGeo, new THREE.MeshBasicMaterial({ color: 0xffa21f, transparent: true, depthWrite: false })); m.visible = false; scene.add(m); fballs.push({ m, t: 0, r: 1 }); }
let fbIdx = 0;
const ringGeo = new THREE.RingGeometry(.85, 1, 40); const rings = [];
for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, side: THREE.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); rings.push({ m, t: 0, r: 1 }); }
let rIdx = 0; const zaps = [];
const camShake = { v: 0 };
function fxBoom(x, y, z, r, big) {
  const f = fballs[fbIdx]; fbIdx = (fbIdx + 1) % fballs.length; f.m.visible = true; f.t = 0; f.r = r; f.m.position.set(x, y + .5, z);
  const n = Math.round((big ? 46 : 18) * (G.pm || 1));
  for (let i = 0; i < n; i++) { const a = Math.random() * 7, s = rand(4, 14) * (big ? 1.3 : .8); spawnP(x, y + 1, z, Math.cos(a) * s, rand(3, 14), Math.sin(a) * s, rand(.4, 1), rand(.3, .9) * (big ? 1.4 : 1), pick(FIRE), 18); }
  for (let i = 0; i < n / 2; i++) spawnP(x + rand(-1, 1), y + 1, z + rand(-1, 1), rand(-2, 2), rand(2, 6), rand(-2, 2), rand(1, 2), rand(.8, 1.6), pick([0x333333, 0x555555, 0x222222]), -1);
  if (G.me) { const d = Math.hypot(G.me.pos.x - x, G.me.pos.z - z); camShake.v = Math.max(camShake.v, (big ? 1.2 : .6) * clamp(1 - d / 45, 0, 1)); SFX.at(x, y, z, () => SFX.boom(big ? 1.3 : .7, clamp(1.2 - d / 70, .15, 1))); soundInd(x, z, big ? 1.3 : .9); }
}
function fxRing(x, y, z, r) { const g = rings[rIdx]; rIdx = (rIdx + 1) % rings.length; g.m.visible = true; g.t = 0; g.r = r; g.m.position.set(x, y + .3, z); }
function fxZap(a, b) {
  const pts = []; const n = 8; for (let i = 0; i <= n; i++) { const t = i / n; pts.push(new THREE.Vector3(a.x + (b.x - a.x) * t + (i && i < n ? rand(-1, 1) : 0), a.y + 1.5 + (b.y - a.y) * t + (i && i < n ? rand(-1, 1) : 0), a.z + (b.z - a.z) * t + (i && i < n ? rand(-1, 1) : 0))); }
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x9fe8ff })); scene.add(l); zaps.push({ l, t: .3 });
  for (let i = 0; i < 12; i++) spawnP(b.x, b.y + 1.2, b.z, rand(-6, 6), rand(2, 8), rand(-6, 6), .4, .25, 0x9fe8ff, 10);
  SFX.zap();
}
function fxBeam(a, b, col) {
  const d = Math.hypot(b.x - a.x, b.z - a.z, b.y - a.y); const m = new THREE.Mesh(new THREE.BoxGeometry(.35, .35, d), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .9, depthWrite: false }));
  m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 + 1.2, (a.z + b.z) / 2); m.lookAt(b.x, b.y + 1.2, b.z); scene.add(m); zaps.push({ l: m, t: .35 });
  for (let i = 0; i < 16; i++) spawnP(b.x, b.y + 1.2, b.z, rand(-6, 6), rand(2, 8), rand(-6, 6), .5, .3, col, 10); SFX.zap();
}
function fxSparks(x, y, z, n = 4, c = 0xffe066) { for (let i = 0; i < n; i++) spawnP(x, y, z, rand(-5, 5), rand(1, 6), rand(-5, 5), .25, .18, c, 15); }
function updFx(dt) {
  for (const f of fballs) if (f.m.visible) { f.t += dt; const k = f.t / .5; if (k >= 1) { f.m.visible = false; continue; } f.m.scale.setScalar(f.r * (.3 + k)); f.m.material.opacity = 1 - k; f.m.material.color.setHex(k < .3 ? 0xffe066 : 0xff6a1f); }
  for (const g of rings) if (g.m.visible) { g.t += dt; const k = g.t / .45; if (k >= 1) { g.m.visible = false; continue; } g.m.scale.setScalar(g.r * k); g.m.material.opacity = 1 - k; }
  for (let i = zaps.length - 1; i >= 0; i--) { const z = zaps[i]; z.t -= dt; if (z.l.isMesh) z.l.material.opacity = z.t / .35; if (z.t <= 0) { scene.remove(z.l); z.l.geometry.dispose(); zaps.splice(i, 1); } }
}

/* ================== Bonus & décor destructible ================== */
const pickups = [];
const PK_SPOTS = [[0, 0, 3], [-30, -30], [30, 30], [-30, 30], [30, -30], [-60, -60], [60, 60], [-60, 60], [60, -60], [0, -62], [0, 62], [-62, 0], [62, 0], [-44, 12], [44, -12], [-12, 40], [12, -40]];
const pkTex = {};
function pkSprite(t) {
  if (!pkTex[t]) pkTex[t] = tex(128, 128, (x) => { if (t === 'mega') { const gr = x.createConicGradient ? x.createConicGradient(0, 64, 64) : null; if (gr) { ['#ff3b3b', '#ffc21f', '#7ef29d', '#2fa8ff', '#b06cff', '#ff3b3b'].forEach((c, i) => gr.addColorStop(i / 5, c)); x.fillStyle = gr; } else x.fillStyle = '#ff70a6'; } else x.fillStyle = '#' + PICK[t].coul.toString(16).padStart(6, '0'); x.beginPath(); x.arc(64, 64, 56, 0, 7); x.fill(); x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke(); x.font = '64px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(PICK[t].ic, 64, 70); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: pkTex[t], depthWrite: false })); s.scale.set(1.8, 1.8, 1); return s;
}
const pkCore = new THREE.OctahedronGeometry(.6);
function makePickups() {
  for (const p of pickups) world.remove(p.g); pickups.length = 0;
  PK_SPOTS.forEach((s, i) => {
    const t = i === 0 ? 'napalm' : i % 5 === 1 ? 'sante' : i % 5 === 3 ? 'turbo' : i % 5 === 4 ? (i % 10 === 9 ? 'over' : 'bouc') : WPK[i % 4];
    const r = PK_AMT[t] ? PK_RAR[i % PK_RAR.length] : -1;
    const g = new THREE.Group(); const c = new THREE.Mesh(pkCore, new THREE.MeshBasicMaterial({ color: PICK[t].coul })); g.add(c); const sp = pkSprite(t); sp.position.y = 1.4; g.add(sp);
    if (r >= 0) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.95, .07, 6, 24), new THREE.MeshBasicMaterial({ color: RAR[r].coul })); ring.rotation.x = Math.PI / 2; ring.position.y = -.6; g.add(ring); if (r > 0) c.scale.setScalar(1 + r * .18); }
    g.position.set(s[0], (s[2] || 0) + 1, s[1]); world.add(g); pickups.push({ i, t, g, on: true, cd: 0, x: s[0], z: s[1], y: s[2] || 0, r });
  });
  [[0, 0, 3], [-46, -46, 0], [46, 46, 0]].forEach((s, j) => { const i = pickups.length; const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.OctahedronGeometry(1), new THREE.MeshBasicMaterial({ color: 0xffffff })); g.add(c); const sp = pkSprite('mega'); sp.scale.set(2.6, 2.6, 1); sp.position.y = 2; g.add(sp);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, 30, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .25, depthWrite: false, side: THREE.DoubleSide })); beam.position.y = 15; g.add(beam);
    g.position.set(s[0], s[2] + 1.6, s[1] + (j === 0 ? 7 : 0)); g.visible = false; world.add(g); pickups.push({ i, t: 'mega', g, on: false, cd: 0, x: s[0], z: s[1] + (j === 0 ? 7 : 0), y: s[2], mega: 1, core: c, beam }); });
}
const props = [];
const barilGeo = new THREE.CylinderGeometry(.6, .6, 1.4, 10); barilGeo.translate(0, .7, 0);
const caisseGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5); caisseGeo.translate(0, .75, 0);
const barilMat = lam(0xd62828), caisseMat = lam(0x9c6b3a);
function makeProps() {
  for (const p of props) world.remove(p.m); props.length = 0;
  const pos = [[-24, -10, 1], [-24, -7, 1], [24, 9, 1], [24, 12, 0], [-40, -40, 0], [-38, -38, 1], [40, 40, 0], [38, 36, 1], [-52, 30, 0], [-52, 33, 0], [52, -30, 1], [52, -33, 0], [10, -30, 1], [-10, 30, 1], [-66, -66, 0], [66, 66, 0], [66, -66, 1], [-66, 66, 1], [20, -66, 0], [-20, 66, 0], [-8, 4, 1, 3], [8, -4, 0, 3]];
  pos.forEach((p, i) => { const baril = !!p[2]; const m = new THREE.Mesh(baril ? barilGeo : caisseGeo, baril ? barilMat : caisseMat); const y = p[3] || 0; m.position.set(p[0], y, p[1]); m.rotation.y = rand(0, 3); world.add(m); props.push({ i, m, x: p[0], z: p[1], y, baril, hp: baril ? 12 : 20, on: true, r: baril ? .8 : 1 }); });
}

/* ================== Modèles de véhicules ================== */
const wheelGeo = new THREE.CylinderGeometry(1, 1, 1, 12); wheelGeo.rotateZ(Math.PI / 2);
const MAT_PNEU = lam(0x1a1a1e), MAT_VITRE = lam(0x1b2a3a, { emissive: 0x0a1420 }), MAT_METAL = lam(0x555a63), MAT_NOIR = lam(0x15161a), MAT_BLANC = lam(0xffffff), MAT_PHARE = new THREE.MeshBasicMaterial({ color: 0xfff3c0 }), MAT_FEU_AR = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
const MAT_CALCINE = lam(0x1c1a19);
function finGeo(h, l) { const s = new THREE.Shape(); s.moveTo(-l / 2, 0); s.quadraticCurveTo(-l * .1, h * .4, l * .15, h); s.quadraticCurveTo(l * .2, h * .3, l / 2, 0); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: .14, bevelEnabled: false }); g.translate(0, 0, -.07); g.rotateY(Math.PI / 2); return g; }
const MAT_PEAU = lam(0xe0ac69), MAT_PANT = lam(0x2b2d42), MAT_ORANGE = lam(0xffa21f), MAT_GLOW = new THREE.MeshBasicMaterial({ color: 0x5ff0ff }), MAT_SIGN = new THREE.MeshBasicMaterial({ color: 0xffa21f });
const LEG_GEO = new THREE.BoxGeometry(.17, .8, .2), TORSO_GEO = new THREE.BoxGeometry(.5, .62, .3), ARM_GEO = new THREE.BoxGeometry(.12, .55, .12), HEAD_GEO = new THREE.SphereGeometry(.16, 12, 8), HELM_GEO = new THREE.SphereGeometry(.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
function buildCar(type, c, a, em) {
  const g = new THREE.Group(), wheels = [], anim = {};
  const body = lam(c, em ? { emissive: c, emissiveIntensity: .15 } : {}), acc = lam(a, em ? { emissive: a, emissiveIntensity: .8 } : {});
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, par = g) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); par.add(o); return o; };
  const B = (w, h, d, m, x, y, z, rx = 0, ry = 0, rz = 0) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, rx, ry, rz);
  const SP = (r, m, x, y, z, sx = 1, sy = 1, sz = 1) => { const o = add(new THREE.SphereGeometry(r, 16, 12), m, x, y, z); o.scale.set(sx, sy, sz); return o; };
  const CY = (rt, rb, h, m, x, y, z, rx = 0, ry = 0, rz = 0, seg = 12) => add(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, rx, ry, rz);
  const W = (r, wd, x, y, z) => { const o = new THREE.Mesh(wheelGeo, MAT_PNEU); o.scale.set(wd, r, r); o.position.set(x, y, z); g.add(o); wheels.push(o); return o; };
  const W4 = (r, wd, hx, fz, rz) => { W(r, wd, -hx, r, fz); W(r, wd, hx, r, fz); W(r, wd, -hx, r, rz); W(r, wd, hx, r, rz); };
  const lights = (hx, y, fz, rz, round) => { for (const s of [-1, 1]) { if (round) { CY(.16, .16, .06, MAT_PHARE, s * hx, y, fz, Math.PI / 2); CY(.13, .13, .06, MAT_FEU_AR, s * hx, y, rz, Math.PI / 2); } else { B(.36, .15, .06, MAT_PHARE, s * hx, y, fz); B(.36, .13, .06, MAT_FEU_AR, s * hx, y, rz); } } };
  const quadTail = (y, z, x1, x2) => { for (const x of [-x2, -x1, x1, x2]) CY(.12, .12, .06, MAT_FEU_AR, x, y, z, Math.PI / 2); };
  const wedge = (w, h, d, m, x, y, z, front = .25, back = 1) => { const geo = new THREE.BoxGeometry(w, h, d); const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setY(i, p.getZ(i) > 0 ? -h / 2 + h * front : -h / 2 + h * back); geo.computeVertexNormals(); return add(geo, m, x, y, z); };
  const wing = (w, y, z, m, stalk) => { B(w, .07, .45, m, 0, y, z); for (const s of [-1, 1]) B(.08, stalk, .1, m, s * w * .33, y - stalk / 2, z); };
  const rider = (y, z, lean, shirt, sit, skates) => {
    const r = new THREE.Group(); r.position.set(0, y, z); g.add(r); const legs = [];
    for (const s of [-1, 1]) { const pv = new THREE.Group(); pv.position.set(s * .13, 0, 0); r.add(pv); add(LEG_GEO, MAT_PANT, 0, -.4, 0, 0, 0, 0, pv); add(new THREE.BoxGeometry(.18, .12, .3), MAT_NOIR, 0, -.82, .05, 0, 0, 0, pv);
      if (skates) { add(new THREE.BoxGeometry(.2, .2, .36), body, 0, -.8, .04, 0, 0, 0, pv); for (let k = 0; k < 3; k++) add(new THREE.CylinderGeometry(.06, .06, .05, 8), acc, 0, -.95, -.1 + k * .14, 0, 0, Math.PI / 2, pv); }
      if (sit) pv.rotation.x = -1.2; legs.push(pv); }
    const t = new THREE.Group(); t.rotation.x = lean; r.add(t);
    add(TORSO_GEO, shirt, 0, .33, 0, 0, 0, 0, t);
    for (const s of [-1, 1]) add(ARM_GEO, shirt, s * .31, .42, .16, -1.1, 0, 0, t);
    add(HEAD_GEO, MAT_PEAU, 0, .8, 0, 0, 0, 0, t); add(HELM_GEO, body, 0, .82, 0, 0, 0, 0, t);
    anim.legs = legs; anim.torse = t; return r;
  };
  switch (type) {
    case 'megabite': {
      SP(1, body, 0, 1.05, 0, 1.05, .72, 2.5); SP(1, acc, 0, .85, .25, .95, .45, 2.2);
      add(finGeo(1.3, 1.6), body, 0, 1.6, -.3);
      add(finGeo(1.1, 1.0), body, 0, 1.15, -2.55, -.6); add(finGeo(.7, .8), body, 0, .95, -2.5, Math.PI + .6);
      for (const s of [-1, 1]) { B(1.1, .08, .6, body, s * 1.15, .75, .55, 0, s * .35, -s * .35); SP(.12, MAT_NOIR, s * .62, 1.25, 1.75); for (let k = 0; k < 3; k++) B(.03, .32, .06, MAT_NOIR, s * 1.0, 1.05, 1.05 - k * .2); }
      B(1.1, .2, .3, MAT_NOIR, 0, .82, 2.38); const tooth = new THREE.ConeGeometry(.07, .2, 4); for (let k = 0; k < 7; k++) add(tooth, MAT_BLANC, -.45 + k * .15, .86, 2.45, Math.PI);
      W4(.42, .4, 1.0, 1.4, -1.4); break; }
    case 'cluck': {
      SP(1, body, 0, 1.15, -.1, 1.05, .85, 1.6); SP(.55, body, 0, 1.95, 1.1);
      for (let k = 0; k < 3; k++) B(.12, .32 - k * .05, .22, acc, 0, 2.55 - k * .04, .95 + k * .2);
      CY(0, .18, .45, MAT_ORANGE, 0, 1.92, 1.75, Math.PI / 2); SP(.12, acc, 0, 1.62, 1.55, 1, 1.5, 1);
      for (const s of [-1, 1]) { SP(.08, MAT_NOIR, s * .33, 2.05, 1.52); SP(1, body, s * 1.0, 1.2, -.15, .25, .55, 1.0); B(.12, .7, .35, body, s * .25, 1.9, -1.55, -.6, 0, s * .4); }
      B(.12, .8, .35, body, 0, 2.0, -1.6, -.5); W4(.4, .38, .95, 1.15, -1.2); break; }
    case 'hornet': {
      wedge(1.95, .75, 3.9, body, 0, .75, 0, .7, 1); wedge(1.75, .62, 2.1, MAT_VITRE, 0, 1.42, -.45, .35, 1); B(1.7, .08, 1.5, body, 0, 1.76, -.75);
      wing(1.9, 1.95, -1.75, acc, .3); for (const s of [-1, 1]) B(.03, .12, 3.5, acc, s * .99, .8, 0);
      for (const x of [-.15, 0, .15]) CY(.07, .07, .2, MAT_METAL, x, .5, -1.98, Math.PI / 2);
      B(1.6, .25, .06, MAT_NOIR, 0, .65, 1.96); lights(.7, .88, 1.96, -1.96); W4(.4, .35, .95, 1.25, -1.25); break; }
    case 'mini': {
      B(1.6, .75, 2.9, body, 0, .8, 0); B(1.5, .55, 1.7, MAT_VITRE, 0, 1.45, -.2); B(1.55, .08, 1.75, acc, 0, 1.76, -.2);
      for (const s of [-1, 1]) B(.18, .02, 1.0, acc, s * .25, 1.18, .95); B(1.0, .25, .06, MAT_METAL, 0, .75, 1.46);
      lights(.55, .95, 1.46, -1.46, true); W4(.33, .3, .8, 1.0, -1.0); break; }
    case 'rosso': {
      wedge(2.1, .6, 4.6, body, 0, .6, 0, .55, .9); wedge(1.5, .45, 1.8, MAT_VITRE, 0, 1.12, -.3, .25, .8); B(1.9, .1, 1.2, body, 0, .92, -1.7);
      for (const s of [-1, 1]) { B(.05, .25, .8, MAT_NOIR, s * 1.06, .6, -.5); B(.42, .07, .2, MAT_PHARE, s * .65, .72, 2.22); }
      B(1.8, .06, .2, body, 0, .99, -2.25); quadTail(.78, -2.31, .45, .8); W4(.42, .38, 1.0, 1.45, -1.45); break; }
    case 'toro': {
      wedge(2.2, .65, 4.7, body, 0, .6, 0, .12, 1); wedge(1.5, .45, 2.0, MAT_VITRE, 0, 1.15, -.2, .05, 1);
      B(1.6, .05, 1.3, MAT_NOIR, 0, .95, -1.6); wing(2.0, 1.35, -2.1, acc, .4);
      for (const s of [-1, 1]) { B(.06, .35, .9, MAT_NOIR, s * 1.11, .65, -.6); B(.45, .06, .15, MAT_PHARE, s * .7, .45, 2.3, 0, s * .3, 0); }
      B(1.8, .08, .06, MAT_FEU_AR, 0, .85, -2.36); W4(.43, .4, 1.05, 1.5, -1.5); break; }
    case 'stutt': {
      B(1.85, .55, 4.2, body, 0, .6, 0); wedge(1.85, .3, 1.3, body, 0, 1.02, 1.4, .1, 1);
      SP(1, body, 0, 1.0, -.5, .88, .58, 1.6); B(1.7, .26, 1.4, MAT_VITRE, 0, 1.18, -.25);
      for (const s of [-1, 1]) CY(.17, .17, .1, MAT_PHARE, s * .62, .95, 2.06, Math.PI / 2 - .3);
      B(1.7, .08, .06, MAT_FEU_AR, 0, .82, -2.11); B(1.5, .08, .35, body, 0, 1.08, -1.95, -.25); W4(.4, .36, .92, 1.35, -1.35); break; }
    case 'godzira': {
      B(2.05, .7, 4.5, body, 0, .75, 0); wedge(1.75, .6, 2.2, MAT_VITRE, 0, 1.4, -.35, .4, .75); B(1.6, .06, 1.2, body, 0, 1.7, -.45);
      wing(1.9, 1.45, -2.0, MAT_NOIR, .35); quadTail(.95, -2.26, .45, .75); B(1.3, .3, .06, MAT_NOIR, 0, .7, 2.26);
      for (const s of [-1, 1]) { B(.45, .12, .06, MAT_PHARE, s * .7, .95, 2.26); B(.04, .1, 3.6, acc, s * 1.03, .45, 0); }
      W4(.43, .42, 1.0, 1.4, -1.4); break; }
    case 'sky34': {
      B(2.0, .72, 4.5, body, 0, .78, 0); wedge(1.8, .62, 2.2, MAT_VITRE, 0, 1.45, -.3, .55, .8); B(1.7, .06, 1.4, body, 0, 1.78, -.35);
      wing(1.9, 1.6, -2.0, body, .45); quadTail(.98, -2.26, .45, .75); B(1.5, .25, .06, MAT_NOIR, 0, .7, 2.26);
      for (const s of [-1, 1]) B(.5, .14, .06, MAT_PHARE, s * .68, .98, 2.26, 0, 0, s * .1);
      W4(.42, .4, 1.0, 1.4, -1.4); break; }
    case 'titan': {
      B(2.3, .5, 6, MAT_NOIR, 0, 1.0, 0); B(2.3, 1.5, 1.9, body, 0, 2.2, .5); B(2.32, .6, 1.0, MAT_VITRE, 0, 2.45, .8); B(2.1, .6, .06, MAT_VITRE, 0, 2.45, 1.46);
      B(2.1, 1.1, 1.8, body, 0, 1.9, 2.3); B(1.7, 1.0, .1, acc, 0, 1.85, 3.22); for (let k = 0; k < 4; k++) B(1.5, .06, .12, MAT_NOIR, 0, 1.5 + k * .22, 3.25);
      B(2.3, .9, 2.6, body, 0, 1.75, -1.8); B(2.0, .1, 2.3, MAT_NOIR, 0, 2.21, -1.8); CY(.25, .3, 1.2, MAT_METAL, 0, 2.6, -1.8, -.6);
      lights(.85, 2.05, 3.22, -3.11); W(.7, .45, -1.15, .7, 2.2); W(.7, .45, 1.15, .7, 2.2); W(.7, .8, -1.15, .7, -1.8); W(.7, .8, 1.15, .7, -1.8); break; }
    case 'bus': {
      B(2.5, 2.4, 7.4, body, 0, 1.75, 0); B(2.52, .35, 7.42, acc, 0, .95, 0); B(2.54, .7, 6.2, MAT_VITRE, 0, 2.25, -.3);
      B(2.3, 1.0, .06, MAT_VITRE, 0, 2.2, 3.71); B(1.6, .25, .06, MAT_SIGN, 0, 2.8, 3.72); B(1.4, .3, 1.8, MAT_METAL, 0, 3.1, -1);
      lights(.9, 1.0, 3.71, -3.71); W4(.55, .5, 1.1, 2.6, -2.4); break; }
    case 'bigrig': {
      const o = -.3;
      B(2.4, 1.8, 2.2, body, 0, 2.2, 3.0 + o); B(2.4, 2.1, 1.0, body, 0, 2.35, 1.5 + o); B(2.2, 1.1, 1.6, body, 0, 1.75, 4.9 + o);
      B(1.6, .9, .08, MAT_METAL, 0, 1.75, 5.72 + o); B(2.2, .7, .06, MAT_VITRE, 0, 2.6, 4.11 + o);
      for (const s of [-1, 1]) CY(.1, .1, 2.4, MAT_METAL, s * 1.25, 2.9, 2.0 + o);
      B(2.5, 2.6, 6.0, acc, 0, 2.55, -2.2 + o); B(2.52, .25, 6.02, body, 0, 1.55, -2.2 + o); B(2.0, .3, 1.4, MAT_NOIR, 0, 1.0, 1.2 + o);
      lights(.85, 1.8, 5.72 + o, -5.22 + o);
      for (const z of [4.8, 2.0, 1.1, -3.9, -4.8]) { W(.55, z > 4 ? .45 : .75, -1.05, .55, z + o); W(.55, z > 4 ? .45 : .75, 1.05, .55, z + o); } break; }
    case 'flyer': {
      SP(1, body, 0, .6, 0, 1.0, .5, 2.3); SP(.7, MAT_VITRE, 0, .95, .2, 1, .6, 1.4); B(3.2, .08, 1.0, acc, 0, .6, -.6);
      for (const s of [-1, 1]) { add(finGeo(.7, .9), acc, s * .6, .9, -1.8); for (const z of [-1.3, 1.3]) { CY(.38, .38, .25, MAT_METAL, s * 1.3, .3, z); CY(.32, .32, .05, MAT_GLOW, s * 1.3, .16, z); } }
      break; }
    case 'moto': {
      W(.42, .18, 0, .42, .85); W(.42, .22, 0, .42, -.8); B(.2, .3, 1.2, body, 0, .75, 0, .2); B(.42, .3, .6, body, 0, 1.0, .25); B(.35, .12, .7, MAT_NOIR, 0, 1.05, -.35);
      B(.55, .45, .4, acc, 0, 1.05, .78, -.4); B(.8, .06, .06, MAT_METAL, 0, 1.25, .6); CY(.07, .09, .8, MAT_METAL, .25, .6, -.5, Math.PI / 2); CY(.12, .12, .05, MAT_PHARE, 0, 1.05, 1.0, Math.PI / 2);
      rider(1.1, -.2, .75, acc, true); break; }
    case 'bike': {
      W(.48, .06, 0, .48, .6); W(.48, .06, 0, .48, -.6); B(.05, .05, 1.0, body, 0, 1.0, 0); B(.05, .05, .95, body, 0, .75, .25, .7); B(.05, .6, .05, body, 0, .8, -.2, .2);
      B(.6, .04, .04, MAT_METAL, 0, 1.15, .5); B(.15, .06, .3, MAT_NOIR, 0, 1.12, -.25); rider(1.15, -.15, .55, acc, true); anim.pedal = 1; break; }
    case 'scooter': {
      B(.3, .06, 1.0, body, 0, .18, 0); W(.12, .08, 0, .12, .45); W(.12, .08, 0, .12, -.45); CY(.03, .03, 1.1, MAT_METAL, 0, .75, .45, -.15); B(.55, .04, .04, MAT_METAL, 0, 1.3, .38);
      rider(1.03, -.1, .2, acc, false); break; }
    case 'blades': { rider(.98, 0, .4, acc, false, true); anim.skate = 1; break; }
  }
  if (VEH[type].vol) { const hov = new THREE.Group(); [...g.children].forEach(o => hov.add(o)); hov.position.y = 1.0; g.add(hov); anim.hov = hov; }
  const bb = new THREE.Box3().setFromObject(g); const sz = bb.getSize(new THREE.Vector3());
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(.8, sz.x * .9), Math.max(1, sz.z * .95)), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .35, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = .04; g.add(sh);
  g.rotation.order = 'YXZ';
  return { g, wheels, sh, anim };
}
function skinColors(type, skinId) { const s = SKINS.find(k => k.id === skinId); if (!s || !s.c) return [VEH[type].coul, VEH[type].acc, 0]; return [s.c, s.a, s.em || 0]; }

/* ================== État de jeu ================== */
const G = { mode: 'menu', net: null, cars: [], me: null, proj: [], t: 0, wave: 1, ev: [], projId: 1, snapT: 0, endT: 0, ended: false, spect: null, diff: .6, nTotal: 0 };
const AUTH = () => G.net !== 'client';
function emit(e) { if (G.net === 'host') G.ev.push(e); }

class Car {
  constructor(r) {
    this.id = r.id; this.nom = r.nom; this.type = r.v; this.st = VEH[r.v]; this.bot = !!r.bot; this.peer = r.peer || null; this.local = !!r.local;
    this.lo = r.lo || botLoadout(0);
    const col = r.col || skinColors(r.v, r.sk); this.col = col;
    const m = buildCar(r.v, col[0], col[1], col[2]); this.mesh = m.g; this.anim = m.anim; this.step = VEH[r.v].vol ? 4.2 : STEP; this.flameT = this.chargeT = this.nitroT = this.shieldT = this.cloakT = this.spinT = 0; this.ph = 0; this.wheels = m.wheels; this.shadow = m.sh; markShadows(this.mesh, true, false); m.sh.castShadow = false; m.sh.visible = !renderer.shadowMap.enabled; scene.add(this.mesh);
    this.pos = new THREE.Vector3(); this.yaw = 0; this.vx = 0; this.vz = 0; this.speed = 0; this.vy = 0; this.onGround = true;
    this.maxHp = Math.round(this.st.blindage * (1 + this.lo.hp / 100) * (r.hpMul || 1)); this.hp = this.maxHp;
    this.shMax = Math.round((VSH(this.st) + (this.lo.sh || 0)) * (r.hpMul || 1)); this.sh = this.shMax; this.shT = 0; this.alive = true;
    this.dmgMul = r.dmgMul || 1;
    this.turbo = 100; this.specMax = this.st.special.cd * (1 - this.lo.cd / 100); this.specCd = 3; this.w = { missile: 0, feu: 0, mine: 0, napalm: 0, mega: 0 }; this.deaths = 0; this.respawnT = 0; this.sel = null;
    this.mgCd = 0; this.burn = 0; this.lastAtk = null; this.lastAtkT = 0; this.kills = 0; this.dmgDone = 0; this.rank = 0; this.firing = false; this.turboOn = false; this.hitT = 0; this.deadT = 0;
    this.ctrl = { thr: 0, steer: 0, fire: false, turbo: false, brake: false, wpnN: 0, specN: 0, cycN: 0 }; this.seen = { wpn: 0, spec: 0, cyc: 0 };
    this.ai = { t: 0, target: null, goal: null, stuck: 0, rev: 0, wander: null, k: r.k || .5 };
    this.av = sanAv(r.av); this.clan = sanClan(r.cl || ''); this.team = r.team === 0 || r.team === 1 ? r.team : -1;
    this.tgt = null; this.fakeCd = 0; this.side = 1; this.minHp = this.maxHp; this.trail = TRAILS[r.tr] || TRAILS['']; this.titre = r.ti || '';
  }
  get maxS() { return this.st.vitesse * (1 + this.lo.vit / 100) * (this.nitroT > 0 ? 1.3 : 1); }
  fwd() { return [Math.sin(this.yaw), Math.cos(this.yaw)]; }
  physics(dt) {
    const st = this.st, c = this.ctrl;
    this.turboOn = c.turbo && this.turbo > 1;
    if (this.turboOn) this.turbo = Math.max(0, this.turbo - 34 * dt); else this.turbo = Math.min(100, this.turbo + 7 * dt);
    let thr = c.thr; if (this.turboOn || this.chargeT > 0) thr = Math.max(thr, 1);
    const maxS = this.maxS * (this.chargeT > 0 ? 1.9 : this.turboOn ? 1.45 : 1);
    if (this.onGround) {
      if (c.brake) this.speed *= Math.pow(.06, dt);
      else if (thr > .05) { if (this.speed < 0) this.speed += st.accel * 2.2 * dt; else if (this.speed < maxS * Math.min(1, thr * 1.15)) this.speed += st.accel * (this.turboOn ? 1.9 : 1) * dt; else this.speed -= 10 * dt; }
      else if (thr < -.05) { if (this.speed > .5) this.speed -= st.accel * 2.4 * dt; else if (this.speed > -maxS * .45) this.speed -= st.accel * .9 * dt * -thr; }
      else this.speed *= Math.pow(.45, dt);
      const sf = clamp(Math.abs(this.speed) / 5, 0, 1) * (1 - .3 * clamp(Math.abs(this.speed) / st.vitesse, 0, 1));
      this.yaw -= c.steer * st.maniement * sf * dt * (this.speed < -.5 ? -1 : 1);
    } else this.yaw -= c.steer * .8 * dt;
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    const grip = this.onGround ? st.grip * (c.brake ? .45 : 1) : .25, k = 1 - Math.exp(-grip * dt);
    this.vx += (fx * this.speed - this.vx) * k; this.vz += (fz * this.speed - this.vz) * k;
    this.pos.x += this.vx * dt; this.pos.z += this.vz * dt;
    let g = groundAt(this.pos.x, this.pos.z, this.pos.y, this.step);
    if (this.onGround) { if (g < this.pos.y - .3) this.onGround = false; else { this.vy = clamp((g - this.pos.y) / Math.max(dt, .008), -5, 14); this.pos.y = g; } }
    if (!this.onGround) { this.vy -= (this.st.vol ? 10 : 30) * dt; this.pos.y += this.vy * dt; g = groundAt(this.pos.x, this.pos.z, this.pos.y, this.step); if (this.pos.y <= g) { if (this.vy < -16 && AUTH()) damage(this, (-this.vy - 16) * .8, null); if (this.vy < -8) { fxSparks(this.pos.x, this.pos.y + .3, this.pos.z, 6, 0xcccccc); if (this.local) SFX.hit(.6); } this.pos.y = g; this.vy = 0; this.onGround = true; } }
    this.collideBlocks();
    this.pos.x = clamp(this.pos.x, -A + 1, A - 1); this.pos.z = clamp(this.pos.z, -A + 1, A - 1);
  }
  collideBlocks() {
    const r = this.st.rayon; let x = this.pos.x, z = this.pos.z;
    for (const b of blocks) {
      if (x < b.x0 - r || x > b.x1 + r || z < b.z0 - r || z > b.z1 + r) continue;
      const s = surf(b, clamp(x, b.x0, b.x1), clamp(z, b.z0, b.z1)); if (s <= this.pos.y + this.step) continue;
      const pl = x - (b.x0 - r), pr = (b.x1 + r) - x, pb = z - (b.z0 - r), pf = (b.z1 + r) - z, m = Math.min(pl, pr, pb, pf);
      let nx = 0, nz = 0; if (m === pl) { x = b.x0 - r; nx = -1; } else if (m === pr) { x = b.x1 + r; nx = 1; } else if (m === pb) { z = b.z0 - r; nz = -1; } else { z = b.z1 + r; nz = 1; }
      const vn = this.vx * nx + this.vz * nz;
      if (vn < 0) { this.vx -= vn * nx * 1.4; this.vz -= vn * nz * 1.4; const imp = -vn; const [fx, fz] = this.fwd(); this.speed = (this.vx * fx + this.vz * fz) * .6;
        if (imp > 8) { fxSparks(x - nx * r, this.pos.y + .6, z - nz * r, 6); if (this.local) { SFX.hit(.8); camShake.v = Math.max(camShake.v, .25); } }
        if (imp > 17 && AUTH()) damage(this, (imp - 17) * .7, null); }
    }
    this.pos.x = x; this.pos.z = z;
  }
  syncMesh(dt) {
    const m = this.mesh; m.position.copy(this.pos);
    const pitch = this.onGround ? clamp(-this.vy * .045, -.4, .4) : clamp(-this.vy * .03, -.5, .5);
    m.rotation.set(pitch + (this.alive ? 0 : .15), this.yaw, this.alive ? clamp(-this.ctrl.steer * this.speed * .004, -.12, .12) : .3);
    for (const w of this.wheels) w.rotation.x += this.speed * dt / .5;
    const an = this.anim; this.ph += this.speed * dt * 1.6;
    if (an.legs) { if (an.pedal) { an.legs[0].rotation.x = -1.2 + Math.sin(this.ph) * .5; an.legs[1].rotation.x = -1.2 - Math.sin(this.ph) * .5; }
      else if (an.skate) { const k = clamp(Math.abs(this.speed) / 10, 0, 1); an.legs[0].rotation.x = Math.sin(this.ph * .5) * .5 * k; an.legs[1].rotation.x = -Math.sin(this.ph * .5) * .5 * k; an.legs[0].rotation.z = -.15 * k; an.legs[1].rotation.z = .15 * k; } }
    if (this.st.rider) m.rotation.z = this.alive ? clamp(-this.ctrl.steer * this.speed * .02, -.45, .45) : 1.3;
    if (an.hov) an.hov.position.y = 1.0 + Math.sin(performance.now() / 300 + this.id) * .15;
    if (this.spinT > 0) { this.spinT -= dt; m.rotation.y += (1 - this.spinT / .6) * Math.PI * 2; }
    if (!AUTH()) { for (const k of ['flameT', 'chargeT', 'nitroT', 'shieldT', 'cloakT']) if (this[k] > 0) this[k] -= dt; }
    m.visible = !(this.cloakT > 0 && this !== G.me && this.alive) || Math.random() < .04;
    if (this.cloakT > 0 && this === G.me) m.visible = Math.floor(performance.now() / 120) % 2 === 0;
    if (this.shieldT > 0 && this.alive) { if (!this.bubble) { this.bubble = new THREE.Mesh(new THREE.SphereGeometry(this.st.rayon * 1.5, 16, 12), new THREE.MeshBasicMaterial({ color: 0x5ff0ff, transparent: true, opacity: .28, depthWrite: false })); this.bubble.position.y = 1; this.mesh.add(this.bubble); } this.bubble.visible = true; this.bubble.material.opacity = .2 + Math.sin(performance.now() / 90) * .08; } else if (this.bubble) this.bubble.visible = false;
    if (this.flameT > 0 && this.alive) { const [fx, fz] = this.fwd(); for (let i = 0; i < 4; i++) { const a = this.yaw + rand(-.35, .35), sp = rand(14, 22); spawnP(this.pos.x + fx * (this.st.rayon + 1), this.pos.y + 1, this.pos.z + fz * (this.st.rayon + 1), Math.sin(a) * sp + this.vx, rand(0, 2), Math.cos(a) * sp + this.vz, .6, rand(.4, .8), pick(FIRE), -2); } }
    if ((this.nitroT > 0 || this.chargeT > 0) && this.alive && Math.random() < dt * 50) { const [fx, fz] = this.fwd(); spawnP(this.pos.x - fx * 2, this.pos.y + .6, this.pos.z - fz * 2, -fx * 8, rand(0, 1), -fz * 8, .35, .45, pick(this.chargeT > 0 ? FIRE : this.trail)); }
    this.shadow.visible = this.onGround && !renderer.shadowMap.enabled;
    if (this.hp < this.minHp) this.minHp = this.hp;
    if (!this.alive) return;
    if (this.hp < this.maxHp * .4 && Math.random() < dt * 14) spawnP(this.pos.x + rand(-.5, .5), this.pos.y + 1.6, this.pos.z + rand(-.5, .5), rand(-.5, .5), rand(2, 4), rand(-.5, .5), 1.2, rand(.5, .9), this.hp < this.maxHp * .2 ? 0x222222 : 0x777777, -1);
    if (this.burn > 0 && Math.random() < dt * 30) spawnP(this.pos.x + rand(-1, 1), this.pos.y + 1.2, this.pos.z + rand(-1, 1), 0, rand(2, 5), 0, .5, rand(.3, .6), pick(FIRE), -2);
    if (this.turboOn && Math.random() < dt * 40) { const [fx, fz] = this.fwd(); spawnP(this.pos.x - fx * 2.4, this.pos.y + .6, this.pos.z - fz * 2.4, -fx * 6, rand(0, 1), -fz * 6, .3, .35, pick(this.trail)); }
  }
  muzzle() { const [fx, fz] = this.fwd(); this.side = -this.side; const s = this.side * .5; return new THREE.Vector3(this.pos.x + fx * (this.st.rayon + 1) + fz * s, this.pos.y + 1.2, this.pos.z + fz * (this.st.rayon + 1) - fx * s); }
}
function wreck(c) {
  c.mesh.traverse(o => { if (o.isMesh && o !== c.shadow && o !== c.bubble && o.material !== MAT_PNEU) { if (!o.userData.m0) o.userData.m0 = o.material; o.material = MAT_CALCINE; } });
}
function unwreck(c) { c.mesh.traverse(o => { if (o.isMesh && o.userData.m0) o.material = o.userData.m0; }); }
function respawn(c) {
  let best = null, bd = -1; for (let i = 0; i < 10; i++) { const [x, z, yaw] = spawnPoint(Math.random() * 10 | 0, 10); let md = 1e9; for (const o of G.cars) if (o !== c && o.alive) md = Math.min(md, Math.hypot(o.pos.x - x, o.pos.z - z)); if (md > bd) { bd = md; best = [x, z, yaw]; } }
  c.pos.set(best[0], groundAt(best[0], best[1], 0), best[1]); c.yaw = best[2]; c.vx = c.vz = c.vy = c.speed = 0; c.onGround = true;
  c.hp = c.maxHp; c.sh = c.shMax; c.shT = 0; c.minHpLife = c.maxHp; c.alive = true; c.burn = 0; c.turbo = 100; c.specCd = Math.min(c.specCd, 2); c.flameT = c.chargeT = c.nitroT = c.cloakT = 0; c.shieldT = 2; c.lastAtk = null;
  unwreck(c); emit({ e: 'resp', c: c.id }); if (c === G.me) { centreMsg(L.go, '', .6); G.deadMsg = 0; }
}
function findFree(x, z, r) {
  for (let k = 0; k < 12; k++) { let bad = false; for (const b of blocks) { if (x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r) { bad = true; break; } } if (!bad) return [x, z]; x *= .9; z *= .9; x += rand(-2, 2); z += rand(-2, 2); }
  return [x, z];
}

/* ================== Armes & dégâts (autorité : solo/hôte) ================== */
function alive() { return G.cars.filter(c => c.alive); }
function los(a, b) {
  const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), n = Math.ceil(d / 2.5);
  for (let i = 1; i < n; i++) { const t = i / n; if (solidAt(a.x + dx * t, a.z + dz * t, a.y + 1.2 + (b.y - a.y) * t)) return false; } return true;
}
function bestTarget(c, range, cone) {
  let best = null, bs = 1e9; const [fx, fz] = c.fwd();
  for (const o of G.cars) { if (o === c || !o.alive || o.cloakT > 0 || (G.teams && o.team === c.team)) continue; const dx = o.pos.x - c.pos.x, dz = o.pos.z - c.pos.z, d = Math.hypot(dx, dz); if (d > range) continue;
    const ca = (dx * fx + dz * fz) / (d || 1); const ang = Math.acos(clamp(ca, -1, 1)); if (ang > cone) continue; const s = d * (1 + ang * 2); if (s < bs && los(c.pos, o.pos)) { bs = s; best = o; } }
  return best;
}
const tv = new THREE.Vector3();
function fireMG(c) {
  const a = c.lo.arme, mp = c.muzzle(); let tgt = c.local || c.peer ? bestTarget(c, 55, .22) : (c.ai.target && c.ai.aim ? c.ai.target : null);
  const [fx, fz] = c.fwd(); let dir;
  if (tgt) { dir = tv.set(tgt.pos.x - mp.x + tgt.vx * .08, tgt.pos.y + .9 - mp.y, tgt.pos.z - mp.z + tgt.vz * .08).normalize().clone(); }
  else dir = new THREE.Vector3(fx, 0, fz);
  const spr = a.disp + (c.bot ? (1 - c.ai.k) * .08 : 0);
  for (let i = 0; i < a.balles; i++) { const d = dir.clone(); d.x += rand(-spr, spr); d.y += rand(-spr, spr) * .5; d.z += rand(-spr, spr); d.normalize();
    spawnBullet(c, mp, d.multiplyScalar(a.vit).add(tv.set(c.vx, 0, c.vz)), a.dmg * c.dmgMul, a.vie, false, a.laser ? 2 : a.gros ? 1 : 0); }
  if (G.me) { const dd = Math.hypot(G.me.pos.x - c.pos.x, G.me.pos.z - c.pos.z); const v = c === G.me ? .8 : clamp(1 - dd / 50, 0, .5); if (c !== G.me) { if (G.t - (c.indT || -9) > .35) { c.indT = G.t; soundInd(c.pos.x, c.pos.z, a.gros ? 1 : .7); } } if (v > 0) { const f = () => a.gros || a.balles > 1 ? SFX.canon(v) : SFX.mg(v, a.laser); c === G.me ? f() : SFX.at(c.pos.x, c.pos.y + 1, c.pos.z, f); } }
}
function fakeMG(c, dt) { // tirs visuels côté client
  c.fakeCd -= dt; if (!c.firing || c.fakeCd > 0) return; const a = c.lo.arme; c.fakeCd = 1 / a.cad; const mp = c.muzzle(); const [fx, fz] = c.fwd();
  for (let i = 0; i < a.balles; i++) { const d = new THREE.Vector3(fx + rand(-a.disp, a.disp), 0, fz + rand(-a.disp, a.disp)).normalize(); spawnBullet(c, mp, d.multiplyScalar(a.vit).add(tv.set(c.vx, 0, c.vz)), 0, a.vie, true, a.laser ? 2 : a.gros ? 1 : 0); }
  if (G.me) { const dd = Math.hypot(G.me.pos.x - c.pos.x, G.me.pos.z - c.pos.z); const v = c === G.me ? .8 : clamp(1 - dd / 50, 0, .5); if (c !== G.me) { if (G.t - (c.indT || -9) > .35) { c.indT = G.t; soundInd(c.pos.x, c.pos.z, a.gros ? 1 : .7); } } if (v > 0) { const f = () => a.gros || a.balles > 1 ? SFX.canon(v) : SFX.mg(v, a.laser); c === G.me ? f() : SFX.at(c.pos.x, c.pos.y + 1, c.pos.z, f); } }
}
function updBullets(dt) {
  for (let i = 0; i < BMAX; i++) {
    const b = bullets[i];
    if (b.on) {
      b.life -= dt; b.p.addScaledVector(b.v, dt);
      if (b.life <= 0) b.on = false;
      else if (solidAt(b.p.x, b.p.z, b.p.y) || b.p.y < 0) { b.on = false; fxSparks(b.p.x, b.p.y, b.p.z, 3); }
      else {
        for (const c of G.cars) { if (c === b.owner || !c.alive) continue; const dx = c.pos.x - b.p.x, dz = c.pos.z - b.p.z, r = c.st.rayon + .4;
          if (dx * dx + dz * dz < r * r && b.p.y > c.pos.y - .2 && b.p.y < c.pos.y + 2.6) { b.on = false; fxSparks(b.p.x, b.p.y, b.p.z, 3, 0xffb03a); if (!b.fake && AUTH()) damage(c, b.dmg, b.owner); break; } }
        if (b.on) for (const p of props) { if (!p.on) continue; const dx = p.x - b.p.x, dz = p.z - b.p.z; if (dx * dx + dz * dz < p.r * p.r && b.p.y < p.y + 1.6) { b.on = false; fxSparks(b.p.x, b.p.y, b.p.z, 2); if (!b.fake && AUTH()) hitProp(p, b.dmg, b.owner); break; } }
      }
      dummy.position.copy(b.p); tv.copy(b.p).add(b.v); dummy.lookAt(tv); dummy.scale.set(b.sz, b.sz, b.sz === .35 ? 1.2 : 1.6);
    } else { dummy.position.set(0, -50, 0); dummy.scale.setScalar(0); }
    dummy.updateMatrix(); bMesh.setMatrixAt(i, dummy.matrix);
  }
  bMesh.instanceMatrix.needsUpdate = true;
}
function hitProp(p, dmg, owner) { p.hp -= dmg; if (p.hp <= 0) breakProp(p, owner); }
function breakProp(p, owner) {
  if (!p.on) return; p.on = false; p.m.visible = false; emit({ e: 'prop', i: p.i });
  if (p.baril) explosion(p.x, p.y, p.z, 6, 28, owner, { prop: 1 });
  else { for (let i = 0; i < 12; i++) spawnP(p.x, p.y + .8, p.z, rand(-6, 6), rand(3, 9), rand(-6, 6), 1, .4, 0x9c6b3a, 20); emit({ e: 'deb', x: p.x, y: p.y, z: p.z }); }
}
function fxPropBreak(i) { const p = props[i]; if (!p || !p.on) return; p.on = false; p.m.visible = false; if (!p.baril) for (let k = 0; k < 12; k++) spawnP(p.x, p.y + .8, p.z, rand(-6, 6), rand(3, 9), rand(-6, 6), 1, .4, 0x9c6b3a, 20); }
function explosion(x, y, z, r, dmg, owner, o = {}) {
  fxBoom(x, y, z, r * .55, r > 5); emit({ e: 'boom', x: +x.toFixed(1), y: +y.toFixed(1), z: +z.toFixed(1), r });
  for (const c of G.cars) { if (!c.alive || (o.noSelf && c === owner)) continue; const d = Math.hypot(c.pos.x - x, c.pos.z - z, (c.pos.y + 1) - y); if (d > r + c.st.rayon) continue;
    const f = clamp(1 - .55 * d / r, .3, 1); damage(c, dmg * f, owner); const k = 10 * f / c.st.masse; const nx = (c.pos.x - x) / (d || 1), nz = (c.pos.z - z) / (d || 1); c.vx += nx * k; c.vz += nz * k; if (r > 5 && c.onGround) { c.vy = 7 * f / c.st.masse; c.onGround = false; c.pos.y += .05; } if (o.burn) c.burn = Math.max(c.burn, o.burn); }
  for (const p of props) if (p.on && Math.hypot(p.x - x, p.z - z) < r) setTimeout(() => breakProp(p, owner), 80);
}
function damage(c, amt, atk) {
  if (!c.alive || G.ended || amt <= 0) return;
  if (G.teams && atk && atk !== c && atk.team === c.team) return;
  if (c.shieldT > 0) amt *= .15; if (c.nitroT > 0) amt *= .6;
  if (atk && atk !== c) { c.lastAtk = atk; c.lastAtkT = G.t; atk.dmgDone += amt; }
  c.shT = 3.5; c.hitT = .15;
  if (c.sh > 0) { const a = Math.min(c.sh, amt); c.sh -= a; amt -= a; c.shHitT = .2; if (c === G.me && a > 0) flashShield(); }
  c.hp -= amt; if (amt > 0 && atk && atk !== c && c === G.me) flashDmg();
  if (c.hp <= 0) killCar(c, atk && atk !== c ? atk : (c.lastAtk && G.t - c.lastAtkT < 6 ? c.lastAtk : null));
}
function killCar(c, k) {
  c.alive = false; c.hp = 0; c.deadT = G.t; c.deathN = ++G.deathN;
  c.deaths++; c.respawnT = 3.5; c.w.mega = 0;
  if (k) k.kills++;
  if (k && k.bot && Math.random() < .45) netEmote(k, pick(['cool', 'laugh', 'party', 'smirk', 'tongue', 'kiss'])); else if (c.bot && Math.random() < .25) netEmote(c, pick(['huff', 'rage', 'scream']));
  explosion(c.pos.x, c.pos.y + .5, c.pos.z, 7, 20, c, { noSelf: 1 });
  c.vy = 10; c.onGround = false; wreck(c);
  emit({ e: 'kill', v: c.id, k: k ? k.id : -1 });
  feedKill(c, k);
  checkEnd();
}
function applyPickup(c, p) {
  const t = p.t;
  const R = Math.max(0, p.r | 0);
  if (t === 'sante') { if (c.hp >= c.maxHp) return false; c.hp = Math.min(c.maxHp, c.hp + c.maxHp * PK_AMT.sante[R]); c.burn = 0; }
  else if (t === 'bouc') { if (c.sh >= c.shMax) return false; c.sh = Math.min(c.shMax, c.sh + c.shMax * PK_AMT.bouc[R]); }
  else if (t === 'over') { const tgt = c.shMax * PK_AMT.over[R]; if (c.sh >= tgt) return false; c.sh = tgt; c.shT = 6; }
  else if (t === 'turbo') { c.turbo = 100; }
  else if (t === 'mega') { if (c.w.mega >= 1) return false; c.w.mega = 1; c.sel = 'mega'; }
  else { if (c.w[t] >= 9) return false; c.w[t] = Math.min(9, c.w[t] + PICK[t].n + (c.lo.ammo | 0)); if (!c.sel || !c.w[c.sel]) c.sel = t; }
  p.on = false; p.cd = p.mega ? 25 : 12; p.g.visible = false; emit({ e: 'pk', i: p.i, c: c.id });
  if (c === G.me) { SFX.pick(); toastPk(t, p.r); }
  return true;
}
function updPickups(dt) {
  for (const p of pickups) {
    if (!p.on) { if (AUTH() && (!p.mega || G.alert)) { p.cd -= dt; if (p.cd <= 0) { p.on = true; p.g.visible = true; } } continue; }
    if (p.mega) { const hc = tmpC.setHSL((G.t * .5 + p.i * .1) % 1, 1, .6); p.core.material.color.copy(hc); p.beam.material.color.copy(hc); p.core.scale.setScalar(1 + Math.sin(G.t * 6) * .15); }
    p.g.rotation.y += dt * 2; p.g.position.y = p.y + 1 + Math.sin(G.t * 3 + p.i) * .2;
    if (!AUTH() || G.mode !== 'play') continue;
    for (const c of G.cars) if (c.alive && Math.abs(c.pos.x - p.x) < 2.4 && Math.abs(c.pos.z - p.z) < 2.4 && Math.abs(c.pos.y - p.y) < 2) { if (applyPickup(c, p)) break; }
  }
}
function cycleWeapon(c) { const i = c.sel ? WPK.indexOf(c.sel) : -1; for (let k = 1; k <= WPK.length; k++) { const t = WPK[(i + k) % WPK.length]; if (c.w[t] > 0) { c.sel = t; return; } } c.sel = null; }
const projGeo = { missile: new THREE.CylinderGeometry(.16, .16, 1.1, 8).rotateX(Math.PI / 2), torp: new THREE.CapsuleGeometry(.35, 1.4, 4, 8).rotateX(Math.PI / 2), mine: new THREE.CylinderGeometry(.6, .7, .3, 10), napalm: new THREE.SphereGeometry(.5, 10, 8) };
const projMat = { egg: lam(0xfff8e7), mortar: new THREE.MeshBasicMaterial({ color: 0xff6a1f }), sting: new THREE.MeshBasicMaterial({ color: 0xffe066 }), bomb: lam(0x222222), missile: new THREE.MeshBasicMaterial({ color: 0x9fd8ff }), feu: new THREE.MeshBasicMaterial({ color: 0xff6a1f }), torpille: lam(0x7d8b99), frenesie: new THREE.MeshBasicMaterial({ color: 0xff3b6b }), mine: new THREE.MeshBasicMaterial({ color: 0xd62828 }), napalm: new THREE.MeshBasicMaterial({ color: 0xffa21f }) };
function projMesh(k) {
  const g = k === 'torpille' ? projGeo.torp : k === 'mine' ? projGeo.mine : k === 'napalm' || k === 'mortar' || k === 'bomb' || k === 'egg' ? projGeo.napalm : projGeo.missile;
  const m = new THREE.Mesh(g, projMat[k]); if (k === 'egg') m.scale.set(1, 1.35, 1); if (k === 'mortar') m.scale.setScalar(1.5); if (k === 'torpille') { const f = new THREE.Mesh(finGeo(.6, .8), projMat.torpille); f.position.y = .2; m.add(f); } scene.add(m); return m;
}
const PJ = { egg: { dmg: 30, r: 4.5, life: 40 }, mortar: { v: 26, dmg: 65, r: 9, life: 5, burn: 3 }, sting: { v: 85, turn: 0, dmg: 16, r: 3, life: 2 }, bomb: { dmg: 35, r: 6, life: 4 }, missile: { v: 48, turn: 2.6, dmg: 22, r: 4, life: 4 }, feu: { v: 75, turn: 0, dmg: 30, r: 4, life: 2.5, burn: 2.5 }, torpille: { v: 36, turn: 1.6, dmg: 55, r: 6.5, life: 6 }, frenesie: { v: 52, turn: 1.3, dmg: 12, r: 3, life: 3 }, napalm: { v: 30, dmg: 40, r: 7.5, life: 4, burn: 3 }, mine: { dmg: 35, r: 4.5, life: 40 } };
function launch(c, k, angOff = 0, tgt) {
  const P = PJ[k]; const [fx0, fz0] = c.fwd(); const a = c.yaw + angOff, fx = Math.sin(a), fz = Math.cos(a);
  const p = { id: G.projId++, k, owner: c, p: new THREE.Vector3(c.pos.x + fx0 * (c.st.rayon + 1.2), c.pos.y + 1.4, c.pos.z + fz0 * (c.st.rayon + 1.2)), v: new THREE.Vector3(), life: P.life, tgt: tgt || null, arm: 0 };
  const pkBonus = (k === 'missile' || k === 'feu' || k === 'mine' || k === 'napalm') && !c.specLaunch ? 1 + c.lo.dmgPk / 100 : 1;
  p.dmg = P.dmg * pkBonus * c.dmgMul;
  if (k === 'mine' || k === 'egg') { p.p.set(c.pos.x - fx0 * (c.st.rayon + 1.5), c.pos.y + .15, c.pos.z - fz0 * (c.st.rayon + 1.5)); p.arm = .7; }
  else if (k === 'napalm' || k === 'mortar') { p.v.set(fx * P.v + c.vx * .6, k === 'mortar' ? 15 : 12, fz * P.v + c.vz * .6); }
  else if (k === 'bomb') { }
  else { p.v.set(fx, 0, fz).multiplyScalar(P.v); if (k === 'feu') { const t = bestTarget(c, 80, .3); if (t) p.v.set(t.pos.x - p.p.x, t.pos.y + 1 - p.p.y, t.pos.z - p.p.z).normalize().multiplyScalar(P.v); } }
  p.mesh = projMesh(k); p.mesh.position.copy(p.p);
  G.proj.push(p);
  if (G.me) { const d = Math.hypot(G.me.pos.x - c.pos.x, G.me.pos.z - c.pos.z); if (d < 60) SFX.at(c.pos.x, c.pos.y + 1, c.pos.z, () => SFX.missile(clamp(1 - d / 60, .2, 1))); if (c !== G.me) soundInd(c.pos.x, c.pos.z, .8); }
  return p;
}
function useWeapon(c) {
  if (!c.sel || !c.w[c.sel]) { cycleWeapon(c); if (!c.sel) return; }
  const k = c.sel; c.w[k]--;
  if (k === 'mega') megaAttack(c);
  else if (k === 'missile') launch(c, 'missile', 0, bestTarget(c, 90, .9));
  else launch(c, k);
  if (!c.w[k]) cycleWeapon(c);
}
function shockwave(c, R, dmg, kb) {
  fxRing(c.pos.x, c.pos.y, c.pos.z, R); SFX.onde(); emit({ e: 'ring', c: c.id, r: R });
  for (const o of G.cars) { if (o === c || !o.alive) continue; const dx = o.pos.x - c.pos.x, dz = o.pos.z - c.pos.z, d = Math.hypot(dx, dz) || 1; if (d > R) continue; const f = 1 - .5 * d / R;
    damage(o, dmg * f * c.dmgMul, c); o.vx += dx / d * kb * f / o.st.masse; o.vz += dz / d * kb * f / o.st.masse; o.vy = 8 * f; o.onGround = false; o.pos.y += .05; o.speed *= .2; }
  for (const p of props) if (p.on && Math.hypot(p.x - c.pos.x, p.z - c.pos.z) < R) breakProp(p, c);
}
function nearestEnemy(c, range, excl) { let best = null, bd = range; for (const o of G.cars) { if (o === c || o === excl || !o.alive || o.cloakT > 0 || (G.teams && o.team === c.team)) continue; const d = c.pos.distanceTo(o.pos); if (d < bd && los(c.pos, o.pos)) { bd = d; best = o; } } return best; }
function useSpecial(c) {
  if (c.specCd > 0) return; c.specCd = c.specMax; const sp = c.st.special, id = sp.id;
  if (id === 'zap') { const t = nearestEnemy(c, 46); if (!t) { c.specCd = .5; return; } fxZap(c.pos, t.pos); emit({ e: 'zap', a: c.id, b: t.id }); damage(t, 35 * c.dmgMul, c); t.speed *= .3;
    const t2 = nearestEnemy(t, 22, c); if (t2) { fxZap(t.pos, t2.pos); emit({ e: 'zap', a: t.id, b: t2.id }); damage(t2, 20 * c.dmgMul, c); } }
  else if (id === 'beam') { const t = bestTarget(c, 75, .18); const [fx, fz] = c.fwd(); const end = t ? t.pos.clone() : new THREE.Vector3(c.pos.x + fx * 60, c.pos.y, c.pos.z + fz * 60);
    fxBeam(c.pos, end, 0x5fd0ff); emit({ e: 'beam', a: c.id, x: r2(end.x), y: r2(end.y), z: r2(end.z) }); if (t) { damage(t, 50 * c.dmgMul, c); t.vx += fx * 10; t.vz += fz * 10; } }
  else if (id === 'jack') shockwave(c, 18, 45, 28);
  else if (id === 'bell') shockwave(c, 10, 25, 30);
  else if (id === 'spin') { shockwave(c, 7.5, 30, 22); c.spinT = .6; }
  else if (id === 'frenzy') { const t = bestTarget(c, 90, 1.2); for (let i = 0; i < 8; i++) launch(c, 'frenesie', -.6 + i * 1.2 / 7, t); }
  else if (id === 'rockets') { const t = bestTarget(c, 90, 1.0); for (const o of [-.15, .15]) { const p = launch(c, 'missile', o, t); p.dmg = 26 * c.dmgMul; } }
  else if (id === 'sting') { const t = bestTarget(c, 70, .3); for (const o of [-.05, 0, .05]) { const p = launch(c, 'sting', o); if (t) p.v.set(t.pos.x - p.p.x, t.pos.y + 1 - p.p.y, t.pos.z - p.p.z).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), o).multiplyScalar(PJ.sting.v); } }
  else if (id === 'eggs') { for (let i = 0; i < 3; i++) { const p = launch(c, 'egg'); const [fx, fz] = c.fwd(); p.p.x -= fx * i * 1.8; p.p.z -= fz * i * 1.8; p.p.x += rand(-.6, .6); } }
  else if (id === 'mortar') launch(c, 'mortar');
  else if (id === 'bombs') { const [fx, fz] = c.fwd(); for (let i = 0; i < 3; i++) { const p = launch(c, 'bomb'); p.p.set(c.pos.x + fx * (3 + i * 5), c.pos.y + 3.5 + i * .8, c.pos.z + fz * (3 + i * 5)); p.v.set(c.vx * .5, -2, c.vz * .5); } }
  else if (id === 'flame') c.flameT = 1.4;
  else if (id === 'charge') { c.chargeT = 1.3; c.speed = c.maxS * 1.9; c.hitCharge = false; }
  else if (id === 'nitro') { c.nitroT = 4; c.turbo = 100; }
  else if (id === 'shield') c.shieldT = 5;
  else if (id === 'cloak') c.cloakT = 4;
  if (c === G.me && ['flame', 'charge', 'nitro', 'shield', 'cloak'].includes(id)) SFX.missile(1);
}
const SPEC_AI = { zap: { r: 40, los: 1 }, beam: { r: 60, cone: .15, los: 1 }, jack: { r: 15 }, bell: { r: 8 }, spin: { r: 6.5 }, frenzy: { r: 60, cone: .5, los: 1 }, rockets: { r: 70, cone: .9, los: 1 }, sting: { r: 55, cone: .25, los: 1 },
  eggs: { r: 25, back: 1 }, mortar: { r: 40, cone: .25 }, bombs: { r: 18, cone: .4 }, flame: { r: 12, cone: .4 }, charge: { r: 30, cone: .2 }, nitro: { r: 999, far: 35 }, shield: { hurt: 1 }, cloak: { hurt: 1 } };
function aiWantsSpecial(c, d, ang) {
  const a = SPEC_AI[c.st.special.id]; if (!a) return false;
  if (a.hurt) return c.hp < c.maxHp * .6 && G.t - c.lastAtkT < 2;
  if (a.far) return d > a.far || (c.hp < c.maxHp * .4 && G.t - c.lastAtkT < 2);
  if (d > a.r) return false; if (a.cone && ang > a.cone) return false; if (a.back && ang < 2.3) return false; if (a.los && !c.ai.los) return false; return true;
}
function updProj(dt) {
  for (let i = G.proj.length - 1; i >= 0; i--) {
    const p = G.proj[i]; const P = PJ[p.k];
    if (!AUTH()) { p.p.addScaledVector(p.v, dt); if (GRAV[p.k]) p.v.y -= 30 * dt; p.mesh.position.copy(p.p); if (p.k !== 'mine' && p.k !== 'egg') { tv.copy(p.p).add(p.v); p.mesh.lookAt(tv); if (Math.random() < .7) spawnP(p.p.x, p.p.y, p.p.z, rand(-.5, .5), rand(0, 1), rand(-.5, .5), .5, .35, p.k === 'feu' || p.k === 'napalm' ? pick(FIRE) : 0xbbbbbb, -1); } continue; }
    p.life -= dt; let boom = p.life <= 0 && p.k !== 'mine' && p.k !== 'egg';
    if (p.k === 'mine' || p.k === 'egg') { p.arm -= dt; if (p.k === 'mine') p.mesh.material = (Math.floor(G.t * 4) % 2) ? projMat.mine : projMat.napalm;
      if (p.life <= 0) { removeProj(i); continue; }
      if (p.arm <= 0) for (const c of G.cars) if (c.alive && Math.hypot(c.pos.x - p.p.x, c.pos.z - p.p.z) < c.st.rayon + 1.6 && Math.abs(c.pos.y - p.p.y) < 1.5) { boom = true; break; } }
    else {
      if (p.tgt && p.tgt.alive && P.turn) { tv.set(p.tgt.pos.x - p.p.x, p.tgt.pos.y + 1 - p.p.y, p.tgt.pos.z - p.p.z).normalize().multiplyScalar(P.v); p.v.lerp(tv, clamp(P.turn * dt, 0, 1)).setLength(P.v); }
      if (GRAV[p.k]) p.v.y -= 30 * dt;
      p.p.addScaledVector(p.v, dt);
      if (Math.random() < .8) spawnP(p.p.x, p.p.y, p.p.z, rand(-.5, .5), rand(0, 1), rand(-.5, .5), .5, p.k === 'torpille' ? .6 : .35, p.k === 'feu' || p.k === 'napalm' || p.k === 'mortar' ? pick(FIRE) : 0xbbbbbb, -1);
      if (p.p.y < groundAt(p.p.x, p.p.z, p.p.y) + .1 || solidAt(p.p.x, p.p.z, p.p.y) || Math.abs(p.p.x) > A + 2 || Math.abs(p.p.z) > A + 2) boom = true;
      if (!boom) for (const c of G.cars) { if (c === p.owner || !c.alive) continue; const r = c.st.rayon + .6; if ((c.pos.x - p.p.x) ** 2 + (c.pos.z - p.p.z) ** 2 < r * r && p.p.y > c.pos.y - .3 && p.p.y < c.pos.y + 2.8) { boom = true; break; } }
      if (!boom) for (const q of props) if (q.on && Math.hypot(q.x - p.p.x, q.z - p.p.z) < q.r + .4 && p.p.y < q.y + 1.6) { boom = true; break; }
      tv.copy(p.p).add(p.v); p.mesh.lookAt(tv);
    }
    p.mesh.position.copy(p.p);
    if (boom) { explosion(p.p.x, p.p.y, p.p.z, P.r, p.dmg, p.owner, { burn: P.burn, noSelf: p.k !== 'napalm' && p.k !== 'mine' && p.k !== 'mortar' ? 1 : 0 }); if (p.k === 'napalm' || p.k === 'mortar') for (let k = 0; k < 30; k++) spawnP(p.p.x + rand(-5, 5), p.p.y + .3, p.p.z + rand(-5, 5), 0, rand(1, 4), 0, rand(1, 2), rand(.5, 1), pick(FIRE), -1); removeProj(i); }
  }
}
const GRAV = { napalm: 1, mortar: 1, bomb: 1 };
function removeProj(i) { const p = G.proj[i]; scene.remove(p.mesh); G.proj.splice(i, 1); }
function clearProj() { for (const p of G.proj) scene.remove(p.mesh); G.proj.length = 0; for (const b of bullets) b.on = false; }

/* ================== IA ================== */
function nearestPickup(c, pred, maxD) { let b = null, bd = maxD; for (const p of pickups) { if (!p.on || !pred(p.t)) continue; const d = Math.hypot(p.x - c.pos.x, p.z - c.pos.z) + Math.abs(p.y - c.pos.y) * 4; if (d < bd) { bd = d; b = p; } } return b; }
function aiThink(c, dt) {
  const ai = c.ai, ct = c.ctrl, k = ai.k; ai.t -= dt;
  if (ai.t <= 0) {
    ai.t = rand(.25, .5) * (1.6 - k);
    let best = null, bs = 1e9;
    for (const o of G.cars) { if (o === c || !o.alive || (G.teams && o.team === c.team) || (o.cloakT > 0 && c.pos.distanceTo(o.pos) > 6)) continue; let s = c.pos.distanceTo(o.pos); if (o.local || o.peer) s *= .75; if (o === c.lastAtk && G.t - c.lastAtkT < 4) s *= .5; if (o === ai.target) s *= .8; if (s < bs) { bs = s; best = o; } }
    ai.target = best; ai.goal = null;
    if (c.hp < c.maxHp * .4) ai.goal = nearestPickup(c, t => t === 'sante', 70);
    if (!ai.goal && G.alert && !c.w.mega) ai.goal = nearestPickup(c, t => t === 'mega', 60);
    if (!ai.goal && !WPK.some(t => c.w[t] > 0)) ai.goal = nearestPickup(c, t => WPK.includes(t), 30);
    if (!ai.goal && c.turbo < 30) ai.goal = nearestPickup(c, t => t === 'turbo', 18);
    ai.los = ai.target ? los(c.pos, ai.target.pos) : false;
    if (ai.target) { const t = ai.target, d = c.pos.distanceTo(t.pos), [fx, fz] = c.fwd(); const ang = Math.abs(angDiff(c.yaw, Math.atan2(t.pos.x - c.pos.x, t.pos.z - c.pos.z)));
      ai.aim = ai.los && d < 50 && ang < .35 + (1 - k) * .1;
      if (ai.los && Math.random() < .25 + k * .4) {
        if (c.w.mega && d < 20) { c.sel = 'mega'; useWeapon(c); }
        else if (c.w.missile && d < 70 && ang < .9) { c.sel = 'missile'; useWeapon(c); }
        else if (c.w.feu && d < 55 && ang < .25) { c.sel = 'feu'; useWeapon(c); }
        else if (c.w.napalm && d > 12 && d < 30 && ang < .25) { c.sel = 'napalm'; useWeapon(c); }
        else if (c.w.mine && d < 22 && ang > 2.4) { c.sel = 'mine'; useWeapon(c); }
      }
      if (c.specCd <= 0 && Math.random() < .3 + k * .5 && aiWantsSpecial(c, d, ang)) useSpecial(c);
    }
    if (!ai.target && (!ai.wander || Math.hypot(ai.wander[0] - c.pos.x, ai.wander[1] - c.pos.z) < 8)) ai.wander = [rand(-55, 55), rand(-55, 55)];
  }
  let dx, dz, dist;
  if (ai.goal && ai.goal.on) { dx = ai.goal.x - c.pos.x; dz = ai.goal.z - c.pos.z; }
  else if (ai.target && ai.target.alive) { const t = ai.target; dx = t.pos.x + t.vx * .4 - c.pos.x; dz = t.pos.z + t.vz * .4 - c.pos.z; }
  else if (ai.wander) { dx = ai.wander[0] - c.pos.x; dz = ai.wander[1] - c.pos.z; }
  else { dx = -c.pos.x; dz = -c.pos.z; }
  dist = Math.hypot(dx, dz);
  let want = Math.atan2(dx, dz);
  // évitement d'obstacles
  const probe = (a, d) => { const x = c.pos.x + Math.sin(a) * d, z = c.pos.z + Math.cos(a) * d; return solidAt(x, z, c.pos.y + STEP) || Math.abs(x) > A - 3 || Math.abs(z) > A - 3; };
  const look = 5 + Math.abs(c.speed) * .35;
  if (probe(c.yaw, look) || probe(want, Math.min(look, dist))) {
    const l = probe(c.yaw + .6, look) ? 1 : 0, r = probe(c.yaw - .6, look) ? 1 : 0;
    if (!l && (r || !ai.pref || ai.pref > 0)) { want = c.yaw + 1.1; ai.pref = 1; } else if (!r) { want = c.yaw - 1.1; ai.pref = -1; } else want = c.yaw + Math.PI;
  } else ai.pref = 0;
  const d = angDiff(c.yaw, want);
  ct.steer = clamp(-d * 2.2, -1, 1);
  ct.thr = 1 - Math.min(.55, Math.abs(d) / 2.5);
  if (!ai.goal && ai.target && dist < 9 && Math.abs(d) < .5 && c.st.masse < 1.5) ct.thr = .4;
  ct.brake = Math.abs(d) > 1.6 && c.speed > 18;
  ct.fire = !!ai.aim && Math.random() < .55 + k * .45;
  ct.turbo = c.turbo > 40 && Math.abs(d) < .2 && dist > 35 && k > .4;
  // coincé ?
  if (ai.rev > 0) { ai.rev -= dt; ct.thr = -1; ct.steer = -(ai.pref || 1); ct.brake = false; ct.turbo = false; }
  else if (Math.abs(c.speed) < 2.5 && ct.thr > .2 && c.onGround) { ai.stuck += dt; if (ai.stuck > 1) { ai.rev = rand(.8, 1.3); ai.stuck = 0; ai.pref = ai.pref || pick([-1, 1]); } }
  else ai.stuck = Math.max(0, ai.stuck - dt);
}

/* ================== Collisions véhicule-véhicule ================== */
function carCollisions() {
  const cs = G.cars;
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j]; if (Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
    const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, r = a.st.rayon + b.st.rayon, d2 = dx * dx + dz * dz; if (d2 >= r * r || d2 < 1e-6) continue;
    const d = Math.sqrt(d2), nx = dx / d, nz = dz / d, pen = r - d, ma = a.st.masse * (a.alive ? 1 : 3), mb = b.st.masse * (b.alive ? 1 : 3), ta = mb / (ma + mb), tb = ma / (ma + mb);
    if (G.net === 'client' && a !== G.me && b !== G.me) continue;
    a.pos.x -= nx * pen * ta; a.pos.z -= nz * pen * ta; b.pos.x += nx * pen * tb; b.pos.z += nz * pen * tb;
    const rv = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz; if (rv <= 0) continue;
    const imp = rv * 1.3; a.vx -= nx * imp * ta; a.vz -= nz * imp * ta; b.vx += nx * imp * tb; b.vz += nz * imp * tb;
    a.speed *= .7; b.speed *= .7;
    if (rv > 9) { fxSparks(a.pos.x + nx * a.st.rayon, a.pos.y + .8, a.pos.z + nz * a.st.rayon, 8); if (a === G.me || b === G.me) { SFX.hit(1); camShake.v = Math.max(camShake.v, .35); } }
    if (AUTH() && a.alive && b.alive) for (const [x, y] of [[a, b], [b, a]]) if (x.chargeT > 0 && !x.hitCharge) { x.hitCharge = true; x.chargeT = 0; damage(y, (x.st.special.dmg || 40) * x.dmgMul, x); y.vx += nx * (x === a ? 1 : -1) * 22 / y.st.masse; y.vz += nz * (x === a ? 1 : -1) * 22 / y.st.masse; y.vy = 7; y.onGround = false; y.pos.y += .05; fxBoom((a.pos.x + b.pos.x) / 2, a.pos.y, (a.pos.z + b.pos.z) / 2, 1.5, false); }
    if (rv > 12 && AUTH() && a.alive && b.alive) { const base = (rv - 12) * 1.4; damage(b, base * a.st.masse / b.st.masse, a); damage(a, base * b.st.masse / a.st.masse * .6, b); }
  }
}

/* ================== Partie ================== */
function clearCars() { for (const c of G.cars) { scene.remove(c.mesh); } G.cars = []; G.me = null; $('tags').innerHTML = ''; }
function spawnPoint(i, n) { const a = i / n * Math.PI * 2 + .35, r = 56; const [x, z] = findFree(Math.sin(a) * r, Math.cos(a) * r, 2.6); return [x, z, Math.atan2(-x, -z)]; }
function soloRoster() {
  let w = S.vague, nb = Math.min(7, 2 + w), k = Math.min(.95, .35 + w * .07), hpMul = Math.min(1.6, 1 + .06 * (w - 1)), dmgMul = Math.min(1.15, .6 + w * .06);
  if (S.ranked) { const t = tierOf(S.rp); nb = 5; k = Math.min(.95, .45 + t * .09); hpMul = 1 + t * .08; dmgMul = Math.min(1.15, .75 + t * .07); w = 2 + t * 2; }
  const r = [{ id: 0, nom: pseudo(), v: S.vehicule, sk: S.skin, lo: myLoadout(), local: true, tr: S.style.trail, ti: S.style.title, av: S.av, cl: S.clan }];
  const noms = [...BOT_NOMS].sort(() => Math.random() - .5);
  for (let i = 0; i < nb; i++) r.push({ id: i + 1, nom: noms[i], v: pick(VKEYS), col: BOT_COUL[i % BOT_COUL.length], bot: true, k, hpMul, dmgMul, lo: botLoadout(k), av: botAv(), cl: pick(BOT_CLANS) });
  return r;
}
function startMatch(roster, myId, net) {
  G.roster = roster; G.teams = roster.some(r => r.team === 0 || r.team === 1); D.on = false;
  clearCars(); clearProj(); makePickups(); makeProps(); hideShowcase();
  G.net = net || null; G.ended = false; G.t = 0; G.ev = []; G.nTotal = roster.length; G.ranked = net ? !!Net.ranked : !!S.ranked; G.lastSpecN = IN.specN; G.spect = null; G.res = null; G.deathN = 0; G.deadMsg = 0; G.mt = 0; G.megas = []; G.endWhy = ''; G.cine = null; G.slowT = 0; document.body.classList.remove('cine'); resetAlert();
  roster.forEach((r, i) => { const c = new Car(r); const [x, z, yaw] = spawnPoint(i, roster.length); c.pos.set(x, groundAt(x, z, 0), z); c.yaw = yaw; c.vx = c.vz = 0; G.cars.push(c); c.syncMesh(0); });
  G.me = G.cars.find(c => c.id === myId) || G.cars[0]; G.me.local = true; renderPortraits();
  G.cars.forEach(c => { if (c === G.me) return; const d = document.createElement('div'); d.className = 'tag' + (G.teams ? (c.team === G.me.team ? ' ally' : ' foe') : ''); d.innerHTML = `${c.titre && L.titles[c.titre] ? `<small>« ${L.titles[c.titre]} »</small><br>` : ''}<span>${c.clan ? `<i class="cl">[${esc(c.clan)}]</i> ` : ''}${esc(c.nom)}</span><div class="shbar"><i></i></div><div class="hbar"><i></i></div><b class="emo"></b>`; $('tags').appendChild(d); c.tag = d; c.tagBar = d.querySelector('.hbar i'); c.tagSh = d.querySelector('.shbar i'); c.tagEmo = d.querySelector('.emo'); });
  G.lastHp = null; G.screamed = 0; G.lastMega = 0; toggleWheel(false); emoSetup();
  G.mode = 'countdown'; G.cd = 3.2; G.lastCd = 4;
  $('hNom').textContent = G.me.nom + (S.style.title ? ' « ' + L.titles[S.style.title] + ' »' : '') + ' · ' + G.me.st.nom; $('iNiv').textContent = (G.ranked ? L.ranked + ' · ' : '') + (G.net ? L.online : G.ranked ? TIERS[tierOf(S.rp)].nom : L.wave + ' ' + S.vague) + ' · ' + (G.teams ? L.teamMatch + ' · ' + L.teamGoal(TEAM_GOAL) : L.killGoal(KILL_GOAL)); $('feed').innerHTML = '';
  showScreen(null); $('hud').classList.add('on'); camInit = true; G.endT = 0;
  if (!G.net) { S.parties++; save(); }
}
function checkEnd() {
  if (G.ended || !AUTH()) return;
  if (G.teams) { const tk = teamKills(), w = tk[0] >= TEAM_GOAL ? 0 : tk[1] >= TEAM_GOAL ? 1 : -1;
    if (w >= 0) { G.ended = true; G.endT = 2; G.endWhy = 'goal'; centreMsg('🏁', L.teamWin(teamName(w)), 2); emit({ e: 'endmsg', w: 'team', tm: w }); return; } }
  const lead = G.cars.reduce((a, c) => c.kills > a.kills ? c : a, G.cars[0]);
  if (!G.teams && lead.kills >= KILL_GOAL) { G.ended = true; G.endT = 2; G.endWhy = 'goal'; centreMsg('🏁', L.reachedGoal(lead.nom), 2); emit({ e: 'endmsg', w: 'goal', c: lead.id }); }
  else if (G.mt >= MATCH_TIME) { G.ended = true; G.endT = 2; G.endWhy = 'time'; centreMsg('⏱️', L.timeUp, 2); emit({ e: 'endmsg', w: 'time' }); }
}
function finishMatch() {
  let r = 1; for (const c of [...G.cars].sort((a, b) => b.kills - a.kills || a.deaths - b.deaths || b.dmgDone - a.dmgDone)) c.rank = r++;
  G.winTeam = -1; if (G.teams) { const tk = teamKills(); const top = G.cars.find(c => c.rank === 1); G.winTeam = tk[0] > tk[1] ? 0 : tk[1] > tk[0] ? 1 : top ? top.team : 0; }
  const res = G.cars.map(c => ({ id: c.id, nom: c.nom, rank: c.rank || 1, kills: c.kills, deaths: c.deaths, dmg: Math.round(c.dmgDone), peer: c.peer, bot: c.bot, av: c.av, cl: c.clan, team: c.team })).sort((a, b) => a.rank - b.rank);
  if (G.net === 'host') Net.broadcast({ t: 'end', wt: G.winTeam, res: res.map(r => ({ id: r.id, nom: r.nom, rank: r.rank, kills: r.kills, deaths: r.deaths, dmg: r.dmg, av: r.av, cl: r.cl, team: r.team })) });
  showResults(res);
}
function showResults(res) {
  G.mode = 'end'; SFX.engine(0, false);
  const mine = res.find(r => r.id === G.me.id) || { rank: res.length, kills: 0, dmg: 0 }; const N = res.length;
  const won = G.teams ? mine.team === G.winTeam : mine.rank === 1; G.lastRes = res;
  let xp = (won ? 150 + 15 * N : Math.max(15, Math.round(100 * (N - mine.rank) / Math.max(1, N - 1)))) + mine.kills * 35 + Math.round(mine.dmg / 10);
  if (!G.net && won) xp += S.vague * 10;
  const before = xpInfo().n; S.xp += xp; const after = xpInfo().n; S.niveau = after;
  S.kills += mine.kills; S.degats += mine.dmg; S.meilleursKills = Math.max(S.meilleursKills, mine.kills); if (mine.rank <= 3) S.podiums++;
  if (G.net) { S.enLigne++; S.parties++; }
  const loot = [];
  if (won || Math.random() < (mine.rank <= 3 ? .5 : .2)) loot.push(rollItem(won ? (G.net ? 1.5 : 1) + S.vague * .05 : 0));
  const lvlRewards = [];
  for (let n = before + 1; n <= after; n++) { const it = rollItem(1 + n / 8); loot.push(it); lvlRewards.push({ n, it, veh: VKEYS.filter(k => VEH[k].niv === n), skins: SKINS.filter(s => s.niv === n) }); }
  loot.forEach(addItem);
  const vagueAvant = S.vague;
  if (won && G.me.minHp >= G.me.maxHp) S.flawless++;
  let rpRow = '', tierMsg = '';
  if (G.ranked) { ensureRivals(); const t0 = tierOf(S.rp); let dl = Math.round((N + 1 - 2 * mine.rank) / Math.max(1, N - 1) * 30) + (won ? 10 : 0) + mine.kills * 2; if (dl < 0) dl = Math.round(dl * (0.5 + t0 * .15));
    S.rp = Math.max(0, S.rp + dl); S.rpMax = Math.max(S.rpMax, S.rp); S.rankedMatches++; if (won) S.rankedWins++;
    S.rivals.forEach(r => r.rp = Math.max(0, r.rp + Math.round(rand(-22, 28))));
    const t1 = tierOf(S.rp); if (t1 > t0) tierMsg = L.tierUp(TIERS[t1].nom); else if (t1 < t0) tierMsg = L.tierDown(TIERS[t1].nom);
    rpRow = `<span>${L.rankPts}</span><b>${dl >= 0 ? '+' : ''}${dl} → ${S.rp} ${TIERS[t1].ic}</b>`; }
  if (!G.net && !G.ranked) { if (won) { S.victoires++; S.vague++; S.meilleureVague = Math.max(S.meilleureVague, S.vague); } }
  else if (won) S.victoires++;
  if (!G.net && G.ranked && won) S.victoires++;
  const achs = checkAch();
  save();
  (won ? SFX.win : SFX.lose)();
  $('fTitre').textContent = G.teams ? (won ? L.teamWin(teamName(G.winTeam)) : L.teamLose(teamName(G.winTeam))) : won ? L.victory : mine.rank <= 3 ? L.place(mine.rank) : L.destroyed;
  $('bDraft').style.display = (!G.net || Net.role === 'host') && res.length >= 4 ? '' : 'none';
  $('fSous').textContent = (G.ranked ? L.ranked + ' · ' : '') + (G.net ? L.onlineMatch(N) : G.ranked ? TIERS[tierOf(S.rp)].nom : won ? L.waveCleared(vagueAvant) : L.waveLost(vagueAvant, mine.rank, N));
  $('fTbl').innerHTML = `<span>${L.rank}</span><b>${L.ord(mine.rank)} / ${N}</b><span>${L.kills}</span><b>${mine.kills}</b><span>${L.dmgDealt}</span><b>${mine.dmg}</b><span>${L.xpEarned}</span><b>+${xp}</b>${rpRow}`;
  $('fPodium').innerHTML = res.slice(0, 10).map(r => `<div class="${r.id === G.me.id ? 'moi' : ''} ${r.team === 0 ? 'tmA' : r.team === 1 ? 'tmB' : ''}"><b>${r.rank}</b><img class="pav" src="${avPortrait(r.av)}" alt=""> ${r.cl ? `<i class="cl">[${esc(r.cl)}]</i> ` : ''}${esc(r.nom)} <small>${r.kills} 💥 · ${r.deaths || 0} ☠️</small></div>`).join('');
  $('fLoot').innerHTML = (tierMsg ? `<div class="item r3"><span class="ic">${TIERS[tierOf(S.rp)].ic}</span><div><b>${tierMsg}</b></div></div>` : '') + achs.map(a => `<div class="item r3"><span class="ic">${a.ic}</span><div><b>${L.achUnlocked} ${L.ach[a.id][0]}</b><small>${L.reward}: ${rwType(a.rw)} « ${rwName(a.rw)} »${a.veh ? ' + ' + L.newVehicle + ' ' + VEH[a.veh].nom : ''}${a.av ? ' + ' + L.avReward + ' ' + L.avNames[a.av] : ''}</small></div></div>`).join('') + (loot.length ? `<div class="sub">${L.loot}</div>` + loot.map(itemHTML).join('') : '');
  if (achs.length) setTimeout(() => SFX.levelUp(), 300);
  const xi = xpInfo(); $('fXp').innerHTML = `${L.level} ${xi.n} <div class="hbar t"><i style="width:${xi.x / xi.need * 100}%"></i></div><small>${xi.x} / ${xi.need} XP</small>`;
  $('bSuivant').textContent = G.net ? L.backLobby : G.ranked ? L.play + ' (' + L.ranked + ')' : won ? L.nextWave : L.retry;
  $('hud').classList.remove('on');
  showScreen('sFin');
  if (lvlRewards.length) setTimeout(() => { if ($('sFin').classList.contains('on')) showLevelUp(lvlRewards); }, 600);
}
function vitalsBreak(v) {
  const lo = myLoadout(), hp = Math.round(v.blindage * (1 + lo.hp / 100)), sb = VSH(v), sh = sb + lo.sh, a = itemById(S.equip.arme), wr = a ? a.r : 0, ms = lo.sh - W_SH[wr];
  return `<div class="brk"><span class="bh">✚ ${L.health} <b>${hp}</b> = ${v.blindage} ${L.baseW} + ${lo.hp}% ${L.gearW} (${hp - v.blindage})</span><span class="bs">🔰 ${L.shield} <b>${sh}</b> = ${sb} ${L.baseW}${W_SH[wr] ? ` + ${W_SH[wr]} <i style="color:${RAR[wr].coul}">${RAR[wr].nom}</i> ${L.slotWeapon.toLowerCase()}` : ''}${ms ? ` + ${ms} mods` : ''}</span><small>${L.regenNote}</small></div>`;
}
function itemHTML(it) { const R = RAR[it.r]; return `<div class="item r${it.r}" data-u="${it.u}"><span class="ic">${itemIc(it)}</span><div><b>${esc(itemNom(it))}</b><small style="color:${R.coul}">${R.nom} · ${it.t === 'arme' ? L.gunType : L.modType}</small><small>${esc(itemDesc(it))}</small></div></div>`; }
function showLevelUp(list) {
  const last = list[list.length - 1]; SFX.levelUp();
  $('luNiv').textContent = last.n;
  $('luRec').innerHTML = list.map(l => itemHTML(l.it) + l.veh.map(k => `<div class="item r3"><span class="ic">🚗</span><div><b>${L.newVehicle} ${VEH[k].nom}</b><small>${esc(VEH[k].desc)}</small></div></div>`).join('') + l.skins.map(s => `<div class="item r2"><span class="ic">🎨</span><div><b>${L.newPaint} ${s.nom}</b><small>${L.pickInGarage}</small></div></div>`).join('')).join('');
  $('lvlUp').classList.add('on');
  for (let i = 0; i < 60; i++) { const e = document.createElement('i'); e.className = 'conf'; e.style.left = rand(0, 100) + '%'; e.style.background = pick(['#ffc21f', '#ff4d2e', '#2fa8ff', '#7ef29d', '#b06cff']); e.style.animationDelay = rand(0, .6) + 's'; e.style.animationDuration = rand(1.2, 2.2) + 's'; $('lvlUp').appendChild(e); setTimeout(() => e.remove(), 3000); }
}

/* ================== Caméra ================== */
let camInit = true; const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(); let camYaw = 0;
function updCamera(dt) {
  if (G.mode === 'menu' || G.mode === 'garage' || G.mode === 'draft' || !G.me) {
    const t = performance.now() / 1000;
    if (G.mode === 'garage') { const k = showcase ? showcase.userData.k : 1; const asp = Math.max(1, camera.aspect); camera.position.set(0, 3 + 2.4 * k, 9.5 * k); camera.lookAt(2.2 * k * asp / 2.17, 3 + .7 * k, 0); }
    else { const a = t * .06; camera.position.set(Math.sin(a) * 95, 42, Math.cos(a) * 95); camera.lookAt(0, 0, 0); }
    return;
  }
  let c = G.me;
  if (G.cine && G.cine.c) { const q = G.cine.c, a = G.cine.a + (2.3 - G.cine.t) * .9, R = 17 - (2.3 - G.cine.t) * 2; camera.position.set(q.pos.x + Math.sin(a) * R, q.pos.y + 7 + (2.3 - G.cine.t) * 3, q.pos.z + Math.cos(a) * R); if (camShake.v > 0) { camera.position.x += rand(-1, 1) * camShake.v; camera.position.y += rand(-1, 1) * camShake.v; camShake.v = Math.max(0, camShake.v - dt * 2.5); } camera.lookAt(q.pos.x, q.pos.y + 3, q.pos.z); return; }
  const big = c.st.rayon > 1.8 ? 1.2 : 1;
  const k = 1 - Math.exp(-(camInit ? 1000 : 5) * dt);
  camYaw += angDiff(camYaw, c.yaw) * (camInit ? 1 : 1 - Math.exp(-4 * dt));
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw), dist = (9 + Math.abs(c.speed) * .06) * big;
  const tp = tv.set(c.pos.x - fx * dist, c.pos.y + 4.4 * big, c.pos.z - fz * dist);
  if (camInit) { camPos.copy(tp); camInit = false; } else camPos.lerp(tp, k);
  camPos.y = Math.max(camPos.y, groundAt(camPos.x, camPos.z, 99) + 1.5);
  camLook.set(c.pos.x + fx * 5, c.pos.y + 1.6, c.pos.z + fz * 5);
  camera.position.copy(camPos);
  if (camShake.v > 0) { camera.position.x += rand(-1, 1) * camShake.v; camera.position.y += rand(-1, 1) * camShake.v; camShake.v = Math.max(0, camShake.v - dt * 2.5); }
  camera.lookAt(camLook);
  camera.fov += ((c.turboOn ? 74 : (camera.aspect < 1.2 ? 75 : 64)) - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix();
}

/* ================== HUD ================== */
const mini = $('mini').getContext('2d');
function updHud() {
  const c = G.me; if (!c) return; emoHud(c);
  { const top = Math.max(c.shMax, c.sh); $('shBar').style.width = (Math.min(c.sh, c.shMax) / top * 100) + '%'; $('ovBar').style.width = (Math.max(0, c.sh - c.shMax) / top * 100) + '%'; $('shTxt').textContent = `${Math.ceil(c.sh)}/${c.shMax}`;
    $('hpBar2').style.width = (Math.max(0, c.hp) / c.maxHp * 100) + '%'; $('hpTxt').textContent = `${Math.max(0, Math.ceil(c.hp))}/${c.maxHp}`; $('vitals').classList.toggle('low', c.hp < c.maxHp * .3); $('vitals').classList.toggle('regen', c.sh < c.shMax && c.shT <= 0 && c.alive); }
  $('hpBar').style.width = (c.hp / c.maxHp * 100) + '%'; $('hHp').textContent = Math.ceil(c.hp) + ' ' + L.hp;
  $('hpBar').style.background = c.hp < c.maxHp * .3 ? 'linear-gradient(90deg,#ff3b2e,#ff9a3c)' : '';
  $('tuBar').style.width = c.turbo + '%'; $('spBar').style.width = (100 - clamp(c.specCd / c.specMax, 0, 1) * 100) + '%';
  $('bSpec').classList.toggle('cd', c.specCd > 0);
  const s = c.sel && c.w[c.sel] ? c.sel : null; const tot = WPK.reduce((a, t) => a + c.w[t], 0);
  $('wIc').textContent = s ? PICK[s].ic : ARMES[c.lo.arme.b].ic; $('wNom').textContent = s ? `${PICK[s].nom} ×${c.w[s]}` : ARMES[c.lo.arme.b].nom;
  $('wSub').textContent = s ? (tot > c.w[s] ? L.tapSwitch : L.pressWeapon) : L.grabWeapons;
  $('bArmeIc').textContent = s ? PICK[s].ic : '—'; $('bArme').classList.toggle('vide', !s);
  const rem = Math.max(0, MATCH_TIME - G.mt); $('iTime').textContent = `${Math.floor(rem / 60)}:${String(Math.floor(rem % 60)).padStart(2, '0')}`; $('iTime').classList.toggle('alert', !!G.alert);
  if (G.teams) { const tk = teamKills(); $('iEnn').innerHTML = `<span class="tA">${tk[0]}</span>–<span class="tB">${tk[1]}</span> /${TEAM_GOAL}`; } else $('iEnn').textContent = `${c.kills} / ${KILL_GOAL}`;
  G.topT = (G.topT || 0) - 1; if (G.topT <= 0) { G.topT = 15; const top = [...G.cars].sort((a, b) => b.kills - a.kills || a.deaths - b.deaths || b.dmgDone - a.dmgDone).slice(0, 3);
    $('top3').innerHTML = top.map((o, i) => `<div class="${o === c ? 'moi' : ''}"><b>${i + 1}</b><img src="${portraits[o.id] || ''}" alt=""><span>${o.clan ? `<i class="cl">[${esc(o.clan)}]</i>` : ''}${esc(o.nom)}</span><em>${o.kills}</em></div>`).join(''); }
  // étiquettes
  const W = innerWidth, H = innerHeight;
  for (const o of G.cars) { if (!o.tag) continue; if (!o.alive || o.cloakT > 0) { o.tag.style.display = 'none'; continue; }
    tv.set(o.pos.x, o.pos.y + 3.4, o.pos.z).project(camera); const d = camera.position.distanceTo(o.pos);
    if (tv.z > 1 || d > 90) { o.tag.style.display = 'none'; continue; }
    o.tag.style.display = ''; o.tag.style.transform = `translate(${(tv.x * .5 + .5) * W}px,${(-tv.y * .5 + .5) * H}px)`; o.tagBar.style.width = (o.hp / o.maxHp * 100) + '%'; if (o.tagSh) o.tagSh.style.width = (Math.min(1, o.sh / (o.shMax || 1)) * 100) + '%'; }
  // radar (rotating, heading-up, proximity-limited, neon frame + N)
  const M = mini, sz = 224, cx = sz / 2, R = cx - 12, sc = R / RADAR_RANGE, yaw = (c.alive ? c : (G.spect || c)).yaw, P = (c.alive ? c : (G.spect || c)).pos;
  const rx = -Math.cos(yaw), rz = Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw), tt = performance.now() / 1000;
  const m = (x, z) => { const dx = x - P.x, dz = z - P.z; return [cx + (dx * rx + dz * rz) * sc, cx - (dx * fx + dz * fz) * sc]; };
  const edge = (x, y, pad = 6) => { const dx = x - cx, dy = y - cx, d = Math.hypot(dx, dy), r = R - pad; return d > r ? [cx + dx / d * r, cx + dy / d * r, 1] : [x, y, 0]; };
  M.clearRect(0, 0, sz, sz);
  const bg = M.createRadialGradient(cx, cx, 10, cx, cx, R); bg.addColorStop(0, 'rgba(40,14,70,.78)'); bg.addColorStop(1, 'rgba(10,4,22,.85)'); M.fillStyle = bg; M.beginPath(); M.arc(cx, cx, R, 0, 7); M.fill();
  M.save(); M.beginPath(); M.arc(cx, cx, R, 0, 7); M.clip();
  M.strokeStyle = 'rgba(34,229,255,.12)'; M.lineWidth = 1; for (const rr of [R * .33, R * .66]) { M.beginPath(); M.arc(cx, cx, rr, 0, 7); M.stroke(); }
  for (const b of blocks) { if (b.h < 1) continue; const q = [m(b.x0, b.z0), m(b.x1, b.z0), m(b.x1, b.z1), m(b.x0, b.z1)]; M.beginPath(); M.moveTo(q[0][0], q[0][1]); for (let k = 1; k < 4; k++) M.lineTo(q[k][0], q[k][1]); M.closePath(); M.fillStyle = b.ramp ? 'rgba(255,170,80,.3)' : b.w > 100 || b.d > 100 ? 'rgba(255,43,214,.55)' : 'rgba(190,170,255,.22)'; M.fill(); }
  M.restore();
  for (const p of pickups) { if (!p.on) continue; let [x, y] = m(p.x, p.z), out; const t = p.t;
    if (Math.hypot(x - cx, y - cx) > R - 5) continue;
    if (t === 'mega') { const s = 9 + Math.sin(tt * 6) * 2; M.save(); M.translate(x, y); M.rotate(tt * 2); M.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, r = k % 2 ? s * .45 : s; M.lineTo(Math.cos(a) * r, Math.sin(a) * r); } M.closePath(); M.fillStyle = `hsl(${(tt * 200) % 360},100%,60%)`; M.shadowColor = '#fff'; M.shadowBlur = 10; M.fill(); M.restore(); continue; }
    if (t === 'sante') { M.fillStyle = '#35e06a'; M.fillRect(x - 5, y - 1.8, 10, 3.6); M.fillRect(x - 1.8, y - 5, 3.6, 10); }
    else if (t === 'bouc' || t === 'over') { M.fillStyle = t === 'over' ? '#c07cff' : '#3fd0ff'; M.beginPath(); M.moveTo(x, y - 6); M.lineTo(x + 5, y); M.lineTo(x, y + 6); M.lineTo(x - 5, y); M.closePath(); M.fill(); }
    else if (t === 'turbo') { M.fillStyle = '#22e5ff'; M.beginPath(); M.moveTo(x, y - 5); M.lineTo(x + 4, y + 4); M.lineTo(x - 4, y + 4); M.closePath(); M.fill(); }
    else { M.fillStyle = '#' + PICK[t].coul.toString(16).padStart(6, '0'); M.fillRect(x - 3.5, y - 3.5, 7, 7); M.strokeStyle = 'rgba(255,255,255,.7)'; M.lineWidth = 1; M.strokeRect(x - 3.5, y - 3.5, 7, 7); } }
  for (const o of G.cars) { if (!o.alive || o === c || o.cloakT > 0) continue; let [x, y] = m(o.pos.x, o.pos.z), out = 0; if (Math.hypot(x - cx, y - cx) > R - 5) continue;
    const ally = G.teams && o.team === c.team; M.fillStyle = ally ? '#22e5ff' : G.teams ? (o.team === 0 ? '#ff2bd6' : '#ff3b2e') : '#ff3b2e';
    M.globalAlpha = out ? .55 : 1; M.beginPath(); M.arc(x, y, out ? 4.5 : 6.5, 0, 7); M.fill(); M.strokeStyle = '#fff'; M.lineWidth = 1.5; M.stroke(); M.globalAlpha = 1; }
  // sound pulses on the radar edge
  for (const q of sInd) { if (q.rel == null) continue; const th = Math.atan2(-Math.cos(q.rel), Math.sin(q.rel)), al = Math.min(1, q.t / 1.6 * 1.4) * q.it, pulse = 1 + (1.6 - q.t) * .08;
    M.strokeStyle = `rgba(255,170,40,${al.toFixed(2)})`; M.lineWidth = 7 * q.it + 2; M.shadowColor = '#ffaa28'; M.shadowBlur = 12; M.beginPath(); M.arc(cx, cx, (R - 9) * Math.min(1, pulse), th - .32, th + .32); M.stroke(); }
  M.shadowBlur = 0;
  // neon frame
  M.lineWidth = 5; M.strokeStyle = G.alert ? `rgba(255,${60 + 40 * Math.sin(tt * 8)},60,1)` : '#ff2bd6'; M.shadowColor = M.strokeStyle; M.shadowBlur = 10; M.beginPath(); M.arc(cx, cx, R, 0, 7); M.stroke();
  M.lineWidth = 1.5; M.strokeStyle = '#22e5ff'; M.shadowColor = '#22e5ff'; M.beginPath(); M.arc(cx, cx, R - 5, 0, 7); M.stroke(); M.shadowBlur = 0;
  { const [nx, ny] = m(P.x, P.z - 1000), d = Math.hypot(nx - cx, ny - cx), X = cx + (nx - cx) / d * R, Y = cx + (ny - cx) / d * R; M.fillStyle = '#0b0614'; M.beginPath(); M.arc(X, Y, 11, 0, 7); M.fill(); M.strokeStyle = '#22e5ff'; M.lineWidth = 2; M.stroke(); M.fillStyle = '#fff'; M.font = '900 14px system-ui,sans-serif'; M.textAlign = 'center'; M.textBaseline = 'middle'; M.fillText('N', X, Y + 1); }
  M.fillStyle = '#7ef29d'; M.shadowColor = '#7ef29d'; M.shadowBlur = 8; M.beginPath(); M.moveTo(cx, cx - 11); M.lineTo(cx + 8, cx + 8); M.lineTo(cx, cx + 3); M.lineTo(cx - 8, cx + 8); M.closePath(); M.fill(); M.shadowBlur = 0;
}
/* ---- directional sound indicators ---- */
const sInd = []; const IND_RANGE = 95;
function soundInd(x, z, w = 1) {
  const c = G.me; if (!c || !(G.mode === 'play' || G.mode === 'countdown')) return;
  const dx = x - c.pos.x, dz = z - c.pos.z, d = Math.hypot(dx, dz); if (d > IND_RANGE || d < 2.5) return;
  const ang = Math.atan2(dx, dz), it = clamp((1 - d / IND_RANGE) * w, .18, 1);
  const o = sInd.find(q => Math.abs(angDiff(q.ang, ang)) < .3);
  if (o) { o.ang = ang; o.x = x; o.z = z; o.t = 1.6; o.it = Math.max(o.it * .8, it); o.d = d; } else { if (sInd.length >= 8) sInd.shift(); sInd.push({ ang, x, z, t: 1.6, it, d }); }
}
const sIndEl = []; 
function updSoundInd(dt) {
  const box = $('sndInd'); if (!box) return;
  for (let i = sInd.length - 1; i >= 0; i--) { sInd[i].t -= dt; if (sInd[i].t <= 0) sInd.splice(i, 1); }
  const c = G.me, on = c && (G.mode === 'play' || G.mode === 'countdown');
  while (sIndEl.length < 8) { const e = document.createElement('i'); box.appendChild(e); sIndEl.push(e); }
  const W = innerWidth, H = innerHeight, yaw = on ? c.yaw : 0, rx = -Math.cos(yaw), rz = Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw);
  sIndEl.forEach((e, i) => { const q = on && sInd[i]; if (!q) { e.style.opacity = 0; return; }
    const dx = q.x - c.pos.x, dz = q.z - c.pos.z, a = Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz); q.rel = a;
    const show = Math.abs(a) > .55 || q.d < 14; const al = show ? Math.min(1, q.t / 1.6 * 1.4) * q.it : 0;
    e.style.opacity = al.toFixed(2); e.style.transform = `translate(${Math.sin(a) * W * .42}px,${-Math.cos(a) * H * .4}px) rotate(${a}rad) scale(${.7 + q.it * .6})`; });
}
function feedKill(v, k) {
  const d = document.createElement('div'); const meK = k === G.me, meV = v === G.me;
  d.textContent = k ? (meK ? L.youKilled(v.nom) : meV ? L.killedYou(k.nom) : `${k.nom} 💥 ${v.nom}`) : (meV ? L.selfDestruct : L.exploded(v.nom));
  if (meK || meV) d.className = 'moi'; $('feed').prepend(d); while ($('feed').children.length > 5) $('feed').lastChild.remove(); setTimeout(() => d.remove(), 4500);
  if (meK) { centreMsg(L.wreckedBig, `${v.nom}`, 1.2); SFX.horn(S.style.horn); emoteMe(pick(['cool', 'laugh', 'party']), 'force'); }
}
let centreT = 0;
function centreMsg(a, b = '', t = 1) { $('centre').innerHTML = `${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}`; centreT = t; }
function toastPk(t, r) { centreMsg(PICK[t].ic, (r > 0 ? RAR[r].nom + ' ' : '') + PICK[t].nom, .7); }
function flashShield() { const v = $('vitals'); v.classList.remove('hit'); void v.offsetWidth; v.classList.add('hit'); }
function flashDmg() { $('dmgFlash').style.boxShadow = 'inset 0 0 90px rgba(255,30,10,.75)'; clearTimeout(flashDmg.t); flashDmg.t = setTimeout(() => $('dmgFlash').style.boxShadow = '', 120); }

/* ================== Réseau (PeerJS / WebRTC, hôte autoritaire en étoile) ================== */
const PDBG = /[?&]debug/.test(location.search) ? 2 : 0;
function loadPeer() { return new Promise((res, rej) => { if (window.Peer) return res();
  const urls = ['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
  const tryN = i => { if (i >= urls.length) return rej(new Error('cdn')); const s = document.createElement('script'); s.src = urls[i]; s.async = true; s.onload = () => window.Peer ? res() : tryN(i + 1); s.onerror = () => { s.remove(); tryN(i + 1); }; document.head.appendChild(s); }; tryN(0); }); }
function genCode() { const C = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 4; i++) s += C[Math.random() * C.length | 0]; return s; }
const Net = {
  peer: null, role: null, code: '', conns: new Map(), host: null, slots: 6, lobby: [], inT: 0, snapT: 0, lastRx: 0,
  open() { return this.role === 'host' ? !!this.peer : !!(this.host && this.host.open); },
  send(m) { try { if (this.host && this.host.open) this.host.send(m); } catch (e) { } },
  broadcast(m) { for (const [, p] of this.conns) { try { if (p.conn.open) p.conn.send(m); } catch (e) { } } },
  close() {
    if (this.role === 'guest') this.send({ t: 'bye' }); if (this.role === 'host') this.broadcast({ t: 'bye' });
    const conns = [...this.conns.values()].map(p => p.conn); if (this.host) conns.push(this.host);
    setTimeout(() => conns.forEach(c => { try { c.close(); } catch (e) { } }), 150);
    if (this.peer) { const p = this.peer; setTimeout(() => { try { p.destroy(); } catch (e) { } }, 250); }
    this.peer = null; this.host = null; this.conns = new Map(); this.role = null; this.lobby = [];
  },
};
const myHello = () => ({ t: 'hello', av: S.av, cl: S.clan, nom: pseudo(), v: S.vehicule, sk: S.skin, lo: myLoadout(), niv: xpInfo().n, rp: S.rp, ti: S.style.title, tr: S.style.trail });
// heartbeat: detects closed tabs / dropped peers even without a clean 'close'
setInterval(() => {
  const now = performance.now();
  if (Net.role === 'guest' && Net.open()) { Net.send({ t: 'hb' }); if (Net.lastRx && now - Net.lastRx > 12000) guestLost(); }
  if (Net.role === 'host') { Net.broadcast({ t: 'hb' }); for (const [pid, p] of [...Net.conns]) if (p.rx && now - p.rx > 9000) { try { p.conn.close(); } catch (e) { } hostLost(pid); } }
}, 2000);
addEventListener('pagehide', () => { if (Net.role) Net.close(); });
function lnMsg(m) { $('lnMsg').textContent = m; }
async function hostCreate(retry) {
  lnUI('salle'); lnMsg(L.connServer); $('lnCode').textContent = '····';
  try { await loadPeer(); } catch (e) { lnMsg(L.errModule); lnUI('choix'); return; }
  if (!retry) Net.close(); Net.role = 'host'; Net.code = genCode();
  const peer = new Peer(NET_PREFIX + Net.code, { debug: PDBG }); Net.peer = peer;
  peer.on('open', () => { if (Net.peer !== peer) return; $('lnCode').textContent = Net.code; lnMsg(L.giveCode); renderLobby(); });
  peer.on('connection', c => { if (Net.peer !== peer) return;
    if (Net.conns.size >= MAX_JOUEURS - 1 || G.net === 'host' && (G.mode === 'play' || G.mode === 'countdown')) { c.on('open', () => { c.send({ t: Net.conns.size >= MAX_JOUEURS - 1 ? 'full' : 'busy' }); setTimeout(() => c.close(), 400); }); return; }
    c.on('open', () => { Net.conns.set(c.peer, { rx: performance.now(), conn: c, nom: L.player, v: 'megabite', sk: 'origine', lo: null }); });
    c.on('data', d => { if (Net.peer === peer) hostData(c.peer, d); });
    c.on('close', () => { if (Net.peer === peer) hostLost(c.peer); }); c.on('error', () => { if (Net.peer === peer) hostLost(c.peer); });
  });
  peer.on('error', err => { if (Net.peer !== peer) return; if (err.type === 'unavailable-id') { Net.peer = null; try { peer.destroy(); } catch (e) { } hostCreate(true); return; } netError(err); });
  peer.on('disconnected', () => { if (Net.peer === peer && !peer.destroyed) setTimeout(() => { try { peer.reconnect(); } catch (e) { } }, 1000); });
}
function hostData(pid, d) {
  if (!d || typeof d !== 'object') return; const p = Net.conns.get(pid); if (!p) return; p.rx = performance.now();
  if (d.t === 'hello') { p.nom = String(d.nom || L.player).replace(/[<>]/g, '').slice(0, 12) || L.player; p.v = VEH[d.v] ? d.v : 'megabite'; p.sk = SKINS.some(s => s.id === d.sk) ? d.sk : 'origine'; p.lo = sanitizeLo(d.lo); p.niv = clamp(d.niv | 0, 1, 999); p.rp = clamp(d.rp | 0, 0, 99999); p.ti = L.titles[d.ti] ? d.ti : ''; p.tr = TRAILS[d.tr] ? d.tr : ''; p.av = sanAv(d.av); p.cl = sanClan(d.cl || ''); broadcastLobby(); }
  else if (d.t === 'emo') { const c = G.cars.find(c => c.peer === pid); const n = EMOTES[d.k | 0]; if (c && n && (!p.emoT || performance.now() - p.emoT > 900)) { p.emoT = performance.now(); netEmote(c, n); } }
  else if (d.t === 'pick') { if (D.on) draftPick(pid, String(d.k || '')); }
  else if (d.t === 'in' && Array.isArray(d.c)) { const c = G.cars.find(c => c.peer === pid); if (!c) return; const a = d.c, ct = c.ctrl;
    ct.thr = clamp(+a[0] || 0, -1, 1); ct.steer = clamp(+a[1] || 0, -1, 1); const f = a[2] | 0; ct.fire = !!(f & 1); ct.turbo = !!(f & 2); ct.brake = !!(f & 4); ct.wpnN = a[3] | 0; ct.specN = a[4] | 0; ct.cycN = a[5] | 0; }
  else if (d.t === 'bye') hostLost(pid);
}
function hostLost(pid) {
  const p = Net.conns.get(pid); if (!p) return; Net.conns.delete(pid);
  const c = G.cars.find(c => c.peer === pid);
  if (c && (G.mode === 'play' || G.mode === 'countdown')) { c.peer = null; c.bot = true; c.ai.k = .5; const d = document.createElement('div'); d.textContent = L.leftBot(c.nom); $('feed').prepend(d); setTimeout(() => d.remove(), 4000); }
  broadcastLobby();
}
function lobbyList() {
  const l = [{ pid: 'hote', nom: pseudo(), v: S.vehicule, niv: xpInfo().n, hote: 1, rp: S.rp, ti: S.style.title, av: S.av, cl: S.clan }];
  for (const [pid, p] of Net.conns) l.push({ pid, nom: p.nom, v: p.v, niv: p.niv || 1, rp: p.rp || 0, ti: p.ti || '', av: p.av || sanAv(), cl: p.cl || '' });
  return l;
}
function broadcastLobby() { if (Net.role !== 'host') return; Net.lobby = lobbyList(); Net.broadcast({ t: 'lobby', l: Net.lobby, slots: Net.slots, code: Net.code, ranked: Net.ranked ? 1 : 0 }); renderLobby(); }
function hostStart() {
  if (Net.role !== 'host') return;
  const humans = lobbyList(); const n = Math.max(humans.length, Math.min(MAX_JOUEURS, Net.slots));
  const roster = []; const noms = [...BOT_NOMS].sort(() => Math.random() - .5);
  humans.forEach((h, i) => { const p = Net.conns.get(h.pid); roster.push(h.hote ? { id: i, nom: h.nom, v: S.vehicule, sk: S.skin, lo: myLoadout(), local: true, tr: S.style.trail, ti: S.style.title, av: S.av, cl: S.clan } : { id: i, nom: p.nom, v: p.v, sk: p.sk, lo: p.lo || botLoadout(0), peer: h.pid, tr: p.tr, ti: p.ti, av: p.av, cl: p.cl }); });
  for (let i = humans.length; i < n; i++) roster.push({ id: i, nom: noms[i % noms.length] + ' 🤖', v: pick(VKEYS), col: BOT_COUL[i % BOT_COUL.length], bot: true, k: .6, lo: botLoadout(.6), av: botAv(), cl: pick(BOT_CLANS) });
  hostLaunch(roster);
}
function hostLaunch(roster) {
  const pub = roster.map(r => ({ id: r.id, nom: r.nom, v: r.v, sk: r.sk, col: r.col, lo: r.lo, tr: r.tr || '', ti: r.ti || '', bot: r.bot ? 1 : 0, k: r.k, peer: r.peer || null, av: r.av, cl: r.cl || '', team: r.team === 0 || r.team === 1 ? r.team : -1 }));
  for (const [pid, p] of Net.conns) { const me = roster.find(r => r.peer === pid); if (!me) continue; try { p.conn.send({ t: 'start', ranked: Net.ranked ? 1 : 0, roster: pub, you: me.id }); } catch (e) { } }
  startMatch(roster, (roster.find(r => r.local) || roster[0]).id, 'host');
}
async function guestJoin(code) {
  code = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 4) { lnMsg(L.enterCode); return; }
  lnMsg(L.connecting);
  try { await loadPeer(); } catch (e) { lnMsg(L.errModule); return; }
  Net.close(); Net.role = 'guest'; Net.code = code;
  const peer = new Peer({ debug: PDBG }); Net.peer = peer;
  const to = setTimeout(() => { if (Net.peer === peer && !Net.open()) { lnMsg(L.noAnswer); Net.close(); lnUI('choix'); } }, 15000);
  peer.on('open', () => { if (Net.peer !== peer) return; const c = peer.connect(NET_PREFIX + code, { reliable: true }); Net.host = c;
    c.on('open', () => { if (Net.host !== c) return; clearTimeout(to); c.send(myHello()); lnUI('salle'); $('lnCode').textContent = code; lnMsg(L.connected); });
    c.on('data', d => { if (Net.host === c) { Net.lastRx = performance.now(); guestData(d); } });
    c.on('close', () => { if (Net.host === c) guestLost(); }); c.on('error', () => { if (Net.host === c) guestLost(); }); });
  peer.on('error', err => { if (Net.peer !== peer) return; clearTimeout(to); if (err.type === 'peer-unavailable') { lnMsg(L.roomNotFound); Net.close(); lnUI('choix'); } else netError(err); });
}
function guestData(d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'lobby') { Net.lobby = d.l || []; Net.slots = d.slots | 0; Net.ranked = !!d.ranked; renderLobby(); }
  else if (d.t === 'full' || d.t === 'busy') { lnMsg(d.t === 'full' ? L.roomFull : L.roomBusy); Net.close(); lnUI('choix'); }
  else if (d.t === 'start') { Net.ranked = !!d.ranked; const roster = (d.roster || []).map(r => ({ ...r, lo: sanitizeLo(r.lo), local: r.id === d.you })); startMatch(roster, d.you, 'client'); }
  else if (d.t === 's') applySnap(d);
  else if (d.t === 'draft') guestDraft(d.d);
  else if (d.t === 'end') { if (G.net === 'client' && G.mode !== 'end') { G.ended = true; G.winTeam = typeof d.wt === 'number' ? d.wt : -1; showResults((d.res || []).map(r => ({ ...r }))); } }
  else if (d.t === 'bye') guestLost();
}
function guestLost() {
  const inGame = G.net === 'client' && (G.mode === 'play' || G.mode === 'countdown');
  Net.close(); G.net = null;
  if (inGame) { toMenu(); alertMsg(L.hostLeft); }
  else if ($('sLigne').classList.contains('on')) { lnUI('choix'); lnMsg(L.hostClosed); }
}
function netError(err) { console.warn('réseau', err && err.type); if (G.net && (G.mode === 'play' || G.mode === 'countdown')) return;
  lnMsg(err && (err.type === 'network' || err.type === 'server-error') ? L.serverDown : L.connError); Net.close(); lnUI('choix'); }
const r2 = v => Math.round(v * 100) / 100;
const PKIDX = ['missile', 'feu', 'torpille', 'frenesie', 'mine', 'napalm', 'egg', 'mortar', 'sting', 'bomb'];
function sendSnap() {
  const c = G.cars.map(c => [c.id, r2(c.pos.x), r2(c.pos.y), r2(c.pos.z), r2(c.yaw), r2(c.vx), r2(c.vz), r2(c.vy), Math.ceil(c.hp), (c.alive ? 1 : 0) | (c.ctrl.fire && c.alive ? 2 : 0) | (c.turboOn ? 4 : 0) | (c.burn > 0 ? 8 : 0) | (c.onGround ? 16 : 0) | (c.shieldT > 0 ? 32 : 0) | (c.cloakT > 0 ? 64 : 0) | (c.chargeT > 0 ? 128 : 0) | (c.flameT > 0 ? 256 : 0) | (c.nitroT > 0 ? 512 : 0), r2(c.speed), Math.round(c.turbo), r2(c.specCd), c.w.missile, c.w.feu, c.w.mine, c.w.napalm, c.sel ? WPK.indexOf(c.sel) : -1, c.kills, c.maxHp, c.w.mega, c.deaths, Math.ceil(c.sh), c.shMax]);
  const p = G.proj.map(p => [p.id, PKIDX.indexOf(p.k), r2(p.p.x), r2(p.p.y), r2(p.p.z), r2(p.v.x), r2(p.v.y), r2(p.v.z)]);
  Net.broadcast({ t: 's', mt: r2(G.mt), c, p, pk: pickups.map(p => p.on ? 1 : 0).join(''), ev: G.ev }); G.ev = [];
}
const carById = id => G.cars.find(c => c.id === id);
function applySnap(d) {
  if (G.net !== 'client' || !G.me) return; const now = performance.now(); if (typeof d.mt === 'number') G.mt = d.mt;
  for (const e of d.c || []) {
    const c = carById(e[0]); if (!c) continue; const fl = e[9];
    const wasAlive = c.alive; c.alive = !!(fl & 1); c.hp = e[8]; c.maxHp = e[19] || c.maxHp; c.turboOn = !!(fl & 4); c.burn = fl & 8 ? 1 : 0; c.shieldT = fl & 32 ? .3 : 0; c.cloakT = fl & 64 ? .3 : 0; c.chargeT = fl & 128 ? .3 : 0; c.flameT = fl & 256 ? .3 : 0; c.nitroT = fl & 512 ? .3 : 0; c.turbo = e[11]; c.specCd = e[12];
    c.w.missile = e[13]; c.w.feu = e[14]; c.w.mine = e[15]; c.w.napalm = e[16]; c.sel = e[17] >= 0 ? WPK[e[17]] : null; c.kills = e[18]; c.w.mega = e[20] | 0; c.deaths = e[21] | 0; if (e[23]) { if (c === G.me && e[22] < c.sh - .5) flashShield(); c.sh = e[22] | 0; c.shMax = e[23] | 0; }
    if (wasAlive && !c.alive) { wreck(c); c.deadT = G.t; }
    if (!wasAlive && c.alive) { unwreck(c); c.pos.set(e[1], e[2], e[3]); c.yaw = e[4]; if (c === G.me) { G.deadMsg = 0; centreMsg(L.go, '', .6); } }
    if (c === G.me) { const dx = e[1] - c.pos.x, dz = e[3] - c.pos.z, dd = Math.hypot(dx, dz);
      if (dd > 7 || !c.alive) { c.pos.set(e[1], e[2], e[3]); c.yaw = e[4]; c.vx = e[5]; c.vz = e[6]; } else { c.pos.x += dx * .2; c.pos.z += dz * .2; if (Math.abs(e[2] - c.pos.y) > 1.5) c.pos.y = e[2]; c.yaw += angDiff(c.yaw, e[4]) * .1; } }
    else { c.firing = !!(fl & 2) && c.alive; c.net = { x: e[1], y: e[2], z: e[3], yaw: e[4], vx: e[5], vz: e[6], vy: e[7], og: !!(fl & 16), sp: e[10], t: now }; if (!c.netInit) { c.netInit = 1; c.pos.set(e[1], e[2], e[3]); c.yaw = e[4]; } }
  }
  const seen = new Set();
  for (const e of d.p || []) { seen.add(e[0]); let p = G.proj.find(q => q.id === e[0]);
    if (!p) { const k = PKIDX[e[1]] || 'missile'; p = { id: e[0], k, p: new THREE.Vector3(), v: new THREE.Vector3(), mesh: projMesh(k) }; G.proj.push(p); }
    p.p.set(e[2], e[3], e[4]); p.v.set(e[5], e[6], e[7]); }
  for (let i = G.proj.length - 1; i >= 0; i--) if (!seen.has(G.proj[i].id)) removeProj(i);
  if (typeof d.pk === 'string') pickups.forEach((p, i) => { const on = d.pk[i] === '1'; if (p.on !== on) { p.on = on; p.g.visible = on; } });
  for (const e of d.ev || []) {
    if (e.e === 'boom') fxBoom(e.x, e.y, e.z, e.r * .55, e.r > 5);
    else if (e.e === 'emo') { const c = carById(e.c); if (c && c !== G.me) showEmote(c, EMOTES[e.k | 0]); }
    else if (e.e === 'mega') { const c = carById(e.c); if (c) fxMega(c); }
    else if (e.e === 'endmsg') { const c = carById(e.c); centreMsg(e.w === 'time' ? '⏱️' : '🏁', e.w === 'team' ? L.teamWin(teamName(e.tm | 0)) : e.w === 'goal' ? L.reachedGoal(c ? c.nom : '') : L.timeUp, 2); }
    else if (e.e === 'kill') { const v = carById(e.v), k = carById(e.k); if (v) { if (v.alive) { v.alive = false; wreck(v); v.deadT = G.t; } feedKill(v, k); } }
    else if (e.e === 'zap') { const a = carById(e.a), b = carById(e.b); if (a && b) fxZap(a.pos, b.pos); }
    else if (e.e === 'ring') { const c = carById(e.c); if (c) { fxRing(c.pos.x, c.pos.y, c.pos.z, e.r || 16); SFX.onde(); if (e.r && e.r < 8) c.spinT = .6; } }
    else if (e.e === 'beam') { const c = carById(e.a); if (c) fxBeam(c.pos, new THREE.Vector3(e.x, e.y, e.z), 0x5fd0ff); }
    else if (e.e === 'pk') { const p = pickups[e.i]; if (p) { p.on = false; p.g.visible = false; } if (e.c === G.me.id) { SFX.pick(); toastPk(pickups[e.i].t, pickups[e.i].r); } }
    else if (e.e === 'prop') fxPropBreak(e.i);
  }
}
function puppet(c, dt) {
  const n = c.net; if (!n) return; const lag = Math.min(.2, (performance.now() - n.t) / 1000);
  const tx = n.x + n.vx * lag, tz = n.z + n.vz * lag, k = 1 - Math.exp(-14 * dt);
  c.pos.x += (tx - c.pos.x) * k; c.pos.z += (tz - c.pos.z) * k; c.pos.y += (n.y - c.pos.y) * k; c.yaw += angDiff(c.yaw, n.yaw) * k;
  c.vx = n.vx; c.vz = n.vz; c.vy = n.vy; c.speed = n.sp; c.onGround = n.og;
}


/* ================== Portraits, alerte finale & méga-attaque ================== */
const portraits = {};
let pRen = null, pScene = null, pCam = null;
const SHARED_GEO = new Set([wheelGeo, LEG_GEO, TORSO_GEO, ARM_GEO, HEAD_GEO, HELM_GEO]);
function renderPortraits() {
  try { for (const c of G.cars) portraits[c.id] = avPortrait(c.av); } catch (e) { console.warn('portrait', e); }
  G.topT = 0;
}
function ensurePRen() {
  if (pRen) return;
  const cv = document.createElement('canvas'); cv.width = cv.height = 96; pRen = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true }); pRen.setPixelRatio(1); pRen.setSize(96, 96, false);
  pScene = new THREE.Scene(); pScene.add(new THREE.HemisphereLight(0xd8c8ff, 0x402030, 2.2)); const d = new THREE.DirectionalLight(0xffffff, 2); d.position.set(2, 4, 5); pScene.add(d); pCam = new THREE.PerspectiveCamera(30, 1, .1, 100);
}
const avCache = {};
function avPortrait(av) {
  av = sanAv(av); const key = av.id + av.a + av.n; if (avCache[key]) return avCache[key];
  try { ensurePRen(); const g = buildAvatar(av); g.rotation.y = -.25; g.userData.anim(1.2); pScene.add(g);
    pCam.position.set(.25, 1.75, 2.6); pCam.lookAt(0, 1.45, 0); pRen.setClearColor(0x000000, 0); pRen.render(pScene, pCam);
    avCache[key] = pRen.domElement.toDataURL('image/png'); pScene.remove(g); disposeAvatar(g); } catch (e) { console.warn('avatar', e); return ''; }
  return avCache[key];
}
const ALERT_COL = { hemi: new THREE.Color(0xff5050), sun: new THREE.Color(0xff3020), fog: new THREE.Color(0x4a1020) };
const BASE_COL = { hemi: hemi.color.clone(), sun: sun.color.clone(), fog: scene.fog.color.clone() };
function startAlert() {
  G.alert = true; G.alertK = 0; setTimeout(() => emoteMe('suspicious', 'force'), 600); $('alertBan').classList.add('on'); setTimeout(() => $('alertBan').classList.remove('on'), 4200); SFX.siren(); document.body.classList.add('alerte');
  if (AUTH()) for (const p of pickups) if (p.mega) { p.on = false; p.cd = 3; }
  setTimeout(() => { if (G.alert && (G.mode === 'play')) { centreMsg('🌈', L.megaSpawn, 2.2); SFX.levelUp(); } }, 3200);
}
function alertTick(dt) {
  G.alertK = Math.min(1, (G.alertK || 0) + dt / 3); const k = G.alertK * (.85 + Math.sin(performance.now() / 350) * .15);
  hemi.color.copy(BASE_COL.hemi).lerp(ALERT_COL.hemi, k * .7); sun.color.copy(BASE_COL.sun).lerp(ALERT_COL.sun, k * .6); scene.fog.color.copy(BASE_COL.fog).lerp(ALERT_COL.fog, k);
}
function resetAlert() {
  G.alert = false; G.alertK = 0; hemi.color.copy(BASE_COL.hemi); sun.color.copy(BASE_COL.sun); scene.fog.color.copy(BASE_COL.fog); document.body.classList.remove('alerte'); $('alertBan').classList.remove('on');
  for (const p of pickups) if (p.mega) { p.on = false; p.g.visible = false; }
}
const megaFx = [];
function fxMega(c) {
  if (G.me && c !== G.me && c.pos.distanceTo(G.me.pos) < 40) setTimeout(() => emoteMe('mindblown', 'force'), 900);
  const x = c.pos.x, y = c.pos.y, z = c.pos.z;
  const pil = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 80, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  pil.position.set(x, y + 40, z); scene.add(pil); megaFx.push({ m: pil, t: 0, life: 2.4, k: 'pil' });
  const ring = new THREE.Mesh(new THREE.RingGeometry(.8, 1, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(x, y + .4, z); scene.add(ring); megaFx.push({ m: ring, t: -1.1, life: 1.0, k: 'ring' });
  const fin = new THREE.Mesh(finGeo(9, 10), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: .85 })); fin.position.set(x, y - 9, z); fin.rotation.y = c.yaw; scene.add(fin); megaFx.push({ m: fin, t: 0, life: 2.4, k: 'fin', y0: y });
  for (let i = 0; i < 60; i++) { const a = Math.random() * 7; spawnP(x + Math.cos(a) * 3, y + .5, z + Math.sin(a) * 3, Math.cos(a) * 3, rand(8, 20), Math.sin(a) * 3, 1.4, .5, tmpC.setHSL(Math.random(), 1, .6).getHex(), 4); }
  const near = G.me && (c === G.me || Math.hypot(G.me.pos.x - x, G.me.pos.z - z) < 70);
  if (near) { G.cine = { c, t: 2.3, a: c.yaw + Math.PI * .75 }; document.body.classList.add('cine'); if (!G.net) G.slowT = 1.1; }
  centreMsg('🌈 ' + L.mega, `${c.nom} · ${L.megaName}`, 2.2); SFX.missile(1); SFX.siren(.6); if (c !== G.me) soundInd(x, z, 1.5);
  setTimeout(() => { fxBoom(x, y, z, 12, true); $('flash').classList.add('on'); setTimeout(() => $('flash').classList.remove('on'), 160); camShake.v = Math.max(camShake.v, near ? 2 : .8); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; setTimeout(() => fxBoom(x + Math.cos(a) * 14, y, z + Math.sin(a) * 14, 4, true), 120 + i * 40); } }, 1100);
}
function megaAttack(c) {
  c.w.mega = 0; emit({ e: 'mega', c: c.id }); fxMega(c);
  G.megas.push({ c, t: 1.1, x: c.pos.x, y: c.pos.y, z: c.pos.z });
}
function updMegas(dt) {
  for (let i = G.megas.length - 1; i >= 0; i--) { const m = G.megas[i]; m.t -= dt; if (m.t > 0) continue; G.megas.splice(i, 1);
    for (const o of G.cars) { if (o === m.c || !o.alive) continue; const dx = o.pos.x - m.x, dz = o.pos.z - m.z, d = Math.hypot(dx, dz) || 1; if (d > 30) continue; const f = 1 - .5 * d / 30;
      damage(o, 140 * f * m.c.dmgMul, m.c); if (!o.alive) continue; o.vx += dx / d * 30 * f / o.st.masse; o.vz += dz / d * 30 * f / o.st.masse; o.vy = 14 * f; o.onGround = false; o.pos.y += .05; }
    for (const p of props) if (p.on && Math.hypot(p.x - m.x, p.z - m.z) < 30) breakProp(p, m.c); }
}
function updMegaFx(dt) {
  for (let i = megaFx.length - 1; i >= 0; i--) { const f = megaFx[i]; f.t += dt; if (f.t < 0) { f.m.visible = false; continue; } f.m.visible = true; const k = f.t / f.life;
    if (k >= 1) { scene.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); megaFx.splice(i, 1); continue; }
    if (f.k === 'pil') { f.m.material.color.setHSL((performance.now() / 600) % 1, 1, .6); f.m.material.opacity = .6 * (1 - k); f.m.scale.set(1 + k * 2, 1, 1 + k * 2); }
    else if (f.k === 'ring') { f.m.scale.setScalar(2 + k * 30); f.m.material.color.setHSL((performance.now() / 400) % 1, 1, .6); f.m.material.opacity = 1 - k; }
    else if (f.k === 'fin') { f.m.position.y = f.y0 - 9 + Math.sin(Math.min(1, k * 1.4) * Math.PI) * 11; } }
  if (G.slowT > 0) G.slowT -= dt;
  if (G.cine) { G.cine.t -= dt; if (G.cine.t <= 0) { G.cine = null; document.body.classList.remove('cine'); camInit = true; } }
}

/* ================== Commandes ================== */
const IN = { jx: 0, jy: 0, fire: false, turbo: false, brake: false, wpnN: 0, specN: 0, cycN: 0, keys: new Set() };
(() => {
  const zone = $('zoneJoy'), joy = $('joy'), knob = joy.firstElementChild; let jid = null, ox = 0, oy = 0;
  zone.addEventListener('pointerdown', e => { if (jid !== null) return; jid = e.pointerId; ox = e.clientX; oy = e.clientY; joy.style.display = 'block'; joy.style.left = ox + 'px'; joy.style.top = (oy - zone.getBoundingClientRect().top) + 'px'; knob.style.transform = ''; $('joyHint').style.display = 'none'; try { zone.setPointerCapture(jid); } catch (er) { } e.preventDefault(); });
  zone.addEventListener('pointermove', e => { if (e.pointerId !== jid) return; let dx = e.clientX - ox, dy = e.clientY - oy; const d = Math.hypot(dx, dy), R = 50; if (d > R) { dx *= R / d; dy *= R / d; } knob.style.transform = `translate(${dx}px,${dy}px)`; IN.jx = dx / R; IN.jy = dy / R; if (Math.hypot(IN.jx, IN.jy) < .15) IN.jx = IN.jy = 0; });
  const end = e => { if (e.pointerId !== jid) return; jid = null; IN.jx = IN.jy = 0; joy.style.display = 'none'; };
  zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end); zone.addEventListener('lostpointercapture', end);
  const hold = (id, k) => { const el = $(id); const set = v => { IN[k] = v; el.classList.toggle('on', v); };
    el.addEventListener('pointerdown', e => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (er) { } set(true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, () => set(false))); };
  const tap = (id, k) => { const el = $(id); el.addEventListener('pointerdown', e => { e.preventDefault(); IN[k]++; el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 120); }); };
  hold('bFeu', 'fire'); hold('bTurbo', 'turbo'); hold('bFrein', 'brake'); tap('bArme', 'wpnN'); tap('bSpec', 'specN');
  $('wep').addEventListener('pointerdown', e => { e.preventDefault(); IN.cycN++; SFX.clic(); });
  addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; const k = e.key.toLowerCase();
    if (!IN.keys.has(k)) { if (k === 'e' || k === 'f') IN.wpnN++; if (k === 'q') IN.specN++; if (k === 'r' || k === 'tab') IN.cycN++; if ((k === 'escape' || k === 'p') && (G.mode === 'play' || G.mode === 'countdown')) pauseGame(); }
    IN.keys.add(k); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'tab'].includes(k)) e.preventDefault(); });
  addEventListener('keyup', e => IN.keys.delete(e.key.toLowerCase()));
  addEventListener('blur', () => { IN.keys.clear(); IN.fire = IN.turbo = IN.brake = false; });
  document.addEventListener('gesturestart', e => e.preventDefault());
  if (!matchMedia('(pointer:coarse)').matches) document.body.classList.add('desk');
})();
function readInput(ct) {
  const K = IN.keys; const up = K.has('w') || K.has('arrowup') || K.has('z'), dn = K.has('s') || K.has('arrowdown'), lf = K.has('a') || K.has('arrowleft'), rt = K.has('d') || K.has('arrowright');
  ct.thr = up ? 1 : dn ? -1 : -IN.jy; ct.steer = rt ? 1 : lf ? -1 : IN.jx;
  if (!up && !dn && (IN.jx || IN.jy)) { ct.thr = clamp(-IN.jy * 1.3, -1, 1); if (ct.thr > -.2 && Math.abs(IN.jx) > .5) ct.thr = Math.max(ct.thr, .5); }
  ct.fire = IN.fire || K.has(' '); ct.turbo = IN.turbo || K.has('shift'); ct.brake = IN.brake || K.has('x');
  ct.wpnN = IN.wpnN; ct.specN = IN.specN; ct.cycN = IN.cycN;
}

/* ================== Boucle ================== */
function step(dt) {
  if (G.mode === 'countdown') { G.cd -= dt; const n = Math.ceil(G.cd); if (n !== G.lastCd && n > 0) { G.lastCd = n; centreMsg(String(n), n === 3 ? L.cdHint : '', 1); SFX.bip(); } if (G.cd <= 0) { G.mode = 'play'; centreMsg(L.go, '', .8); SFX.go(); } }
  const playing = G.mode === 'play' || G.mode === 'countdown' || G.mode === 'end';
  if (!playing) return;
  G.t += dt; const me = G.me;
  const z = c => { const ct = c.ctrl; ct.thr = ct.steer = 0; ct.fire = ct.turbo = ct.brake = false; };
  if (IN.specN !== G.lastSpecN) { G.lastSpecN = IN.specN; if (G.mode === 'play' && me.alive && me.specCd <= 0) S.specials++; }
  if (G.mode === 'play' && me.alive && !G.paused) readInput(me.ctrl); else { z(me); me.ctrl.wpnN = IN.wpnN; me.ctrl.specN = IN.specN; me.ctrl.cycN = IN.cycN; }
  if (AUTH()) {
    if (G.mode === 'play' && !G.ended) { G.mt += dt; checkEnd(); }
    updMegas(dt);
    for (const c of G.cars) {
      if (!c.alive && G.mode === 'play' && !G.ended) { c.respawnT -= dt; if (c.respawnT <= 0) respawn(c); }
      if (c.alive && AUTH()) { if (c.shT > 0) c.shT -= dt; else if (c.sh < c.shMax) c.sh = Math.min(c.shMax, c.sh + c.shMax * .09 * dt); if (c.sh > c.shMax) c.sh = Math.max(c.shMax, c.sh - 2.5 * dt); }
      if (!c.alive || G.mode !== 'play') { const w = c.ctrl.wpnN, s = c.ctrl.specN, y = c.ctrl.cycN; z(c); c.seen.wpn = w; c.seen.spec = s; c.seen.cyc = y; c.ctrl.wpnN = w; c.ctrl.specN = s; c.ctrl.cycN = y; c.physics(dt); continue; }
      if (c.bot) aiThink(c, dt);
      const ct = c.ctrl;
      if (ct.cycN !== c.seen.cyc) { c.seen.cyc = ct.cycN; cycleWeapon(c); }
      if (ct.wpnN !== c.seen.wpn) { c.seen.wpn = ct.wpnN; useWeapon(c); }
      if (ct.specN !== c.seen.spec) { c.seen.spec = ct.specN; useSpecial(c); }
      if (c.specCd > 0) c.specCd -= dt;
      c.mgCd -= dt; if (ct.fire && c.mgCd <= 0) { c.mgCd = 1 / c.lo.arme.cad; fireMG(c); }
      if (c.burn > 0) { c.burn -= dt; damage(c, 7 * dt, c.lastAtk); }
      for (const k of ['chargeT', 'nitroT', 'shieldT', 'cloakT']) if (c[k] > 0) c[k] -= dt;
      if (c.flameT > 0) { c.flameT -= dt; for (const o of G.cars) { if (o === c || !o.alive) continue; const dx = o.pos.x - c.pos.x, dz = o.pos.z - c.pos.z, d = Math.hypot(dx, dz); if (d > 14 || Math.abs(o.pos.y - c.pos.y) > 3) continue; if (Math.abs(angDiff(c.yaw, Math.atan2(dx, dz))) < .45) { damage(o, 50 * dt * c.dmgMul, c); o.burn = Math.max(o.burn, 1.5); } } }
      c.physics(dt);
    }
    carCollisions(); updProj(dt); updPickups(dt);
    if (G.net === 'host') { G.snapT -= dt; if (G.snapT <= 0 && G.mode !== 'end') { G.snapT = 1 / 15; sendSnap(); } }
    if (G.ended && G.mode !== 'end') { G.endT -= dt; if (G.endT <= 0) finishMatch(); }
  } else {
    if (me.alive) me.physics(dt);
    me.firing = me.ctrl.fire && me.alive && G.mode === 'play';
    for (const c of G.cars) if (c !== me) puppet(c, dt);
    carCollisions(); updProj(dt); updPickups(dt);
    for (const c of G.cars) if (c.alive) fakeMG(c, dt);
    Net.inT -= dt; if (Net.inT <= 0 && G.mode !== 'end') { Net.inT = 1 / 20; const ct = me.ctrl; Net.send({ t: 'in', c: [r2(ct.thr), r2(ct.steer), (ct.fire ? 1 : 0) | (ct.turbo ? 2 : 0) | (ct.brake ? 4 : 0), ct.wpnN, ct.specN, ct.cycN] }); }
  }
  if (!me.alive && G.mode === 'play' && !G.deadMsg) { G.deadMsg = 1; centreMsg(L.wrecked, L.respawning, 3); }
  if (G.mt >= ALERT_AT && !G.alert && G.mode === 'play') startAlert();
  if (G.alert) alertTick(dt);
  for (const c of G.cars) c.syncMesh(dt);
  SFX.engine(me.speed, G.mode === 'play' && me.alive);
}
let last = performance.now(), fpsAcc = 0, fpsN = 0; G.fps = 60;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(.05, (now - last) / 1000); last = now; fpsAcc += dt; fpsN++; if (fpsAcc > 1) { G.fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; }
  const sdt = G.paused && !G.net ? 0 : G.slowT > 0 ? dt * .3 : dt;
  for (let i = 0; i < (G.ts || 1); i++) { step(sdt); updBullets(sdt); }
  updParts(dt); updFx(dt); updMegaFx(dt); if (G.mode === 'draft') draftTick(dt); avFrame(now);
  if (G.mode === 'menu' || G.mode === 'garage') { for (const p of pickups) { p.g.rotation.y += dt * 2; } if (showcase) showcase.rotation.y += dt * .6; }
  updCamera(dt);
  updShadowCam();
  if (G.mode === 'play' || G.mode === 'countdown') updHud();
  if (centreT > 0) { centreT -= dt; if (centreT <= 0) $('centre').innerHTML = ''; }
  if (composer) composer.render(); else renderer.render(scene, camera);
  emoRender(); if (G.me) SFX.listen(camera); updSoundInd(dt);
}

/* ================== Qualité graphique ================== */
let composer = null, bloomMods = null;
const GFX = { low: { pr: 1, sh: 0, pm: .5 }, medium: { pr: 1.5, sh: 0, pm: .75 }, high: { pr: 2.25, sh: 1024, pm: 1 }, ultra: { pr: 3, sh: 2048, pm: 1.5, bloom: 1 } };
async function applyGfx() {
  const q = GFX[S.gfx] || GFX.high;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, q.pr));
  const shOn = !!q.sh; renderer.shadowMap.enabled = shOn; renderer.shadowMap.type = THREE.PCFSoftShadowMap; sun.castShadow = shOn;
  if (shOn) { sun.shadow.mapSize.set(q.sh, q.sh); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } const sc = sun.shadow.camera; sc.left = sc.bottom = -45; sc.right = sc.top = 45; sc.near = 1; sc.far = 260; sc.updateProjectionMatrix(); sun.shadow.bias = -.0006; sun.shadow.normalBias = .05; }
  renderer.toneMapping = S.gfx === 'high' || S.gfx === 'ultra' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping; renderer.toneMappingExposure = 1.25;
  G.pm = q.pm;
  scene.traverse(o => { if (o.isMesh) { if (o.material && o.material.needsUpdate !== undefined) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.needsUpdate = true); } } });
  for (const c of G.cars) c.shadow.visible = !shOn; if (showcase) showcase.userData.sh.visible = !shOn;
  if (q.bloom) {
    try {
      if (!bloomMods) bloomMods = await Promise.all([import('three/addons/postprocessing/EffectComposer.js'), import('three/addons/postprocessing/RenderPass.js'), import('three/addons/postprocessing/UnrealBloomPass.js'), import('three/addons/postprocessing/OutputPass.js')]);
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = bloomMods;
      if (composer) composer.dispose();
      composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .7, .5, .78)); composer.addPass(new OutputPass());
      composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(innerWidth, innerHeight);
    } catch (e) { console.warn('bloom', e); composer = null; }
  } else if (composer) { composer.dispose(); composer = null; }
}
addEventListener('resize', () => { if (composer) composer.setSize(innerWidth, innerHeight); });
function updShadowCam() { if (!sun.castShadow) return; const c = G.me && (G.mode === 'play' || G.mode === 'countdown' || G.mode === 'end') ? G.me.pos : new THREE.Vector3(0, 0, 0); sun.position.set(c.x - 40, 80, c.z - 30); sun.target.position.set(c.x, 0, c.z); sun.target.updateMatrixWorld(); }
scene.add(sun.target);
function markShadows(o, cast, recv) { o.traverse(m => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); }

/* ================== Vitrine (garage) ================== */
let showcase = null;
function setShowcase() {
  if (showcase) scene.remove(showcase);
  const col = skinColors(S.vehicule, S.skin); const m = buildCar(S.vehicule, col[0], col[1], col[2]); showcase = m.g; showcase.userData.sh = m.sh; m.sh.visible = !renderer.shadowMap.enabled;
  markShadows(showcase, true, false); m.sh.castShadow = false; showcase.position.set(0, 3, 0); const bb = new THREE.Box3().setFromObject(showcase).getSize(new THREE.Vector3()); showcase.userData.k = clamp(Math.max(bb.z, bb.x * 1.6, bb.y * 2) / 5, .55, 2.1); scene.add(showcase);
}
function hideShowcase() { if (showcase) { scene.remove(showcase); showcase = null; } }

/* ================== Écrans ================== */
function showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); if (id === 'sTitre') requestAnimationFrame(() => avPreview(S.av, 'avSlotT')); }
function alertMsg(m) { $('toast').textContent = m; $('toast').classList.add('on'); clearTimeout(alertMsg.t); alertMsg.t = setTimeout(() => $('toast').classList.remove('on'), 2600); }
function toMenu() {
  D.on = false; G.mode = 'menu'; G.paused = false; G.ended = true; clearCars(); clearProj(); $('hud').classList.remove('on'); SFX.engine(0, false);
  if (G.net) { G.net = null; } makePickups(); makeProps(); hideShowcase(); renderTitle(); showScreen('sTitre');
}
function renderTitle() {
  const xi = xpInfo();
  $('tNiv').textContent = L.level + ' ' + xi.n; $('tVag').textContent = L.wave + ' ' + S.vague; $('tVic').textContent = S.victoires + ' ' + (S.victoires === 1 ? L.win1 : L.winN);
  $('tTier').innerHTML = tierHTML(S.rp) + ` · ${S.rp} ${L.rp}`; $('tTag').innerHTML = `${S.clan ? `<i class="cl">[${esc(S.clan)}]</i> ` : ''}${esc(pseudo())}`; $('tAvNom').textContent = L.avNames[S.av.id] || ''; $('tXp').style.width = (xi.x / xi.need * 100) + '%'; $('tXpTxt').textContent = `${xi.x} / ${xi.need} XP`;
}
const vUnlocked = k => { const v = VEH[k]; return v.ach ? !!S.ach[v.ach] : v.tier != null ? tierOf(S.rpMax) >= v.tier : xpInfo().n >= v.niv; };
const vLockTxt = k => { const v = VEH[k]; return v.ach ? '🏆 ' + L.ach[v.ach][0] : v.tier != null ? TIERS[v.tier].ic + ' ' + TIERS[v.tier].nom + ' (' + L.ranked + ')' : '🔒 ' + L.level + ' ' + v.niv; };
const sUnlocked = s => s.ach ? !!S.ach[s.ach] : xpInfo().n >= s.niv;
let garageFrom = 'solo';
function openGarage(from) { garageFrom = from; G.mode = 'garage'; if (!vUnlocked(S.vehicule)) S.vehicule = 'megabite'; setShowcase(); renderGarage(); showScreen('sGarage'); }
function renderGarage() {
  $('vgrid').innerHTML = VKEYS.map(k => { const v = VEH[k], ok = vUnlocked(k); return `<div class="vcard ${S.vehicule === k ? 'sel' : ''} ${ok ? '' : 'lock'}" data-v="${k}"><i style="background:#${v.coul.toString(16).padStart(6, '0')}"></i><div>${v.nom}${ok ? '' : `<em>${vLockTxt(k)}</em>`}</div></div>`; }).join('');
  const v = VEH[S.vehicule]; $('vDesc').textContent = v.desc;
  const bar = (n, x) => `<div class="stat"><label>${n}</label><div class="bar"><i style="width:${clamp(x, .05, 1) * 100}%"></i></div></div>`;
  $('vStats').innerHTML = bar(L.speed, (v.vitesse - 18) / 19) + bar(L.armor, v.blindage / 240) + bar(L.shield, VSH(v) / 70) + bar(L.handling, (v.maniement - 1.2) / 2.7) + bar(L.weight, v.masse / 2.6) + vitalsBreak(v);
  $('vSpec').innerHTML = `<b>${L.special} : ${v.special.nom}</b> — ${v.special.desc}`;
  $('skins').innerHTML = SKINS.map(s => { const ok = sUnlocked(s); const c = s.c ? '#' + s.c.toString(16).padStart(6, '0') : '#' + v.coul.toString(16).padStart(6, '0'), a = s.a ? '#' + s.a.toString(16).padStart(6, '0') : '#' + v.acc.toString(16).padStart(6, '0');
    return `<div class="skin ${S.skin === s.id ? 'sel' : ''} ${ok ? '' : 'lock'}" data-s="${s.id}" title="${s.nom}" style="background:linear-gradient(135deg,${c} 55%,${a} 55%)">${ok ? '' : s.ach ? '🏆' : '🔒'}</div>`; }).join('');
  $('skinNom').textContent = (SKINS.find(s => s.id === S.skin) || SKINS[0]).nom;
  const lo = myLoadout(), a = itemById(S.equip.arme), mods = S.equip.mods.map(itemById).filter(Boolean);
  $('vLoad').innerHTML = `<span style="color:${RAR[lo.arme.r].coul}">${ARMES[lo.arme.b].ic} ${ARMES[lo.arme.b].nom}</span>${mods.map(m => ` · <span style="color:${RAR[m.r].coul}">${itemIc(m)} ${itemNom(m)}</span>`).join('')}`;
  $('bGo').textContent = garageFrom === 'lobby' ? L.confirm : L.letsGo;
  $('gMode').style.display = garageFrom === 'lobby' ? 'none' : ''; document.querySelectorAll('#gMode button').forEach(b => b.classList.toggle('sel', (b.dataset.m === 'r') === S.ranked)); $('gModeNote').textContent = S.ranked ? `${L.rankedNote} ${TIERS[tierOf(S.rp)].ic} ${TIERS[tierOf(S.rp)].nom} · ${S.rp} ${L.rp}` : `${L.wave} ${S.vague}`;
}
$('gMode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.ranked = b.dataset.m === 'r'; save(); SFX.clic(); renderGarage(); });
$('vgrid').addEventListener('click', e => { const el = e.target.closest('.vcard'); if (!el) return; const k = el.dataset.v; if (!vUnlocked(k)) { alertMsg(vLockTxt(k)); return; } S.vehicule = k; save(); SFX.clic(); setShowcase(); renderGarage(); });
$('skins').addEventListener('click', e => { const el = e.target.closest('.skin'); if (!el) return; const s = SKINS.find(x => x.id === el.dataset.s); if (!sUnlocked(s)) { alertMsg(s.ach ? L.achLock : L.unlockAt(s.niv)); return; } S.skin = s.id; save(); SFX.clic(); setShowcase(); renderGarage(); });
$('bGo').onclick = () => { if (garageFrom === 'lobby') { if (Net.role === 'guest') Net.send(myHello()); else broadcastLobby(); G.mode = 'menu'; hideShowcase(); showScreen('sLigne'); renderLobby(); return; } startMatch(soloRoster(), 0, null); };
$('bRetour1').onclick = () => { hideShowcase(); if (garageFrom === 'lobby') { G.mode = 'menu'; showScreen('sLigne'); return; } G.mode = 'menu'; showScreen('sTitre'); };
$('bInvG').onclick = () => openInv('garage');
$('bJouer').onclick = () => openGarage('solo');
$('bStats').onclick = () => { const xi = xpInfo(); $('tblStats').innerHTML = [[L.level, xi.n], [L.totalXp, S.xp], [L.bestWave, S.meilleureVague], [L.wins, S.victoires], [L.podiums, S.podiums], [L.matches, S.parties], [L.onlineMatches, S.enLigne], [L.kills, S.kills], [L.bestKills, S.meilleursKills], [L.dmgDealt, S.degats], [L.items, S.items.length], [L.ranked + ' ' + L.wins.toLowerCase(), S.rankedWins], [L.achievements, Object.keys(S.ach).length + ' / ' + ACH.length]].map(r => `<span>${r[0]}</span><b>${r[1]}</b>`).join('');
  ensureRivals(); const board = [...S.rivals.map(r => ({ n: r.n, rp: r.rp })), { n: pseudo() + ' (' + L.you + ')', rp: S.rp, me: 1 }].sort((a, b) => b.rp - a.rp);
  $('board').innerHTML = board.map((r, i) => `<div class="${r.me ? 'moi' : ''}"><b>${i + 1}</b><span>${esc(r.n)}</span>${tierHTML(r.rp)}<small>${r.rp}</small></div>`).join('');
  $('statTier').innerHTML = `${tierHTML(S.rp)} · ${S.rp} ${L.rp}`; showScreen('sStats'); };
$('bRetour2').onclick = () => showScreen('sTitre');
// Paramètres
function renderParam() {
  $('iPseudo').value = S.pseudo; $('bSon').textContent = S.son ? L.soundOn : L.soundOff;
  document.querySelectorAll('#gfx button').forEach(b => b.classList.toggle('sel', b.dataset.q === S.gfx));
  $('tSave').value = ''; $('saveMsg').textContent = ''; $('bReset').textContent = L.resetAll; resetArm = false;
}
let resetArm = false;
$('bParam').onclick = () => { renderParam(); showScreen('sParam'); };
$('iPseudo').addEventListener('input', () => { S.pseudo = $('iPseudo').value.replace(/[<>]/g, '').slice(0, 12); save(); });
$('bSon').onclick = () => { S.son = !S.son; save(); SFX.setOn(S.son); renderParam(); };
$('gfx').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.gfx = b.dataset.q; save(); applyGfx(); renderParam(); });
$('bExport').onclick = () => { const c = exportCode(); $('tSave').value = c; $('tSave').select(); try { navigator.clipboard.writeText(c).then(() => $('saveMsg').textContent = L.copied, () => $('saveMsg').textContent = L.copyManual); } catch (e) { $('saveMsg').textContent = L.copyManual; } };
$('bImport').onclick = () => { try { const d = parseCode($('tSave').value); S = d; save(); applyGfx(); renderParam(); renderTitle(); $('saveMsg').textContent = L.imported(xpInfo().n, S.items.length); SFX.levelUp(); } catch (e) { $('saveMsg').textContent = '⚠️ ' + e.message; } };
$('bReset').onclick = () => { if (!resetArm) { resetArm = true; $('bReset').textContent = L.resetConfirm; return; } const g = S.gfx; S = DEF(); S.gfx = g; save(); renderParam(); renderTitle(); alertMsg(L.resetDone); };
$('bRetour3').onclick = () => { renderTitle(); showScreen('sTitre'); };
// Pause
function pauseGame() { G.paused = true; $('bSonP').textContent = S.son ? L.soundOn : L.soundOff; $('pauseNote').style.display = G.net ? '' : 'none'; showScreen('sPause'); }
$('pauseB').onclick = pauseGame;
$('bReprendre').onclick = () => { G.paused = false; showScreen(null); };
$('bSonP').onclick = () => { S.son = !S.son; save(); SFX.setOn(S.son); $('bSonP').textContent = S.son ? L.soundOn : L.soundOff; };
$('bQuitter').onclick = () => { G.paused = false; if (G.net) { Net.close(); } toMenu(); };
// Fin
$('bSuivant').onclick = () => { $('lvlUp').classList.remove('on'); if (G.net) { const role = Net.role; clearCars(); clearProj(); $('hud').classList.remove('on'); G.mode = 'menu'; G.net = null; makePickups(); makeProps(); if (!Net.role) { toMenu(); return; } showScreen('sLigne'); lnUI('salle'); renderLobby(); if (role === 'host') broadcastLobby(); return; } startMatch(soloRoster(), 0, null); };
$('bGarage2').onclick = () => { $('lvlUp').classList.remove('on'); if (G.net) { $('bSuivant').onclick(); return; } clearCars(); clearProj(); $('hud').classList.remove('on'); makePickups(); makeProps(); openGarage('solo'); };
$('bMenu').onclick = () => { $('lvlUp').classList.remove('on'); if (G.net) Net.close(); toMenu(); };
$('bLuOk').onclick = () => $('lvlUp').classList.remove('on');

/* ---- Succès ---- */
function renderAch() {
  $('achList').innerHTML = ACH.map(a => { const v = Math.min(a.val(), a.goal), ok = !!S.ach[a.id], rw = a.rw;
    const eq = rw.t === 'skin' ? S.skin === rw.id : S.style[rw.t] === rw.id;
    return `<div class="ach ${ok ? 'ok' : ''}"><span class="ic">${a.ic}</span><div class="ab"><b>${L.ach[a.id][0]}</b><small>${L.ach[a.id][1]}</small>
      <div class="hbar t"><i style="width:${v / a.goal * 100}%"></i></div><small>${v} / ${a.goal}</small></div>
      <div class="rw"><small>${L.exclusive} · ${rwType(rw)}</small><b>${rwName(rw)}</b>${a.veh ? `<small>+ 🚗 ${VEH[a.veh].nom}</small>` : ''}${a.av ? `<small>+ 👤 ${L.avNames[a.av]}</small>` : ''}${ok ? `<button class="mini" data-a="${a.id}">${eq ? '✔ ' + L.equipped : L.equip}</button>` : `<small>🔒 ${L.locked}</small>`}</div></div>`; }).join('');
  $('achCount').textContent = `${Object.keys(S.ach).length} / ${ACH.length} ${L.unlocked.toLowerCase()}`;
}
$('achList').addEventListener('click', e => { const b = e.target.closest('button[data-a]'); if (!b) return; const a = ACH.find(x => x.id === b.dataset.a); if (!a || !S.ach[a.id]) return; const rw = a.rw;
  if (rw.t === 'skin') S.skin = S.skin === rw.id ? 'origine' : rw.id; else S.style[rw.t] = S.style[rw.t] === rw.id ? '' : rw.id;
  if (rw.t === 'horn' && S.style.horn) SFX.horn(S.style.horn); save(); SFX.clic(); renderAch(); });
$('bAch').onclick = () => { checkAch(); renderAch(); showScreen('sAch'); };
$('bRetour5').onclick = () => { renderTitle(); showScreen('sTitre'); };

/* ---- Inventaire ---- */
let invSel = null, invSlot = 'arme', invFrom = 'menu';
function openInv(from) { invFrom = from; invSel = null; renderInv(); showScreen('sInv'); }
function renderInv() {
  const slot = (key, u, label) => { const it = u ? itemById(u) : null; return `<div class="slot ${invSlot === key ? 'sel' : ''} ${it ? 'r' + it.r : ''}" data-slot="${key}"><small>${label}</small>${it ? `<span class="ic">${itemIc(it)}</span><b>${esc(itemNom(it))}</b><small style="color:${RAR[it.r].coul}">${RAR[it.r].nom}</small>` : `<span class="ic" style="opacity:.4">＋</span><small>${L.empty}</small>`}</div>`; };
  $('invSlots').innerHTML = slot('arme', S.equip.arme, L.slotWeapon) + slot('m0', S.equip.mods[0], L.slotMod + ' 1') + slot('m1', S.equip.mods[1], L.slotMod + ' 2');
  const lo = myLoadout(); $('invSum').innerHTML = `${L.gunDps} <b>${Math.round(lo.arme.dmg * lo.arme.balles * lo.arme.cad)}</b> · ${L.hpBonus} <b>+${lo.hp}%</b> · ${L.shBonus} <b>+${lo.sh}</b> · ${L.speedBonus} <b>+${lo.vit}%</b>` + vitalsBreak(VEH[S.vehicule]);
  const items = [...S.items].sort((a, b) => b.r - a.r || (a.t > b.t ? 1 : -1));
  const want = invSlot === 'arme' ? 'arme' : 'mod';
  $('invList').innerHTML = items.map(it => { const eq = it.u === S.equip.arme || S.equip.mods.includes(it.u); return itemHTML(it).replace('class="item', `class="item ${invSel === it.u ? 'sel' : ''} ${it.t !== want ? 'dim' : ''} ${eq ? 'eq' : ''}`); }).join('') || `<p class="sub">${L.noItems}</p>`;
  const it = invSel && itemById(invSel); const eq = it && (it.u === S.equip.arme || S.equip.mods.includes(it.u));
  $('bEquip').disabled = !it || eq; $('bRecycle').disabled = !it || eq; $('bRecycle').textContent = L.recycle;
  $('invCount').textContent = `${S.items.length} ${L.itemsWord}`;
}
$('invSlots').addEventListener('click', e => { const el = e.target.closest('.slot'); if (!el) return; invSlot = el.dataset.slot; invSel = null; SFX.clic(); renderInv(); });
$('invList').addEventListener('click', e => { const el = e.target.closest('.item'); if (!el) return; invSel = +el.dataset.u; const it = itemById(invSel); if (it && it.t === 'arme') invSlot = 'arme'; else if (it && invSlot === 'arme') invSlot = !S.equip.mods[0] ? 'm0' : !S.equip.mods[1] ? 'm1' : 'm0'; SFX.clic(); renderInv(); });
$('bEquip').onclick = () => { const it = invSel && itemById(invSel); if (!it) return; if (it.t === 'arme') S.equip.arme = it.u; else { const i = invSlot === 'm1' ? 1 : 0; S.equip.mods[i] = it.u; if (S.equip.mods[1 - i] === it.u) S.equip.mods[1 - i] = 0; } save(); SFX.pick(); invSel = null; renderInv(); };
let recArm = 0;
$('bRecycle').onclick = () => { const it = invSel && itemById(invSel); if (!it) return; if (recArm !== it.u) { recArm = it.u; $('bRecycle').textContent = L.recycleConfirm; return; } S.items = S.items.filter(x => x.u !== it.u); recArm = 0; invSel = null; save(); renderInv(); };
$('bRetour4').onclick = () => { if (invFrom === 'garage') { renderGarage(); showScreen('sGarage'); } else showScreen('sTitre'); };
$('bInv').onclick = () => openInv('menu');

/* ---- Salle en ligne ---- */
function lnUI(st) { $('lnChoix').style.display = st === 'choix' ? '' : 'none'; $('lnSalle').style.display = st === 'salle' ? '' : 'none'; renderLobby(); }
function renderLobby() {
  const host = Net.role === 'host'; const l = host ? lobbyList() : Net.lobby;
  const nb = Math.max(l.length, Math.min(MAX_JOUEURS, Net.slots));
  let h = l.map(p => `<div class="pl ${p.hote ? 'hote' : ''}"><img class="pav" src="${avPortrait(p.av)}" alt=""><b>${p.hote ? '👑 ' : ''}${p.cl ? `<i class="cl">[${esc(p.cl)}]</i> ` : ''}${esc(p.nom)}${p.ti && L.titles[p.ti] ? `<small class="ti">« ${L.titles[p.ti]} »</small>` : ''}</b><small>${tierHTML(p.rp || 0)} · ${VEH[p.v] ? VEH[p.v].nom : ''} · ${L.lv} ${p.niv || 1}</small></div>`).join('');
  for (let i = l.length; i < nb; i++) h += `<div class="pl bot"><span>🤖</span><b>${L.bot}</b><small>${L.botFill}</small></div>`;
  $('lnList').innerHTML = h; $('lnNb').textContent = `${l.length} ${l.length > 1 ? L.humans : L.human} · ${nb} ${L.vehicles}`;
  $('lnHost').style.display = host ? '' : 'none'; $('lnGuest').style.display = host || !Net.role ? 'none' : '';
  document.querySelectorAll('#lnSlots button').forEach(b => b.classList.toggle('sel', +b.dataset.n === Net.slots));
  document.querySelectorAll('#lnMode button').forEach(b => b.classList.toggle('sel', (b.dataset.m === 'r') === !!Net.ranked));
  $('lnModeTxt').innerHTML = `${L.modeLabel}: <b>${Net.ranked ? L.ranked : L.casual}</b>`;
}
$('bEnLigne').onclick = () => { showScreen('sLigne'); if (!Net.role) { lnUI('choix'); lnMsg(L.onlineIntro); } else lnUI('salle'); };
$('bCreer').onclick = () => hostCreate();
$('bRejoindre').onclick = () => guestJoin($('iCode').value);
$('iCode').addEventListener('keydown', e => { if (e.key === 'Enter') guestJoin($('iCode').value); });
$('lnSlots').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; Net.slots = +b.dataset.n; broadcastLobby(); });
$('lnMode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || Net.role !== 'host') return; Net.ranked = b.dataset.m === 'r'; broadcastLobby(); });
$('bLancer').onclick = () => { if (!Net.peer) return; hostStart(); };
$('bLnVeh').onclick = () => openGarage('lobby');
$('bLnQuit').onclick = () => { Net.close(); lnUI('choix'); lnMsg(L.onlineIntro); };
$('bLnRetour').onclick = () => { if (Net.role) Net.close(); showScreen('sTitre'); renderTitle(); };

/* ================== Emotes & live HUD head ================== */
let emoScene = null, emoCam = null, emoModel = null, emoRect = null, emoLastAuto = 0, emoLastMan = 0;
function emoSetup() {
  const mode = S.gfx === 'ultra' ? 'live' : S.gfx === 'low' ? 'off' : 'flat';
  const box = $('emoBox'); box.className = mode; document.body.classList.toggle('noemo', mode === 'off'); $('emoBub').textContent = '';
  if (mode === 'flat') $('emoImg').src = avPortrait(G.me.av);
  if (emoModel) { emoScene.remove(emoModel); disposeAvatar(emoModel); emoModel = null; }
  if (mode !== 'live') return;
  if (!emoScene) { emoScene = new THREE.Scene(); emoScene.add(new THREE.HemisphereLight(0xd8c8ff, 0x402030, 2.4)); const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(2, 4, 5); emoScene.add(d); const rim = new THREE.DirectionalLight(0xff2bd6, 2.5); rim.position.set(-4, 2, -3); emoScene.add(rim); emoCam = new THREE.PerspectiveCamera(30, 1, .1, 20); emoCam.position.set(0, 1.66, 3.05); emoCam.lookAt(0, 1.6, 0); }
  emoModel = buildAvatar(G.me.av); emoScene.add(emoModel); emoRect = null;
}
function emoRender() {
  if (!emoModel || !G.me || !(G.mode === 'play' || G.mode === 'countdown') || S.gfx !== 'ultra') return;
  if (!emoRect) { const r = $('emoBox').getBoundingClientRect(); if (!r.width) return; emoRect = r; }
  const t = performance.now() / 1000; emoModel.userData.anim(t); emoModel.rotation.y = -.2;
  const r = emoRect, H = innerHeight;
  renderer.setScissorTest(true); renderer.setViewport(r.left, H - r.bottom, r.width, r.height); renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
  const ac = renderer.autoClear; renderer.autoClear = false; renderer.clearDepth(); renderer.render(emoScene, emoCam); renderer.autoClear = ac;
  renderer.setScissorTest(false); renderer.setViewport(0, 0, innerWidth, innerHeight);
}
addEventListener('resize', () => { emoRect = null; });
function showEmote(c, name) {
  if (!c || !EMOJI[name]) return; c.emo = name;
  if (c === G.me) { if (emoModel) emoModel.userData.emote(name); const b = $('emoBub'); b.textContent = EMOJI[name]; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); clearTimeout(showEmote.t); showEmote.t = setTimeout(() => b.classList.remove('pop'), 2600); }
  else if (c.tagEmo) { const e = c.tagEmo; e.textContent = EMOJI[name]; e.classList.remove('on'); void e.offsetWidth; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 2600); }
}
function netEmote(c, name) { showEmote(c, name); if (G.net === 'host') emit({ e: 'emo', c: c.id, k: EMOTES.indexOf(name) }); }
function emoteMe(name, why) { // why: 'manual' | 'force' | undefined (auto)
  const c = G.me; if (!c || !(G.mode === 'play' || G.mode === 'countdown') || !EMOJI[name]) return false; const now = performance.now();
  if (why === 'manual') { if (now - emoLastMan < 1000) return false; emoLastMan = now; } else if (why !== 'force' && now - emoLastAuto < 3500) return false;
  emoLastAuto = now; G.emoN = (G.emoN || 0) + 1;
  if (G.net === 'client') { showEmote(c, name); Net.send({ t: 'emo', k: EMOTES.indexOf(name) }); } else netEmote(c, name);
  return true;
}
function emoHud(c) { // auto-trigger reactions from the HUD loop
  if (G.lastHp == null || !c.alive) { G.lastHp = c.hp; if (!c.alive) G.screamed = 0; }
  if (c.alive && c.hp < G.lastHp - 6) { if (c.hp < c.maxHp * .25 && !G.screamed) { G.screamed = 1; emoteMe('scream', 'force'); } else if (Math.random() < .35) emoteMe(pick(['rage', 'huff'])); }
  if (c.hp > c.maxHp * .5) G.screamed = 0;
  G.lastHp = c.hp;
  if (c.w.mega && !G.lastMega) emoteMe(pick(['starstruck', 'mindblown']), 'force'); G.lastMega = c.w.mega;
}
function buildWheel() {
  const w = $('emoWheel'), n = EMOTES.length; w.innerHTML = `<div class="ew">${EMOTES.map((e, i) => { const a = i / n * Math.PI * 2 - Math.PI / 2; return `<button data-e="${e}" style="left:calc(50% + ${Math.cos(a) * 112}px);top:calc(50% + ${Math.sin(a) * 112}px)">${EMOJI[e]}</button>`; }).join('')}<span>${L.emotes}</span></div>`;
}
function toggleWheel(on) { const w = $('emoWheel'); if (on == null) on = !w.classList.contains('on'); if (on && !w.innerHTML) buildWheel(); w.classList.toggle('on', on); }
$('emoWheel').addEventListener('pointerdown', e => { e.stopPropagation(); const b = e.target.closest('button[data-e]'); if (b) emoteMe(b.dataset.e, 'manual'); toggleWheel(false); });
$('bEmo').addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); toggleWheel(); });
$('emoBox').addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); toggleWheel(); });
addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key.toLowerCase() === 't' && (G.mode === 'play' || G.mode === 'countdown')) toggleWheel(); });

/* ================== STIMM: avatars, account & captain draft ================== */
const BOT_CLANS = ['NOVA', 'VOID', 'HEX', 'RAID', 'GLTCH', 'ZERO'];
const TEAM_GOAL = 25;
function botAv() { const a = pick(AVATARS.filter(x => !x.ach)); return { id: a.id, a: '', n: Math.random() < .5 ? pick(AV_NEON) : '' }; }
function teamKills() { const t = [0, 0]; for (const c of G.cars) if (c.team === 0 || c.team === 1) t[c.team] += c.kills; return t; }
const teamName = i => i ? L.teamB : L.teamA;
const avUnlocked = id => { const a = AVATARS.find(x => x.id === id); return !!a && (!a.ach || !!S.ach[a.ach]); };

// --- live 3D avatar preview (title + profile) ---
let avR = null, avScene = null, avCam = null, avModel = null, avKey = '';
function avPreview(av, slot) {
  const cv = $('avCv'); if (cv.parentNode !== $(slot)) $(slot).appendChild(cv);
  if (!avR) { avR = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); avR.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    avScene = new THREE.Scene(); avScene.add(new THREE.HemisphereLight(0xd8c8ff, 0x402030, 2.2)); const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(2, 4, 5); avScene.add(d);
    const rim = new THREE.DirectionalLight(0xff2bd6, 2.5); rim.position.set(-4, 2, -3); avScene.add(rim); avCam = new THREE.PerspectiveCamera(30, 1, .1, 50); }
  const w = cv.clientWidth || 120, h = cv.clientHeight || 140; avR.setSize(w, h, false); avCam.aspect = w / h; avCam.updateProjectionMatrix();
  const sm = slot === 'avSlotT'; avCam.position.set(0, sm ? 1.7 : 1.55, sm ? 3.4 : 4.3); avCam.lookAt(0, sm ? 1.4 : 1.2, 0);
  av = sanAv(av); const key = av.id + av.a + av.n; if (key === avKey && avModel) return; avKey = key;
  if (avModel) { avScene.remove(avModel); disposeAvatar(avModel); } avModel = buildAvatar(av); avScene.add(avModel);
}
function avFrame(now) {
  if (!avR || !avModel || !($('sTitre').classList.contains('on') || $('sCompte').classList.contains('on'))) return;
  const t = now / 1000; avModel.userData.anim(t); avModel.rotation.y = Math.sin(t * .4) * .35; avR.render(avScene, avCam);
}

// --- account / profile screen ---
let avEdit = null, acctFirst = false;
function openAccount(first) {
  acctFirst = !!first; avEdit = { ...S.av };
  $('cTitre').textContent = first ? L.createAccount : L.editAccount; $('bCompteOk').textContent = first ? L.createBtn : L.saveProfile;
  $('bCompteRet').style.display = first ? 'none' : ''; $('cTag').value = S.pseudo; $('cClan').value = S.clan; $('cMsg').textContent = '';
  showScreen('sCompte'); renderAccount();
}
function renderAccount() {
  const def = AVATARS.find(a => a.id === avEdit.id);
  $('cAvGrid').innerHTML = AVATARS.map(a => { const ok = avUnlocked(a.id); return `<button class="avb ${a.id === avEdit.id ? 'sel' : ''} ${ok ? '' : 'lock'}" data-av="${a.id}"><img src="${avPortrait({ id: a.id })}" alt=""><small>${L.avNames[a.id]}</small>${ok ? '' : `<em>🔒</em>`}</button>`; }).join('');
  const sw = (arr, cur, dflt, k) => [''].concat(arr).map(c => `<button class="swb ${(cur || '') === c ? 'sel' : ''}" data-k="${k}" data-c="${c}" style="background:${c || dflt}">${c ? '' : '★'}</button>`).join('');
  $('cOut').innerHTML = sw(AV_OUTFIT, avEdit.a, def.a, 'a'); $('cNeon').innerHTML = sw(AV_NEON, avEdit.n, def.n, 'n');
  $('cAvNom').innerHTML = `<b>${L.avNames[avEdit.id]}</b>${def.ach ? `<small>🏆 ${L.ach[def.ach][0]}</small>` : ''}`;
  avPreview(avEdit, 'avSlotC');
}
$('cAvGrid').addEventListener('click', e => { const b = e.target.closest('button[data-av]'); if (!b) return; const id = b.dataset.av;
  if (!avUnlocked(id)) { const a = AVATARS.find(x => x.id === id); $('cMsg').textContent = L.avLockedBy(L.ach[a.ach][0]); return; }
  avEdit = { id, a: '', n: '' }; $('cMsg').textContent = ''; SFX.clic(); renderAccount(); });
['cOut', 'cNeon'].forEach(el => $(el).addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b) return; avEdit[b.dataset.k] = b.dataset.c; renderAccount(); }));
$('bCompteOk').onclick = () => {
  const tag = $('cTag').value.replace(/[<>]/g, '').trim().slice(0, 12); if (!tag) { $('cMsg').textContent = L.needTag; return; }
  S.pseudo = tag; S.clan = sanClan($('cClan').value); S.av = sanAv(avEdit); S.acct = 1; save(); SFX.levelUp(); renderTitle(); showScreen('sTitre');
};
$('bCompteRet').onclick = () => { renderTitle(); showScreen('sTitre'); };
$('bProfil').onclick = () => openAccount(false);

// --- captain draft ---
const D = { on: false, ents: [], caps: [], teams: [[], []], pool: [], turn: 0, t: 0, done: false };
const dEnt = k => D.ents.find(e => e.key === k);
const myKey = () => Net.role === 'guest' ? (Net.peer && Net.peer.id) : 'me';
const dPicker = () => D.caps[D.turn % 2];
function draftStart() {
  const res = G.lastRes || [], ros = G.roster || [];
  let ents = ros.map(r => { const rr = res.find(x => x.id === r.id) || {}; return { ...r, local: false, team: -1, key: r.peer ? r.peer : r.bot ? 'b' + r.id : 'me', kl: rr.kills | 0, rk: rr.rank || 99 }; });
  if (Net.role === 'host') {
    ents = ents.filter(e => !e.peer || Net.conns.has(e.peer));
    for (const [pid, p] of Net.conns) if (!ents.some(e => e.peer === pid)) ents.push({ nom: p.nom, v: p.v, sk: p.sk, lo: p.lo || botLoadout(0), peer: pid, tr: p.tr, ti: p.ti, av: p.av, cl: p.cl, key: pid, kl: 0, rk: 99 });
  }
  const me = ents.find(e => e.key === 'me'); if (me) Object.assign(me, { nom: pseudo(), v: S.vehicule, sk: S.skin, lo: myLoadout(), tr: S.style.trail, ti: S.style.title, av: S.av, cl: S.clan });
  ents.sort((a, b) => a.rk - b.rk || b.kl - a.kl);
  Object.assign(D, { on: true, ents, caps: [ents[0].key, ents[1].key], teams: [[ents[0].key], [ents[1].key]], pool: ents.slice(2).map(e => e.key), turn: 0, t: 0, done: false });
  clearCars(); clearProj(); $('hud').classList.remove('on'); $('lvlUp').classList.remove('on'); G.mode = 'draft'; SFX.engine(0, false);
  showScreen('sDraft'); draftSync();
}
function draftAuto() { const p = D.pool.map(dEnt).sort((a, b) => a.rk - b.rk || b.kl - a.kl); return p[0] && p[0].key; }
function draftPick(by, key) {
  if (!D.on || D.done || by !== dPicker() || !D.pool.includes(key)) return false;
  D.pool = D.pool.filter(k => k !== key); D.teams[D.turn % 2].push(key); D.turn++; D.t = 0; SFX.pick();
  if (!D.pool.length) { D.done = true; setTimeout(draftFinish, 1800); }
  draftSync(); return true;
}
function draftTick(dt) {
  if (!D.on || D.done || Net.role === 'guest') return;
  D.t += dt; const e = dEnt(dPicker()); if (!e) return;
  const away = e.peer && !Net.conns.has(e.peer);
  if (D.t >= (e.bot || away ? .9 : 15)) draftPick(e.key, draftAuto());
}
function draftSync() {
  if (Net.role === 'host') Net.broadcast({ t: 'draft', d: { ents: D.ents.map(e => ({ key: e.key, nom: e.nom, cl: e.cl || '', av: e.av, kl: e.kl, bot: e.bot ? 1 : 0 })), caps: D.caps, teams: D.teams, pool: D.pool, turn: D.turn, done: D.done } });
  renderDraft();
}
function guestDraft(d) {
  if (!d || !Array.isArray(d.ents)) return;
  Object.assign(D, { on: true, ents: d.ents.map(e => ({ ...e, key: String(e.key), av: sanAv(e.av) })), caps: d.caps || [], teams: d.teams || [[], []], pool: d.pool || [], turn: d.turn | 0, done: !!d.done });
  if (G.mode !== 'draft') { clearCars(); clearProj(); $('hud').classList.remove('on'); $('lvlUp').classList.remove('on'); G.mode = 'draft'; SFX.engine(0, false); }
  showScreen('sDraft'); renderDraft();
}
function renderDraft() {
  const mk = myKey(), pk = dPicker(), mine = !D.done && pk === mk;
  const card = (k, cap) => { const e = dEnt(k); if (!e) return ''; return `<div class="dc ${k === mk ? 'moi' : ''}" data-k="${esc(k)}"><img src="${avPortrait(e.av)}" alt=""><div><b>${cap ? '👑 ' : ''}${e.cl ? `<i class="cl">[${esc(e.cl)}]</i> ` : ''}${esc(e.nom)}</b><small>${cap ? L.captain + ' · ' : ''}${e.kl} ${L.lastKills}</small></div></div>`; };
  $('dA').innerHTML = D.teams[0].map((k, i) => card(k, i === 0)).join(''); $('dB').innerHTML = D.teams[1].map((k, i) => card(k, i === 0)).join('');
  $('dPool').innerHTML = D.pool.map(k => card(k, false)).join('');
  $('dPool').classList.toggle('pickable', mine);
  document.querySelector('#sDraft .dTeam.tmA').classList.toggle('turn', !D.done && D.turn % 2 === 0); document.querySelector('#sDraft .dTeam.tmB').classList.toggle('turn', !D.done && D.turn % 2 === 1);
  const pe = dEnt(pk); $('dStat').textContent = D.done ? L.draftDone : mine ? L.yourPick : L.picking(pe ? pe.nom : '?');
}
$('dPool').addEventListener('click', e => { const c = e.target.closest('.dc[data-k]'); if (!c || !D.on || D.done) return; const k = c.dataset.k, mk = myKey(); if (dPicker() !== mk) return;
  if (Net.role === 'guest') Net.send({ t: 'pick', k }); else draftPick(mk, k); });
function draftFinish() {
  if (!D.on || Net.role === 'guest') return;
  const roster = []; [0, 1].forEach(t => D.teams[t].forEach(k => { const e = dEnt(k); if (!e) return; const { key, kl, rk, ...r } = e; roster.push({ ...r, id: roster.length, team: t, local: key === 'me' }); }));
  if (Net.role === 'host') {
    for (const r of roster) if (r.peer && !Net.conns.has(r.peer)) { r.peer = null; r.bot = true; r.k = .6; }
    hostLaunch(roster);
  } else startMatch(roster, roster.find(r => r.local).id, null);
}
$('bDraft').onclick = () => draftStart();
$('bDraftMenu').onclick = () => { D.on = false; if (Net.role) Net.close(); toMenu(); };

/* ================== Démarrage ================== */
function applyTexts() { document.querySelectorAll('[data-t]').forEach(el => { const v = L[el.dataset.t]; if (typeof v === 'string') el.innerHTML = v; }); document.querySelectorAll('[data-ph]').forEach(el => el.placeholder = L[el.dataset.ph]); document.documentElement.lang = L._lang; }
applyTexts();
blocks.forEach(b => { if (b.mesh) markShadows(b.mesh, true, true); });
world.children.forEach(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry') o.receiveShadow = true; });
checkAch(); ensureRivals(); save();
makePickups(); makeProps();
if (!S.gfx) { S.gfx = 'high'; save(); }
applyGfx(); renderTitle();
if (!S.acct) openAccount(true); else showScreen('sTitre');
requestAnimationFrame(frame);
window.__sgsPickups = () => pickups;
window.__sgs = { respawn, soundInd, sInd, emoteMe, toggleWheel, get emoModel() { return emoModel; }, D, draftStart, draftPick, openAccount, avPortrait, teamKills, get L() { return L; },
  G, checkAch, ACH, TIERS, tierOf, get S() { return S; }, Net, IN, VEH, startMatch, soloRoster, killCar, damage, myLoadout, xpInfo, rollItem, addItem, save, exportCode, parseCode, applyGfx, showLevelUp, toMenu };
