const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Web_App = Express();
const Noryn_Port = process.env.PORT || 3000;
Web_App.get('/', (req, res) => { res.sendFile(Path.join(__dirname, '../../Website/Run.html')); });
Web_App.listen(Noryn_Port, () => { console.log(`[Notify] - Website online on port ${Noryn_Port}`); });
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn',
];
let Noryn_Status_Index = 0;
const Noryn_Log_Path = '1512566838834499654'; 
const Monitor_Target = ['1508521345409880305', '1508828918327545946'];
let First_Cache = null;
let Second_Cache = null;
const Noryn_Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
});
const Noryn_Client_2 = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
});
function Noryn_Update_Status() {
  const Current_Status = Noryn_Status_List[Noryn_Status_Index];
  if (Noryn_Client.user) {
    Noryn_Client.user.setPresence({
      activities: [{ name: Current_Status, type: ActivityType.Custom }],
      status: 'dnd',
    });
  }
  if (Noryn_Client_2.user) {
    Noryn_Client_2.user.setPresence({
      activities: [{ name: Current_Status, type: ActivityType.Custom }],
      status: 'dnd',
    });
  }
  Noryn_Status_Index = (Noryn_Status_Index + 1) % Noryn_Status_List.length;
}
async function Handle_Presence_Change(Real_Bot_Client, Log_Path, Old_Presence, New_Presence) {
  if (!New_Presence || !New_Presence.userId) return;
  const User_Id = New_Presence.userId;
  if (User_Id !== Real_Bot_Client.user?.id) return;
  const Old_Status = Old_Presence?.status || 'offline';
  const New_Status = New_Presence.status || 'offline';
  if (Old_Status === New_Status) return;
  try {
    if (New_Status === 'dnd') {
      await Log_Path.send('**```[Noryn] - Offline 🔴 Connection lost. Please restart the bot.```**');
      console.log(`[Notify] - ${Real_Bot_Client.user.tag} sent Offline message.`);
    } 
    else if (New_Status === 'online') {
      await Log_Path.send('**```[Noryn] - Online 🟢 The bot is back online and ready to use.```**');
      console.log(`[Notify] - ${Real_Bot_Client.user.tag} sent Online message.`);
    }
  } catch (Error_Logs) {
    console.error(`[Notify] - Error sending update for ${Real_Bot_Client.user?.tag || 'Unknown'}:`, Error_Logs.message);
  }
}
Noryn_Client.on('ready', async () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client.user.tag}`);
  if (!Monitor_Target.includes(Noryn_Client.user.id)) {
    Monitor_Target.push(Noryn_Client.user.id);
  }
  try { First_Cache = await Noryn_Client.channels.fetch(Noryn_Log_Path); } catch(e) {}
});
Noryn_Client_2.on('ready', async () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client_2.user.tag}`);
  if (!Monitor_Target.includes(Noryn_Client_2.user.id)) {
    Monitor_Target.push(Noryn_Client_2.user.id);
  }
  try { Second_Cache = await Noryn_Client_2.channels.fetch(Noryn_Log_Path); } catch(e) {}
});
Noryn_Client.on('presenceUpdate', (Old_Presence, New_Presence) => {if (First_Cache) Handle_Presence_Change(Noryn_Client, First_Cache, Old_Presence, New_Presence);});
Noryn_Client_2.on('presenceUpdate', (Old_Presence, New_Presence) => {if (Second_Cache) Handle_Presence_Change(Noryn_Client_2, Second_Cache, Old_Presence, New_Presence);});
Noryn_Client.on('shardResume', () => { Noryn_Update_Status(); });
Noryn_Client_2.on('shardResume', () => { Noryn_Update_Status(); });
async function Noryn_Login() {
  try {
    await Noryn_Client.login(process.env.Key);
    await Noryn_Client_2.login(process.env.Key1);
    setTimeout(() => {
      Noryn_Update_Status();
      setInterval(() => {
        Noryn_Update_Status();
      }, 10000);
    }, 2000);
  } catch (Err) {
    console.error('[Noryn] - Login failed:', Err);
  }
}
Noryn_Login();
