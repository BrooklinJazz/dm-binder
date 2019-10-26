import Campaign from "../../models/campaign";
import Location from "../../models/location";
import Npc from "../../models/npc";
import Organization from "../../models/organization";
import {
  IContext,
  IInput,
  INpc,
  INpcInput,
  IUpdateNpcInput
} from "../../models/types";
import { checkSignedIn, userIdFromContext } from "./helpers";

export default {
  Query: {
    npcs: async (
      root: any,
      { input }: IInput<{ campaign?: string; location?: string }>,
      context: IContext
    ) => {
      checkSignedIn(context);
      const userId = userIdFromContext(context);
      try {
        return await Npc.find({
          ...input,
          creator: userId
        });
      } catch (error) {
        throw error;
      }
    },
    npc: async (
      root: any,
      { input }: IInput<{ _id: string }>,
      context: IContext
    ) => {
      checkSignedIn(context);
      try {
        const npc = await Npc.findById(input._id);
        if (!npc) {
          throw Error("Npc not found");
        }
        return npc;
      } catch (error) {
        throw error;
      }
    }
  },
  Mutation: {
    // TODO determine req type
    createNpc: async (
      root: any,
      { input }: IInput<INpcInput>,
      context: IContext
    ) => {
      checkSignedIn(context);
      const userId = userIdFromContext(context);
      const npc = new Npc({
        ...input,
        creator: userId
      });
      try {
        const createdNpc = await npc.save();
        const campaign = await Campaign.findById(input.campaign);
        if (!campaign) {
          throw new Error("Campaign Does Not Exist");
        }
        // update campaign npcs
        campaign.npcs.push(createdNpc);
        campaign.save();
        // update organization npcs
        const populatedNpc = await Npc.findById(createdNpc._id);
        return populatedNpc;
      } catch (error) {
        throw error;
      }
    },
    updateNpc: async (
      root: any,
      { input }: IInput<IUpdateNpcInput>,
      context: IContext
    ) => {
      checkSignedIn(context);
      const updatedNpc: INpc | null = await Npc.findByIdAndUpdate(
        input._id,
        {
          ...input
        },
        // get the new version of the campaign, not the old one.
        { new: true }
      );
      if (!updatedNpc) {
        throw new Error("Npc Does Not Exist");
      }
      return updatedNpc.toObject();
    },
    deleteNpc: async (
      root: any,
      { input }: IInput<{ _id: string }>,
      context: IContext
    ) => {
      checkSignedIn(context);
      try {
        const deletedNpc: INpc | null = await Npc.findByIdAndDelete(input._id);
        if (!deletedNpc) {
          throw new Error("Location Does Not Exist");
        }
        return deletedNpc.toObject();
      } catch (error) {
        throw error;
      }
    }
  }
};
