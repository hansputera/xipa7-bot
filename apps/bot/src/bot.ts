import makeWASocket, { AuthenticationState } from '@adiwajshing/baileys';

type ReturnedMakeWaSocket = ReturnType<typeof makeWASocket>;

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
  });
