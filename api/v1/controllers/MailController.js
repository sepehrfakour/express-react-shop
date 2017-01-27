const sg = require('sendgrid')(process.env.SENDGRID_API_KEY),
      helper = require('sendgrid').mail;

class MailController {
  constructor () {
    // super();
  }
  sendMail (from_string,to_string,subject_string,content_string) {
    // Create email
    let from_email = new helper.Email(from_string),
        to_email = new helper.Email(to_string),
        subject = subject_string,
        content = new helper.Content('text/plain', content_string),
        mail = new helper.Mail(from_email, subject, to_email, content);
    // Create sendgrid API request
    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    // Send email
    sg.API(request, function(error, response) {
      if (error) {
        console.log("Sendgrid error:",error);
        return false;
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  }

}

const mailController = new MailController;

module.exports = mailController;
