const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Noryn_App = Express();
const Noryn_Port = process.env.PORT || 3000;
Noryn_App.get('/', (req, res) => { res.sendFile(Path.join(__dirname, '../../Website/Run.html')); });
Noryn_App.listen(Noryn_Port, () => { console.log(`[Notify] - Website online on port ${Noryn_Port}`); });
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn',
];
let Noryn_Status_Index = 0;
const Noryn_Log_Path = '1512566838834499654'; 
const Monitor_Target = ['1508521345409880305', '1508828918327545946'];
let First_Cache = null;
let Second_Cache = null;
let Active_Alert_Messages = {};
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
async function Handle_Presence_Change(Old_Presence, New_Presence) {
  if (!New_Presence || !New_Presence.userId) return;
  const User_Id = New_Presence.userId;
  if (!Monitor_Target.includes(User_Id)) return;
  const Old_Status = Old_Presence?.status || 'offline';
  const New_Status = New_Presence.status || 'offline';
  if (Old_Status === New_Status) return;
  try {
    if (!First_Cache) { First_Cache = await Noryn_Client.channels.fetch(Noryn_Log_Path); }
    if (!Second_Cache) { Second_Cache = await Noryn_Client_2.channels.fetch(Noryn_Log_Path); }
    if (!First_Cache || !First_Cache.isTextBased()) return;
    if (!Second_Cache || !Second_Cache.isTextBased()) return;
    if (New_Status === 'dnd') {
      if (!Active_Alert_Messages[User_Id]) {
        if (User_Id === Noryn_Client.user?.id) {
          const Sent_Msg = await First_Cache.send('**```[Noryn] - Offline 🔴 Connection lost. Please restart the bot.```**');
          Active_Alert_Messages[User_Id] = Sent_Msg;
        } else if (User_Id === Noryn_Client_2.user?.id) {
          const Sent_Msg = await Second_Cache.send('**```[Noryn] - Offline 🔴 Connection lost. Please restart the bot.```**');
          Active_Alert_Messages[User_Id] = Sent_Msg;
        }
        console.log(`[Notify] - User ${User_Id} went Offline.`);
      }
    } 
    else if (New_Status === 'online') {
      if (Active_Alert_Messages[User_Id]) {
        try {
          await Active_Alert_Messages[User_Id].delete();
          Active_Alert_Messages[User_Id] = null;
        } catch (Delete_Error) {
          console.error(`[Notify] - Could not delete old offline message:`, Delete_Error.message);
        }
      }
      if (User_Id === Noryn_Client.user?.id) {
        await First_Cache.send('**```[Noryn] - Online 🟢 The bot is back online and ready to use.```**');
      } else if (User_Id === Noryn_Client_2.user?.id) {
        await Second_Cache.send('**```[Noryn] - Online 🟢 The bot is back online and ready to use.```**');
      }
      console.log(`[Notify] - User ${User_Id} went Online.`);
    }
  } catch (Error_Logs) {
    console.error('[Notify] - Error processing presence update:', Error_Logs.message);
  }
}
Noryn_Client.on('clientReady', () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client.user.tag}`);
  if (!Monitor_Target.includes(Noryn_Client.user.id)) {
    Monitor_Target.push(Noryn_Client.user.id);
  }
});
Noryn_Client_2.on('clientReady', () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client_2.user.tag}`);
  if (!Monitor_Target.includes(Noryn_Client_2.user.id)) {
    Monitor_Target.push(Noryn_Client_2.user.id);
  }
});
Noryn_Client.on('presenceUpdate', (Old_Presence, New_Presence) => { 
  Handle_Presence_Change(Old_Presence, New_Presence); 
});
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
