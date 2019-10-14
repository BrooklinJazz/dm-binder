import { gql } from "apollo-server";

export default gql`
  type Npc {
    _id: ID
    name: String!
    description: String
    creator: User!
    campaign: Campaign!
    organizations: [Organization!]!
  }

  input NpcInput {
    name: String!
    description: String
    campaign: String!
    organizations: [ID!]!
  }

  input UpdateNpcInput {
    _id: ID!
    name: String!
    description: String
    organizations: [ID!]!
  }

  input SingleNpcInput {
    _id: ID!
  }

  input CampaignNpcInput {
    campaign: String
    location: String
  }

  extend type Query {
    npcs(input: CampaignNpcInput): [Npc!]!
    npc(input: SingleNpcInput): Npc!
  }

  extend type Mutation {
    createNpc(input: NpcInput): Npc!
    updateNpc(input: UpdateNpcInput): Npc!
    deleteNpc(input: SingleNpcInput): Npc!
  }
`;
