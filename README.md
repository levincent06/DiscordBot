# DiscordBot
A bot for Discord, a VoIP/Chat Service.

This bot has two core functionalities:
1) Creating event notifications that can be edited and/or deleted. The event notification is automatically pinned for ease of access.
2) If a message is deleted within a few seconds of being sent, the bot will replay the message for a set amount of time.

Sending ">commands" to any server with this bot added will display the following message:
!["List of commands"](https://raw.githubusercontent.com/levincent06/DiscordBot/master/commands.JPG)

## Event creation ##
Example of event creation:
```
>event Christmas! 
Where: My house
What: Playing board games and eating pizza :P
```

The bot will send the following message and pin it:
!["Event example"](https://raw.githubusercontent.com/levincent06/DiscordBot/master/eventCapture.JPG)

A user can edit and/or delete the event message (and its pin) with the respective commands.

## Message replay ##
The bot will replay a deleted message along with the message's author's avatar.
This feature can be toggled on and off.
!["Replay example"](https://raw.githubusercontent.com/levincent06/DiscordBot/master/replay.JPG)

## Notes ##
All commands sent by the user will be automatically deleted to prevent clogging of chat log.
Non-event messages sent by the bot (such as error messages or message replays) are also deleted after a short period of time.
