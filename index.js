// clientID = 658163710212309013
// Link: https://discordapp.com/oauth2/authorize?client_id=658163710212309013&scope=bot
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
// The config file containing the private bot token
const config = require("./config.json");
// toggles whether deletion replay is on;
let deleteReplay = true;
// The prefix for commands
const prefix = ">";
// A JSON file containing all of the created events through >event
const events = require("./events.json");

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.user.setActivity('Saffy | >commands ');
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
      .setThumbnail(msg.author.avatarURL)
      .setColor([31, 112, 53]);
    msg.channel.send(replay)
      .then(replayedMessage => { replayedMessage.delete(25000)});
  }
})

client.on("message", async msg => {
  if(msg.author.bot) return;
  if(msg.content.indexOf(prefix) !== 0) return;
  // Separate arguments into an array of words.
  const args = msg.content.slice(prefix.length).trim().split(/ /);
  // Pop off the first item of args to be the command name.
  const command = args.shift().toLowerCase();
  // An emoji used for event reactions.
  const poggers = await client.emojis.get("398644902021431306");
  // Another emoji used for event reactions.
  const pepelaugh = await client.emojis.get("605918842790739978");

  // Sends message CONTENT to the server for NUMSECONDS
  function sendNotif(content, numSeconds) {
    msg.channel.send(content).then(notif => {
      notif.delete(numSeconds * 1000);
      })
  }

  // Displays all commands available to users.
  switch (command) {
    case "commands":
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
      content += "\n// Edits the event named EVENTNAME. (Uses the same formatting as above.)";
      content += "\n// Useful for fixing formatting issues.";
      content += "\n>edit <eventName> <desc>";
      content += "\n";
      content += "\n// Deletes the event named EVENTNAME (and its pin)";
      content += "\n>delete <eventName>";
      content += "```";
      sendNotif(content, 45);
      msg.delete();
      break;

    // Creates a new event message and writes it to file.
    case "event":
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
      // Serialize the event
      events[args[0]] = {
        server: msg.channel.guild.id,
        msgID: embedMessage.id
      }
      fs.writeFile("./events.json", JSON.stringify(events, null, 4),
                    err => {if (err) throw err;});
      msg.delete();
      break;

    // Deletes the message of the event passed in and writes it to file.
    case "delete":
      if (events[args[0]] === undefined) {
        sendNotif("Event named '" + args[0] + "' doesn't exist!", 10);
        msg.delete();
        return;
      }
      // Delete the message from the server.
      msgToDelete = await msg.channel.fetchMessage(events[args[0]].msgID);
      msgToDelete.delete().catch(err => {if (err) throw err;});
      // Delete the key from the JSON file.
      delete events[args[0]];
      // Update the JSON file.
      fs.writeFile("./events.json", JSON.stringify(events, null, 4),
                    err => {if (err) throw err;});
      msg.delete();
      break;

    // Edits the content of the event passed in and writes it to file.
    case "edit":
      if (events[args[0]] === undefined) {
        sendNotif(`Event named '${args[0]}' doesn't exist!`, 10);
        msg.delete();
        return;
      }
      newContent = args.slice(1).join(" ");
      newContent += "\n\n*Will you attend?*"
      newContent += "\nReact " + poggers + " for yes or " + pepelaugh + " for no!";
      newEmbed = new Discord.RichEmbed()
      .setTitle("Event: " + args[0])
      .setDescription(newContent)
      .setColor([31, 112, 53]);
      // Edit the message in the server.
      msgToEdit = await msg.channel.fetchMessage(events[args[0]].msgID);
      msgToEdit.edit("", newEmbed);
      // Update the JSON file.
      fs.writeFile("./events.json", JSON.stringify(events, null, 4),
                    err => {if (err) throw err;});
      msg.delete();
      break;

    // Toggles delete replay
    case "toggle":
      deleteReplay = !deleteReplay;
      state = (deleteReplay ? "on" : "off");
      sendNotif("Delete replay is now " + state, 5);
      msg.delete();
      break;

    // Utility method to clear chat log. Restricted to only testing server.
    case "clear123":
      if (msg.guild.ownerID == 174682761854976001) {
        console.log("Deleting all");
        msg.channel.bulkDelete(100);
      } else {
        console.log("Failure clear");
      }
      break;

    default:
      await sendNotif(`Command named '${command}' doesn't exist!`, 5);
      msg.delete();
      break;
    }
})

client.login(config.token);
