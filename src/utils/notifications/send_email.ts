




import { ADMIN_EMAIL_PASS, ADMIN_EMAIL_USER, SEND_EMAIL } from '../constants';
import { logger } from '../logger';
var nodemailer = require('nodemailer');
export async function sendEmail(to_email: string, subject: string, body: string , attachments : Array<any> = []) {

  const flag : boolean = `${ SEND_EMAIL }` === "False" ? false : true;


  // -- for sending email using html template 
  /********************* */

  // const filePath = path.join(__dirname, '../emails/password-reset.html');
  // const source = fs.readFileSync(filePath, 'utf-8').toString();
  // const template = handlebars.compile(source);
  // const replacements = {
  //   username: "Umut YEREBAKMAZ"
  // };
  // const htmlToSend = template(replacements);

  /********************* */
if(flag)
{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ADMIN_EMAIL_USER,
      pass: ADMIN_EMAIL_PASS
    }
  });
  const mailOptions = {
    from: ADMIN_EMAIL_USER,
    to: to_email,
    subject: subject,
    html: body,
    attachments: attachments
  };

//   logger.info("Email sent to user" , to_email )
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      logger.error("Error occured while sending email with response : " + error.message);
    }
    else {
      logger.info("Email sent with response : " + info.response);
    }
  });

}
else
{
  logger.warn( 'Email service is disabled for you.' );

}


}


