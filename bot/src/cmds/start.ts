import { Context } from "telegraf";

export async function run(ctx: Context & any) {
    ctx.reply(
        `💼 <b>Профиль</b>\n\n👤 Ваш ID: <code>${ctx.user.tg_id}</code>\n🏘️ Ваш город: <b>${ctx.user.city}</b>`,
        {
            parse_mode: 'HTML',
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{ text: '🔖 Создать анкету' }],
                    [{ text: '👷🏻‍ Выбрать сотрудника' }],
                    [{ text: '📁 Профиль' }]
                ]
            }
        }
    );
}

export const misc = {
    aliases: ['start', 'Профиль'],
    desc: 'Начать работу'
};