import { Context } from "telegraf";

export async function run(ctx: Context & any) {
    // const orders = await Order.find({ customer_id: ctx.from.id });
    // if (!orders || orders.length <= 0) return ctx.reply('У вас ')

    ctx.reply(
        `Выбор сотрудника в разработке...`,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    // [{ text: 'Создать анкету' }],
                    // [{ text: 'Выбрать сотрудника' }],
                    // [{ text: '📁 Профиль' }]
                ]
            }
        }
    );
}

export const misc = {
    aliases: ['choose', 'Выбрать сотрудника'],
    desc: 'Выбрать сотрудника'
};