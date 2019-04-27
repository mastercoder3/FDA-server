
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var moment = require('moment');
const app = express();

var port = process.env.PORT || 3000;




const router = express.Router();
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    pool: true,
    auth: {
        user: "la.trat.toria02@gmail.com",
        pass: "1234#AAA"
    }
  }));


router.route('/sendemail').post((req, res) => {
    const data = req.body.order;
    console.log(data);
    // async..await is not allowed in global scope, must use a wrapper

    function setDate(date) {
        var orderDate = moment(new Date(date)).locale('de');
        return moment.utc(orderDate).format('DD, MMMM-YYYY HH:MM');

    }

    function getTotal() {
        let total = 0;
        for(let i = 0; i < data.orderDetails.length; i++){
            total += data.orderDetails[i].price;
        }
        return total;
    }

    async function main() {

        let html = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title></title><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><style>td{font-size: 1em; word-wrap:break-word} th{font-size: 1em;} table{table-layout: auto; width: 100%;}</style></head><body style="margin: 0px; background-color: #FFFFFF; font-size: 14px; color: #444444; font-family: Verdana, Helvetica, Arial, sans-serif;"><div style="width: 100% !important;"><table style="border-collapse:collapse;margin:10px 0; width:100%;" id="print_div"> <tbody> <tr> <td> <table style="border-collapse:collapse;width: 100%; margin: 0 auto; border: 1px dotted #CECECE; background: #F4F3F4;"> <tbody> <tr> <td> <table id="site" style="width:100%;padding: 30px; text-align: center; background-color: #ffffff; color: #000000;"> <tbody> <tr> <td style="text-align: center;font-size: 3em; font-weight: 600;">La TRAT-TORIA Nürnberg </td> </tr> </tbody> </table> <table id="ordervars" style="width:100%;margin: 5px 0 30px 0; border-bottom: 1px dotted #cecece;"> <tbody> <tr> <td colspan="2" style="text-align: center;">' + setDate(data.date) + '</td> </tr> <tr> <td style="width: 50%; white-space:nowrap; text-align: right; padding:2px;">Zu zahlen:</td> <td style="padding: 2px; word-break: break-word;;">' + data.total.toFixed(2) + ' &euro; </td> </tr> <tr> <td style="width: 50%; white-space:nowrap; text-align: right; padding:2px;">Liefertyp :</td> <td style="padding: 2px; word-break: break-word;;">' + data.orderType 
        + '</td> </tr> <tr> <td style="width: 50%; white-space:nowrap; text-align: right; padding:2px;">Bezahlt durch: </td> <td style="padding: 2px; word-break: break-word;;">Barzahlung</td> </tr> <tr> <td colspan="2" style="text-align:center; font-weight:bold; padding:3px">Bitte geben Sie uns 60 Minuten Zeit die Bestellung zu liefern.</td> </tr> </tbody> </table> <table id="customer" style="width:100%;margin: 20px 0;"> <thead> <tr> <th colspan="2" style=""> Kundendaten </th> </tr> </thead> <tbody> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;">Name : </td> <td style="text-align: right;padding: 2px;">' + data.name
         + '</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;"> Postleitzahl :</td> <td style="text-align: right;padding: 2px;;">'+data.code+
         '</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;">Email : </td> <td style="text-align: right;padding: 2px;;">'+data.email
         +'</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;">Adresse :</td> <td style="text-align: right;padding: 2px;;">'+data.address
         +'</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;"> Telefonnummer :</td> <td style="text-align: right;padding: 2px;;">'+data.phone+
         '</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;">Zeit :</td> <td style="text-align: right;padding: 2px;;">'+(data.now !== '' ? data.now : setDate(data.preOrder))+
         '</td> </tr> <tr> <td style="text-align: left; padding: 2px; white-space:nowrap; vertical-align:top;">Notizen :</td> <td style="text-align: right;padding: 2px;;">'+data.notes
         +'</td> </tr> </tbody> </table> <table id="order" style="width:100%;margin: 10px 0;"> <thead> <tr> <th style="text-align: left; padding: 2px; white-space: nowrap;;font-weight: bold ;white-space: nowrap; padding:5px 2px; border-bottom:1px solid; border-top: 1px solid;"> Menge </th> <th style="text-align: center; padding:2px;font-weight: bold ;white-space: nowrap; padding:5px 2px; border-bottom:1px solid; border-top: 1px solid;"> Artikel </th> <th style="text-align: right; padding: 2px; white-space: nowrap;;font-weight: bold ;white-space: nowrap; padding:5px 2px; border-bottom:1px solid; border-top: 1px solid;"> Preis </th> </tr> </thead> <tbody>';

         for(let i = 0; i < data.orderDetails.length; i++){
            let current =  '<tr> <td style="text-align: left; padding: 2px; white-space: nowrap;"> <span>'+data.orderDetails[i].quantity+'</span> </td> <td style="text-align: left; padding:2px;"> <span style="padding-left: 15px;">'+data.orderDetails[i].itemTitle+'</span> <span> '+data.orderDetails[i].size+'</span> <br> <div style="white-space: initial; margin: 3px 3px 3px 20px; line-height: 130%; font-size:85%;font-size:120%;"> <span></span>';
            let extras = '';
            for(let j = 0; j < data.orderDetails[i].extras.length; j++){
                extras = '<span style="font-style: italic; word-wrap: break-word">'+data.orderDetails[i].extras[j]+',</span>';
                current = current + extras;
            }
            current = current + '</div> </td> <td style="text-align: right; padding: 2px; white-space: nowrap;"> <span>'+data.orderDetails[i].price.toFixed(2)+' &euro;</span> </td> </tr>';
            html = html + current;
         }
         html = html +  '</tbody> </table> <table id="summary" style="width:100%;margin: 0 0 10px; border-top: 1px dotted #cecece"> <tbody> <tr> <td style="text-align: left; padding:2px;">Ihre Artikel</td> <td style="text-align: right; padding:2px;">'+getTotal().toFixed(2)+
         ' &euro;</td> </tr> <tr> <td style="text-align: left; padding:2px;">Rabatt</td> <td style="text-align: right; padding:2px;">-'+data.discount.toFixed(2)+
         ' &euro;</td> </tr> <tr> <td style="text-align: left; padding:2px;">Liefergebühr</td> <td style="text-align: right; padding:2px;">'+data.deliveryFee.toFixed(2)
         +' &euro;</td> </tr> <tr> <td style="text-align: left; padding:2px;font-weight: 600; padding: 10px 0; border-top: 1px dotted #cecece"> Gesamt</td> <td style="text-align: right; padding:2px;font-weight: 600; padding: 10px 0; border-top: 1px dotted #cecece"> '+data.total.toFixed(2)+' &euro;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table></div> </body></html>';
        // send mail with defined transport object
        let mailList = [
            "bestellung@la-trat-toria.de ",
            this.data.email
        ];

        let info = await transporter.sendMail({
            from: '"La Trat Toria 🍕" <la.trat.toria02@gmail.com>', // sender address
            to: mailList, // list of receivers
            subject: "", // Subject line
            text: "", // plain text body
            html: html // html body
        });


        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main().catch(console.error);
});


app.use('/', router);





//server running
app.listen(port, () => console.log("Express server running"));
//http://localhost:3000/payments