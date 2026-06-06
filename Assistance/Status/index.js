const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const Express = require('express');
const Path = require('path');
const Noryn_App = Express();
const Noryn_Port = process.env.PORT || 3000;
Noryn_App.get('/', (req, res) => {res.sendFile(Path.join(__dirname, '../../Website/Run.html'));});
Noryn_App.listen(Noryn_Port, () => {console.log(`[Notify] - Website online on port ${Noryn_Port}`);});
const Noryn_Status_List = [
  'Join today or stay forgotten.',
  'http://dsc.gg/getnoryn',
];
let Noryn_Status_Index = 0;
const Noryn_Server_Path = '1488663019754881046'; 
const Noryn_Log_Path = '1512566838834499654'; 
const Monitor_Target = ['1508521345409880305', '1508828918327545946'];
let Last_Statuses = {};
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
async function Run_Monitor() {
  try {
    const Server = await Noryn_Client.guilds.fetch(Noryn_Server_Path);
    const Path = await Noryn_Client.channels.fetch(Noryn_Log_Path);
    if (!Path || !Path.isTextBased()) return;
    for (const User_Id of Monitor_Target) {
      try {
        const Member = await Server.members.fetch({ user: User_Id, withPresences: true, force: true });
        const Real_Status = Member.presence ? Member.presence.status : 'offline';
        const Old_Status = Last_Statuses[User_Id];
        if (Real_Status !== Old_Status) {
          if (Real_Status === 'dnd') {
            await Path.send(`⚠️ The user **${Member.user.tag}** is currently on Do Not Disturb (treating as offline).`);
            console.log(`[Notify] - ${Member.user.tag} went DND.`);
          } else if (Real_Status === 'online') {
            await Path.send(`🟢 The user **${Member.user.tag}** is back online!`);
            console.log(`[Notify] - ${Member.user.tag} went Online.`);
          }
          Last_Statuses[User_Id] = Real_Status;
        }
      } catch (User_Error) {
        console.error(`[Notify] - Failed fetching user ${User_Id}:`, User_Error.message);
      }
    }
  } catch (Error) {
    console.error('[Notify] - ', Error.message);
  }
}
Noryn_Client.on('clientReady', () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client.user.tag}`);
  setInterval(Run_Monitor, 3000);
});
Noryn_Client_2.on('clientReady', () => {
  console.log(`[Notify] - Logged in as ${Noryn_Client_2.user.tag}`);
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
  } catch (Err) {
    console.error('[Noryn] Login failed:', Err);
  }
}
Noryn_Login();
