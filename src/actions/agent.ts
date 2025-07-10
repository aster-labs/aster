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

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.ACCOUNT_TOKEN}`
                },
                body: JSON.stringify({
                    symbol: input.symbol,
                    faction: input.faction,
                }),
            };

            try {
                const response = await fetch('https://api.spacetraders.io/v2/register', options);
                const data = await response.json();
                if (data.error) {
                    throw new ActionError({
                        code: 'BAD_REQUEST',
                        message: data.error.message
                    });
                }
                return {
                    agent: data.data.agent,
                    faction: data.data.faction
                };
            } catch (error) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        }
    })
}