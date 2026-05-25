const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Noryn_Client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
const Noryn_App = Express();
const Noryn_Port = process.env.Key || 3000;
Noryn_App.get('/', (Noryn_Request, Noryn_Response) => {
  Noryn_Response.sendFile(
    Path.join(__dirname, '../../Website/Run.html')
  );
});
Noryn_App.listen(Noryn_Port, () => {
  console.log(
    `[Noryn] - Website online on port ${Noryn_Port}`
  );
});
const Noryn_Status_List = [
  'Don’t follow everyone. Be different.',
  'http://dsc.gg/getnoryn' // Lowk brutal
];
let Noryn_Status_Index = 0;
async function Noryn_Login() {
  await Noryn_Client.login(process.env.Access);
}
function Noryn_Update_Status() {
  Noryn_Client.user.setPresence({
    activities: [
      {
        name: Noryn_Status_List[Noryn_Status_Index],
        type: ActivityType.Watching
      }
    ],
    status: 'dnd',
  });
  Noryn_Status_Index = (Noryn_Status_Index + 1) % Noryn_Status_List.length;
}
Noryn_Client.once('clientReady', () => {
  console.log(
    `[Noryn] - Logged in as ${Noryn_Client.user.tag}`
  );
  Noryn_Update_Status();
  setInterval(Noryn_Update_Status, 10000);
});
Noryn_Login();
