import makeWASocket, { AuthenticationState } from '@adiwajshing/baileys';
import pino from 'pino';

export type ReturnedMakeWaSocket = ReturnType<typeof makeWASocket>;

/**
 * Create bot instance.
 * @param {AuthenticationState} state WhatsApp Auth state.
 * @return {Promise<ReturnedMakeWaSocket>}
 */
export const createBot = async (
  state: AuthenticationState,
): Promise<ReturnedMakeWaSocket> =>
  makeWASocket({
    'auth': state,
    'connectTimeoutMs': 10_000,
    'logger': pino({
      'name': 'XIPA7_BOT',
      'transport': {
        'target': 'pino-pretty',
        'options': {
          'colorize': true,
          'ignore': 'hostname',
        },
      },
    }),
  });
