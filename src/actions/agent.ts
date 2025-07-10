import { defineAction, ActionError } from "astro:actions";
import { z } from 'astro:schema';

export const agent = {
    register: defineAction({
        accept: 'form',
        input: z.object({
            symbol: z.string(),
            faction: z.string()
        }),
        handler: async (input) => {
            if (!input.symbol || !input.faction) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'Symbol and Faction must be provided.',
                });
            }
            return {
                symbol: input.symbol,
                faction: input.faction
            }
        }
    })
}