import { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import * as qrcode from 'qrcode';
import rimraf from 'rimraf';
import type { Boom } from '@hapi/boom';

import { createBot, ReturnedMakeWaSocket } from './bot';
import { messageUpsertHandle } from './events/messageUpsert';

/**
 * Launch bot func.
 * @param {ReturnedMakeWaSocket} bot Bot instance.
 * @return {Promise<void>}
 */
async function launch(bot?: ReturnedMakeWaSocket): Promise<void> {
  const auth = await useMultiFileAuthState(
    path.resolve('..', '..', 'sessions'),
  );

  if (!bot) {
    bot = await createBot(auth.state);
  }

  bot.ev.on('messages.upsert', ({ messages }) =>
    messageUpsertHandle(bot!, messages),
  );

  bot.ev.on('connection.update', async (connection) => {
    auth.saveCreds();

    const qrPath = path.resolve('..', '..', 'qr.png');
    if (typeof connection.qr === 'string') {
      console.log('QR was generated, scan the QR now!');
      qrcode.toFileStream(createWriteStream(qrPath), connection.qr);
    } else if (connection.connection === 'close') {
      rimraf(qrPath, () => {});
      if (
        connection.lastDisconnect?.error &&
        (connection.lastDisconnect?.error as Boom).output.statusCode !==
          DisconnectReason.loggedOut
      ) {
        bot = await createBot(auth.state);
        launch(bot);
      } else {
        console.log('Logged out, cleaning up...');
        process.exit(1);
      }
    }
  });
}

launch();
