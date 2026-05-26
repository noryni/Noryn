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
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn',
];
let Noryn_Status_Index = 0;
const Noryn_Client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
const Noryn_Client_2 = new Client({
  intents: [GatewayIntentBits.Guilds],
});
function Noryn_Update_Status() {
  const Current_Status =
    Noryn_Status_List[Noryn_Status_Index];
  if (Noryn_Client.user) {
    Noryn_Client.user.setPresence({
      activities: [
        {
          name: Current_Status,
          type: ActivityType.Playing,
        },
      ],
      status: 'dnd',
    });
  }
  if (Noryn_Client_2.user) {
    Noryn_Client_2.user.setPresence({
      activities: [
        {
          name: Current_Status,
          type: ActivityType.Playing,
        },
      ],
      status: 'dnd',
    });
  }
  Noryn_Status_Index =
    (Noryn_Status_Index + 1) % Noryn_Status_List.length;
}
Noryn_Client.on('clientReady', () => {
  console.log(
    `[Noryn] Logged in as ${Noryn_Client.user.tag}`
  );
});
Noryn_Client_2.on('clientReady', () => {
  console.log(
    `[Noryn] Logged in as ${Noryn_Client_2.user.tag}`
  );
});
Noryn_Client.on('shardResume', () => {
  Noryn_Update_Status();
});
Noryn_Client_2.on('shardResume', () => {
  Noryn_Update_Status();
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
    }, 2000);

  } catch (err) {
    console.error('[Noryn] Login failed:', err);
  }
}
Noryn_Login();
