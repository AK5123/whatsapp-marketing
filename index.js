const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');

const results = [];

const message = "Final message"; // Message to be attached below the image
let media = MessageMedia.fromFilePath("test.jpeg"); //paste the image in root directory and replace the name


const client = new Client({
     authStrategy: new LocalAuth({ dataPath: 'codec'}) 
    });

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    } else if (msg.body == '!start') {
        try{
            let chat = await msg.getChat();
            chat.sendSeen();
            results.forEach(row => {
                let number = "91" + row.mobile + "@c.us";
                client.sendMessage(number, media, { caption: message });
            })
        } catch(e) {
            console.log("error", e);
        }
    }
});


fs.createReadStream('mockat_users.csv').pipe(csv())
.on('data', (data) => results.push(data))
.on('end', () => {
    client.initialize();
});

