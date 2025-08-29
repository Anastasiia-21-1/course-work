import { createTRPCRouter } from '@/server/trpc';
import { userRouter } from './routers/user';
import { categoryRouter } from './routers/category';
import { cityRouter } from './routers/city';
import { lostRouter } from './routers/lost';
import { findRouter } from './routers/find';
import { chatsRouter } from './routers/chats';

export const appRouter = createTRPCRouter({
  user: userRouter,
  category: categoryRouter,
  city: cityRouter,
  lost: lostRouter,
  find: findRouter,
  chats: chatsRouter,
});

export type AppRouter = typeof appRouter;
