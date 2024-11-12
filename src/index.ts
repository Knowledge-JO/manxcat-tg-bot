import { Markup, Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 8080;
const token = process.env.TG_BOT_TOKEN || "";

const ngrok_url = process.env.LOCAL_WEBHOOK_URL || ""; // change to yours
const og_url = process.env.WEBHOOK_URL || "";

const mini_app = process.env.MINI_APP_URL || "";

const URL = process.env.PRODUCTION == "true" ? og_url : ngrok_url;

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const text = ctx.message.text; // Access the text property directly
  const textList = text.split(" ");
  const referralId = textList.length > 1 ? textList[1] : undefined;

  const keyboard = [
    [
      Markup.button.webApp(
        "Launch",
        `${mini_app}?${referralId ? `&referralId=${referralId}` : ""}`
      ),
    ],
  ];

  try {
    const imageURL = "";
    await ctx.reply(`Hello ${ctx.message.from.first_name}`, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard },
    });
  } catch (error) {
    console.log("Error reply user", error);
  }
});

bot
  .launch({
    webhook: {
      domain: URL,
      port,
    },
  })
  .then(() => console.log("Webhook bot listening on port", port));
