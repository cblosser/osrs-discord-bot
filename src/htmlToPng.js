const { MessageAttachment } = require("discord.js");
const nodeHtmlToImage = require("node-html-to-image");
const { getResource } = require("./utilities")
const formatInTimeZone = require("date-fns-tz/formatInTimeZone")

module.exports = async (channel, players = null) => {
    if(!players) throw new Error("User sections are required for image creation")

    let block = ""
    let content = {}

    console.log(content)
    
    players.forEach((player) => {
        block += player.renderBlock
        // flatten player content, unique
        for (const key in player.content) {
            if (!content.hasOwnProperty(key)) {
                content[key] = player.content[key]
            }
        }
    })

  const _htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <style>
            body {
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                background: #36393F;
                color: #fff;
                width: 375px;
                min-height: 100%;
                padding: 12px;
            }

            body:before {
                background: url('https://www.runescape.com/img/rsp777/scroll/backdrop_765_top.gif') no-repeat;
                background-size: 385px;
                content: '';
                height: 50px;
                position: absolute;
                left: 15px;
                top: 10px;
                width: 100%;
            }

            body:after {
                background: url('https://www.runescape.com/img/rsp777/scroll/backdrop_765_top.gif') no-repeat;
                background-size: 385px;
                content: '';
                height: 50px;
                position: absolute;
                left: 15px;
                bottom: -25px;
                width: 100%;
            }

            .app {
                background: url(https://www.runescape.com/img/rsp777/scroll/backdrop_745.gif);
                background-size: 375px;
                padding: 15px 15px;
            }

            .player-name {
                color: #7B4F17;
                text-shadow: 1px 1px 1px #000000;
            }

            h1, h2, h3, h4, h5, h6 {
                margin: 0;
                padding: 0;
            }

            .player-name {
                font-size: 1.6rem;
                margin-bottom: .5rem;
            }

            div {
                color: #000;
            }

            .user-block {
                margin: 1.2rem 0 1.2rem 0;
                width: 100%;
            }

            .user-block:not(:last-child) {
                border-bottom: 1px solid #7B4F17;
            }

            .block-row {
                display: grid;
                grid-gap: 5px;
                grid-template-columns: 33.333% 33.333% 33.333%;
                margin-bottom: 1rem;
            }

            .block-main {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .block-item .value {
                font-size: 1.5rem;
                margin-right: 4px;
            }

            .block-item .variance {
                color: green;
                font-size: 1rem;
            }

            .block-main .skill-max {
                font-size: 23px;
                position: relative;
                left: -3px;
                top: -2px;
            }

            .skill-icon {
                height: 30px;
                width: auto;
                margin-right: .5rem;
            }
            
            .block-item small {
                display: block;
                text-align: center;
                color: #512e06;
                font-size: 12px;
            }
            </style>
        </head>
        <body>
            <div class="app">
                ${block}
            </div>
        </body>
    </html>
    `;

    const image = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        puppeteerArgs: {
        args: ["--no-sandbox","--disable-setuid-sandbox"],
        },
        content
    })

    const dateAndTime = formatInTimeZone(new Date(), "America/New_York", "MM-dd-yyyy hh-mm aa (O)")

  const file = new MessageAttachment(image, `OSRS Player Update ${dateAndTime}.png`);

  // fire
  channel.send({ files: [file] });
};
