const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Noryn_Client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
const Noryn_App = Express();
const Noryn_Port = process.env.PORT || 3000;
Noryn_App.get('/', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../Website/Run.html'));
});
Noryn_App.listen(Noryn_Port, () => {
  console.log(`[Noryn] Website online on port ${Noryn_Port}`);
});
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn'
];
let Noryn_Status_Index = 0;
let Noryn_Status_Interval = null;
function Noryn_Update_Status() {
  if (!Noryn_Client.user) return;
  Noryn_Client.user.setPresence({
    activities: [
      {
        name: Noryn_Status_List[Noryn_Status_Index],
        type: ActivityType.Custom,
      },
    ],
    status: 'dnd',
  });
  Noryn_Status_Index = (Noryn_Status_Index + 1) % Noryn_Status_List.length;
}
async function Noryn_Login() {
  try {
    await Noryn_Client.login(process.env.Key);
    Noryn_Update_Status(); 
  } catch (err) {
    console.error('[Noryn] Login failed:', err);
  }
}
Noryn_Client.on('ready', () => {
  console.log(`[Noryn] Logged in as ${Noryn_Client.user.tag}`);
  if (Noryn_Status_Interval) clearInterval(Noryn_Status_Interval);
  setTimeout(() => {
    Noryn_Update_Status();
    Noryn_Status_Interval = setInterval(() => {
      Noryn_Update_Status();
    }, 10000);
  }, 1500);
});
Noryn_Client.on('shardResume', () => {
  console.log('[Noryn] Shard resumed → fixing status');
  Noryn_Update_Status();
});
Noryn_Client.on('reconnecting', () => {
  console.log('[Noryn] Reconnecting...');
});
Noryn_Login();
