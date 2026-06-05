const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Noryn_App = Express();
const Noryn_Port = process.env.PORT || 3000;
Noryn_App.get('/', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../Website/Run.html'));
});
Noryn_App.listen(Noryn_Port, () => {
  console.log(`[Noryn] Website online on port ${Noryn_Port}`);
});
const Noryn_Logs_Path = '1512566838834499654';
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn',
];
let Noryn_Status_Index = 0;
let Last_Status = null;
const Noryn_Client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
const Noryn_Client_2 = new Client({
  intents: [GatewayIntentBits.Guilds],
});
async function Noryn_Send_Status(Message) {
  try {
    const Channel = await Noryn_Client.channels.fetch(Noryn_Logs_Path);
    if (Channel) await Channel.send(Message);
  } catch (Err) {
    console.error('[Noryn] Failed to send status message:', Err);
  }
}
function Noryn_Check_Status() {
  const Client = Noryn_Client.user;
  if (!Client) return;
  const Presence_Status = Client.presence?.status;
  if (!Presence_Status) return;
  if (Presence_Status === Last_Status) return;
  Last_Status = Presence_Status;
  if (Presence_Status === 'dnd') {
    Noryn_Send_Status(
      '**```[Noryn] - Offline 🔴 Connection lost. Please restart the bot.```**'
    );
  }
  if (Presence_Status === 'online') {
    Noryn_Send_Status(
      '**```[Noryn] - Online 🟢 The bot is back online and ready to use.```**'
    );
  }
}
function Noryn_Update_Status() {
  const Current_Status = Noryn_Status_List[Noryn_Status_Index];
  const Presence_Status = 'dnd';
  if (Noryn_Client.user) {
    Noryn_Client.user.setPresence({
      activities: [
        {
          name: Current_Status,
          type: ActivityType.Custom,
        },
      ],
      status: Presence_Status,
    });
  }
  if (Noryn_Client_2.user) {
    Noryn_Client_2.user.setPresence({
      activities: [
        {
          name: Current_Status,
          type: ActivityType.Custom,
        },
      ],
      status: Presence_Status,
    });
  }
  Noryn_Status_Index = (Noryn_Status_Index + 1) % Noryn_Status_List.length;
}
Noryn_Client.on('clientReady', async () => {
  console.log(`[Noryn] Logged in as ${Noryn_Client.user.tag}`);
  await Noryn_Send_Status(
    '**```[Noryn] - Online 🟢 The bot is back online and ready to use.```**'
  );
});
Noryn_Client_2.on('clientReady', async () => {
  console.log(`[Noryn] Logged in as ${Noryn_Client_2.user.tag}`);
});
async function Noryn_Login() {
  try {
    await Noryn_Client.login(process.env.Key);
    await Noryn_Client_2.login(process.env.Key1);
    setTimeout(() => {
      Noryn_Update_Status();
      setInterval(() => {
        Noryn_Update_Status();
      }, 10000);
      setInterval(() => {
        Noryn_Check_Status();
      }, 5000);
    }, 2000);
  } catch (Err) {
    console.error('[Noryn] Login failed:', Err);
  }
}
Noryn_Login();
