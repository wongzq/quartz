import { Client, IntentsBitField } from 'discord.js';

import Env from './env';
import { parseSticker } from './utils/stickers.util';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.login(Env.DISCORD_APP_TOKEN);

client.on('ready', () => {
  console.log('quartz is ready');
});

// sticker factory
client.on('messageCreate', async (message) => {
  try {
    if (!message.guild) return;
    if (!Env.ALLOWED_STICKER_CHANNEL_IDS.includes(message.channel.id)) return;
    if (!Env.ALLOWED_USER_IDS.includes(message.author.id)) return;

    const sticker = message.stickers.at(0);
    if (!sticker) return;

    let successfullyAddedSticker = false;

    const image = await parseSticker(sticker);

    if (image) {
      await message.guild.stickers.create({
        name: image.name,
        tags: image.tags,
        file: image.url,
      });

      message.reply(`成功加了贴图！:blush: \`:${image.name}:\` ${image.url}`);

      successfullyAddedSticker = true;
    }

    if (!successfullyAddedSticker) {
      throw Error('不懂为什么，无法加贴图 :thinking:');
    }
  } catch (err) {
    message.reply(
      `不好意思，这里出了问题 :sweat:\n` +
        `求求你帮我嘛，我看不明白呢 :face_holding_back_tears:\n` +
        `\`\`\`\n${String(err)}\`\`\``,
    );
  }
});
