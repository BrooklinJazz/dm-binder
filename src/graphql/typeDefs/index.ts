import { gql } from "apollo-server";

import campaign from "./campaign";
import npc from "./npc";
import user from "./user";

// these types are extended in the other typeDefs files
const root = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

export default [root, npc, user, campaign];
