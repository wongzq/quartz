import { Sticker } from "discord.js";
import { convertImageURLtoURI, EMimeType } from "./image.util";

export const parseSticker = async (sticker: Sticker) => {
  const gifURL = `https://media.discordapp.net/stickers/${sticker.id}.gif`;
  const pngURL = `https://media.discordapp.net/stickers/${sticker.id}.png`;

  let gifURI: string | null = null;
  let pngURI: string | null = null;

  // check if Sticker is GIF
  try {
    gifURI = await convertImageURLtoURI(gifURL, EMimeType.GIF);
  } catch (err) {
    gifURI = null;
  }

  // check if Sticker is PNG/APNG, only if it's not GIF
  if (!gifURI) {
    try {
      pngURI = await convertImageURLtoURI(pngURL, EMimeType.PNG);
    } catch (err) {
      pngURI = null;
    }
  }

  if (gifURI) {
    return {
      name: `uus_${sticker.name}`,
      tags: "uu",
      url: gifURL,
    };
  }
  if (pngURI) {
    return {
      name: `uus_${sticker.name}`,
      tags: "uu",
      url: pngURL,
    };
  }

  return null;
};
