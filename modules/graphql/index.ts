import shuffle from 'lodash-es/shuffle';

export const schema = require('./schema.graphql')
import {Query, UserByIdQueryArgs} from './schema-types';

/** The graphql context type for this app.  */
export interface Context {
  // Add global request context, such as
  // repositories and dataloaders here.

  users: UserRepository
}

import * as db from '../db';
import {UserRepository} from '../records/user';

/** Builds a new empty context for a request. */
export function buildContext() : Context {
  const conn = db.getConnection();
  return {
    users: new UserRepository(conn)
  };
}

export const resolvers = {
  Query: {
    async allUsers(obj: {}, args: {}, context: Context): Promise<Query['allUsers']> {
      return await context.users.all();
    },

    async userById(obj: {}, args: UserByIdQueryArgs, context: Context): Promise<Query['userById']> {
      const user = await context.users.findById.load(args.id);
      return user || null;
    },

    async answer(): Promise<Query['answer']> {
      return shuffle([1,2,3]);
    }
  }
}