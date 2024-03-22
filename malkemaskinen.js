const { Client, GatewayIntentBits } = require('discord.js');

const fs = require('fs');

// Load existing mention data from file (if any)
let mentionData = {};
try {
  const rawData = fs.readFileSync('mention_data.json');
  mentionData = JSON.parse(rawData);
} catch (error) {
  console.error('Error loading mention data:', error);
}

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, 
		GatewayIntentBits.DirectMessages,
	]
});


const prefix = '!'; // You can change this to your preferred command prefix

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  
  if (message.content.startsWith("!malk")){	  
	  if (message.mentions.users.size > 0) {
		message.mentions.users.forEach((user) => {
		  // Store mention data
		  const mentionedUserId = user.id;
		  const mentionedByUsername = user.username;

		  if (!mentionData[mentionedUserId]) {
			mentionData[mentionedUserId] = {
			  username: mentionedByUsername,
			  mentionCount: 1,
			};
		  } else {
			mentionData[mentionedUserId].mentionCount++;
		  }

		  // Save mention data to file
		  fs.writeFile('mention_data.json', JSON.stringify(mentionData), (error) => {
			if (error) {
			  console.error('Error saving mention data:', error);
			} else {
			  console.log('Mention data saved successfully.');
			}
		  });


		message.channel.send(`Jeg malker lige ${mentionedByUsername}! som nu er blevet malket ${mentionData[mentionedUserId].mentionCount} gange`);  
		  
		});
	  }
  }  
  
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'malkemaskinen' || command === 'malkemaskine') {
    // Your bot's response logic goes here
    message.channel.send('Skal jeg komme og malke dig i min malkemaskine!');
  }
  

  
  
});

let config = {};
try {
  const rawData = fs.readFileSync('config.json');
  config = JSON.parse(rawData);
} catch (error) {
  console.error('Error loading coinfig.json - have you renamed config_example.json?:', error);
}


client.login(config.token);
