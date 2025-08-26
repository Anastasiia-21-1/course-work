import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import Router from 'next/router';

export enum AUTH {
  AUTHED = 'authed',
  NOT_AUTHED = 'not_authed',
}

type LocalUser = {
  authed: AUTH;
  id?: string;
  username?: string | null;
};

interface Byp {
  user: LocalUser;
  signup: (username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const useStore = create<Byp>()(
  devtools(
    persist(
      (set, get) => ({
        user: { authed: AUTH.NOT_AUTHED },
        signup: (username: string, password: string) => {
          console.log('Signing up user ', username);
        },
        login: (username: string, password: string) => {
          console.log('Logging in user ', username);
        },
        logout: () => {
          set({ user: { authed: AUTH.NOT_AUTHED } });
          Cookies.remove('byp-user-id');
          Router.push('/login');
        },
      }),
      {
        name: 'byp',
        getStorage: () => localStorage,
      },
    ),
  ),
);

export { useStore };
