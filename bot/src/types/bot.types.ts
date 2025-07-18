import { Context, CommandContext } from 'grammy';
import type { Filter } from 'grammy';

export type BotContext = Context;
export type BotCommandContext = CommandContext<BotContext>;
export type BotCallbackContext = Filter<BotContext, 'callback_query:data'>;