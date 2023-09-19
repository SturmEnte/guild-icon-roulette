# guild-icon-roulette

## About
This is a Discord bot that selects a random image from a specified channel, puts a cover on it, resizes it, and then sets it as the new guild icon.

## How to use it
1. Put the cover image into the root folder (name: top.png)
2. Create a file in the root folder (name: config.json) Content:
```json
{
  "guild_id": "728782079525126145",
  "image_channel_id": "1146534445894094968"
}
```
3. Run the ``update.sh`` file. A Docker image will be created called ``guild-icon-roulette``
4. Create a Docker container with the following environment variables
    - TOKEN: The token of the Discord bot
5. Start the container 
