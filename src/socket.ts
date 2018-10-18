import socketIo from 'socket.io-client';
import { Store } from 'vuex';
import { Mutations, State } from '@/store';

export interface GitHubHook {
  id: number;
  name: string;
  state: 'pending' | 'failure' | 'error' | 'success';
}

let socket: SocketIOClient.Socket | undefined;

export function connect(url: string, store: Store<State>, io = socketIo) {
  return new Promise((resolve, reject) => {
    const client = io(url);
    socket = client;
    client.on('connect', () => {
      resolve();
      client.on('github', (json: GitHubHook) => {
        store.dispatch(Mutations.GITHUB_HOOK_RECEIVED, json);
      });
    });
    client.on('connect_error', reject);
  });
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
  }
}
