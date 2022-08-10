import { proto } from '@adiwajshing/baileys';
import type { ReturnedMakeWaSocket } from '../bot';
import { downloadTiktok } from '../features';

export const messageUpsertHandle = async (
  bot: ReturnedMakeWaSocket,
  messages: proto.IWebMessageInfo[],
) => {
  const message = messages.at(0);
  if (message?.key.fromMe) return;

  if (message?.message?.extendedTextMessage)
    message.message.conversation = message.message.extendedTextMessage.text;

  // tiktok url detect.
  if (
    /http(s?)(:\/\/)([a-z]+\.)*tiktok\.com\/(.+)/gi.test(
      message?.message?.conversation!,
    )
  ) {
    const urls =
      message?.message?.conversation
        ?.match(/http(s)?:\/\/[a-z]+\.tiktok\.com\/.+/gi)
        ?.map((u) => u.replace(/\s/g, '')) ?? [];

    const datas = await downloadTiktok(urls);
    datas
      .filter((x) => x)
      .forEach((data) => {
        bot.sendMessage(
          message?.key?.remoteJid!,
          {
            'video': {
              'url': data?.video?.urls.at(0)!,
            },
            'caption': `${data?.video?.title ?? '-'}\n${data?.caption ?? ''}`,
          },
          {
            'quoted': message,
          },
        );
      });
  }
  // end tiktok feature.
};
