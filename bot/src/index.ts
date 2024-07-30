import 'dotenv/config';
import mongoose from 'mongoose';
import { Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { User } from './models';
import fs from 'fs';
import { join } from 'path';

const bot = new (require('telegraf').Telegraf)(process.env.TOKEN);
bot.cmds = new Map();
bot.signingup = {};
mongoose.connect(`mongodb://${process.env.NODE_ENV === 'production' ? 'mongo' : '127.0.0.1'}/testmkprofibot`);
mongoose.connection.on('connected', () => console.log('[✅DB] Cluster connected!'));

async function run(ctx: Context & any) {
    const trimmed = ctx.text.trim();
    const cmd = trimmed.startsWith('/')
        ? trimmed.split(' ')[0].slice(1)
        : trimmed.split(' ').slice(1).join(' ');

    try {
        await bot.cmds.get(cmd as keyof typeof bot.cmds).run(ctx);
    } catch {}
}

fs.readdir(join(__dirname, 'cmds'), (err, files) => {
    if (err) return console.error(err);
    files.filter(f => f.endsWith('.ts')).forEach(f => {
        const cmd = require(join(__dirname, 'cmds', f));
        cmd.misc.aliases.forEach((a: string) => bot.cmds.set(a, cmd));
    });
});

bot.on(message('text'), async (ctx: Context & any) => {
    const user = await User.findOne({ tg_id: ctx.from.id });

    if (bot.signingup[ctx.from.id.toString()]) {
        const val = ctx.message.text.trim();
        if (val.length < 3) return ctx.reply('Напишите корректный город!');

        const user = new User({ tg_id: ctx.from.id, city: val });
        await user.save();

        ctx.user = user;
        await bot.cmds.get('start').run(ctx);
    } else if (!user) {
        ctx.reply(
            'Добро пожаловать!\n\nНапишите свой город для начала работы',
            // { reply_markup: { inline_keyboard: [[{ text: 'Москва', callback_data: 'signup_msk' }, { text: 'СПБ', callback_data: 'signup_spb' }]] } }
        );
        bot.signingup[ctx.from.id.toString()] = true;
    } else {
        ctx.user = await User.findOne({ tg_id: ctx.from.id });
        await run(ctx);
    }
});

// bot.on('callback_query', async (ctx: Context & any) => {
//     const data = ctx.update.callback_query;
//     const [cmd, payload] = data.data.split('_');
//
//     if (cmd === 'signup') {
//
//     }
// });

console.log('testmkprofibot launched');
bot.launch();
