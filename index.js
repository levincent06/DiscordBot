// clientID = 658163710212309013
// Link: https://discordapp.com/oauth2/authorize?client_id=658163710212309013&scope=bot
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
// toggles whether deletion replay is on;
let deleteReplay = true;
const prefix = ">";
let event;

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

/* Upon a deletion of a message quickly after its creation,
** replay the message for 25 seconds.
*/
client.on("messageDelete", msg => {
  if(msg.author.bot) return;
  if (deleteReplay === false) {
    return;
  }
  if (msg.content.indexOf(prefix) == 0) return;
  const dateToSeconds = date => {
    return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
  };
  var now = new Date();
  var deletionTime = dateToSeconds(now);
  var creationTime = dateToSeconds(msg.createdAt);
  if (deletionTime - creationTime <= 7) {
    const replay = new Discord.RichEmbed()
      .setDescription(msg.content
        + "\n-- " + msg.author.username
        + " " + (now.getMonth() + 1) + "/" + now.getDate() + "/" + (now.getFullYear() % 100))
      .setThumbnail(msg.author.avatarURL);
    msg.channel.send(replay)
      .then(replayedMessage => { replayedMessage.delete(25000)});
  }
})

client.on("message", async msg => {
  if(msg.author.bot) return;
  if(msg.content.indexOf(prefix) !== 0) return;
  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = msg.content.slice(prefix.length).trim().split(/\s/);
  const command = args.shift().toLowerCase();
  const poggers = await client.emojis.get("398644902021431306");
  const pepelaugh = await client.emojis.get("605918842790739978");

  // Show descripton of commands
  if (command === "commands") {
    let content = "```java";
    content += "\nCOMMANDS:";
    content += "\n// Toggles the *thing*";
    content += "\n>toggle";
    content += "\n";
    content += "\n/** Creates an event notif and pins it. Don't put spaces in the event name.";
    content += "\nLinebreaks are allowed anywhere after the event name.";
    content += "\nExample usage:";
    content += "\n>event ChristmasWithFriends";
    content += "\nAddress: 123 Saffcon's House";
    content += "\nTime: Any";
    content += "\n*/";
    content += "\n>event <eventName> <desc>";
    content += "\n";
    content += "\n// Edits the most recent event. (Uses the same formatting as above.)";
    content += "\n// Useful for fixing formatting issues.";
    content += "\n>edit <eventName> <desc>";
    content += "\n";
    content += "\n// Deletes the most recent event (and its pin)";
    content += "\n>delete";
    content += "```";
    commandMessage = msg.channel.send(content)
      .then(notif => {
        notif.delete(60000);
        })
    msg.delete();
  }


  // Create a new event
  if (command === "event") {
    eventMessage = args.slice(1).join(" ");
    eventMessage += "\n\n*Will you attend?*"
    eventMessage += "\nReact " + poggers + " for yes or " + pepelaugh + " for no!";
    const embed = new Discord.RichEmbed()
      .setTitle("Event: " + args[0])
      .setDescription(eventMessage)
      .setColor([31, 112, 53]);
    embedMessage = await msg.channel.send(embed);
    await embedMessage.react(poggers).catch(console.error);
    await embedMessage.react(pepelaugh).catch(console.error);
    embedMessage.pin();
    event = embedMessage;
    msg.delete();
  }

  // Delete all event messages
  if (command === "delete") {
    event.delete();
    event = null;
  }

  // Edit the most recent event information
  if (command === "edit") {
    if (event === null) return;
    newContent = args.slice(1).join(" ");
    newContent += "\n\n*Will you attend?*"
    newContent += "\nReact " + poggers + " for yes or " + pepelaugh + " for no!";
    newEmbed = new Discord.RichEmbed()
    .setTitle("Event: " + args[0])
    .setDescription(newContent)
    .setColor([31, 112, 53]);
    event.edit("", newEmbed);
    msg.delete();
  }

  // Toggle deletion replay
  if (command === "toggle") {
    deleteReplay = !deleteReplay;
    state = (deleteReplay ? "on" : "off");
    msg.channel.send("Delete replay is now " + state).then(notif => {
      notif.delete(7000);
    });
    msg.delete();
  }

  if (command === "clear123") {
    msg.channel.bulkDelete(100);
  }
}
)

client.login(config.token);
