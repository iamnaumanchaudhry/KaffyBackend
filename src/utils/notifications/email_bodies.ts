import { EVALUATE_INFO_EMAIL, EVALUATE_LOGO_URL } from "../constants";






export function EmailDisclaimer(email: string = 'INSERT Here') {

  return {
    html: `
    <p class = "disclaimer">
    This email is sent to ${email}, by E-Valuate.It contains information from E-Valuate and is confidential or privileged. 
    The information is intended to be for the use of the individual or company named above. If you have received this transmission in error, 
    please notify us by replying to this email.
    </p>
    ` , css: `.disclaimer{
      color : grey;
      font-size: 9px;
  
    }` }
}


export function SendOtpEmailBody(otp: string = 'INSERT Here', email: string = 'INSERT Here') {

  // let subject: string = `Evaluate  OTP `
  let subject: string = `Evaluate OTP (#${new Date().getTime()}) `

  let disclaimer_data = EmailDisclaimer(email)
  let img_cid = 'img_id';
  const output = `
      <!DOCTYPE html>
  
      <head>
     
      <style type="text/css">
      html {
        height: 100%;
    }
    .content {
      width: 40%;
      margin: 0 auto;
      color : black;
      
  
  }
  
  table{
    width:100%
  }
  table, th {
    border:1px solid #E1E1E1;
    text-align: center;
    border-collapse: collapse;
  }
  tr{
    height : 25px;
    text-align: left;
  }
  th{
    background-color: #66B7D1;
    color : white;
    height : 60px;
    font-size: 18px;
    
  }
  .button{
    
    color: #66B7D1;
    text-align: center;
    display: block;
  }
  ${disclaimer_data.css}
  
  @media only screen and (max-width: 767px) {
    .content {
        width: 100%;
        max-width: 100%;
        padding: 10px;
      }
    }
  
    </style>
    </head>
    <html>
      <body class="content">
      <div>
      <img src=${EVALUATE_LOGO_URL}  width="114" height="30"  alt="Image">
      <hr>
      <br> 
      <p class = "detail">  <strong> Below is your one time password </strong>, <br> 
      Please note that this code is valid for only 2 minutes.
       </p>
      <table >
      <thead>
    <tr>
      <th>${otp}</th>
    </tr>
    </thead>
    </table>
    <p>
    <br>
    If you did not request it, you can ignore this email or let us know at <u>${EVALUATE_INFO_EMAIL}</u> 
    </p>
  <br>
  <hr>
  ${disclaimer_data.html}
  </div>
  </body>
  </html>
      
      `;
  return { body: output, subject: subject, cid: img_cid, file_path: '/email_images/logo.png' };



}
export function UserSignupNotificationEmailBody(userName: string = 'New User', userEmail: string) {

  let adminEmail = 'evaluate786@gmail.com'

  let subject: string = `New User Signup Notification - ${userName} (#${new Date().getTime()})`;

  let disclaimer_data = EmailDisclaimer(adminEmail);
  let img_cid = 'img_id';
  const output = `
      <!DOCTYPE html>
      <html>
      <head>
        <style type="text/css">
          html {
            height: 100%;
          }
          .content {
            width: 50%;
            margin: 0 auto;
            color: black;
          }
          table {
            width: 100%;
          }
          table, th {
            border: 1px solid #E1E1E1;
            text-align: center;
            border-collapse: collapse;
          }
          tr {
            height: 25px;
            text-align: left;
          }
          th {
            background-color: #66B7D1;
            color: white;
            height: 60px;
            font-size: 18px;
          }
          .button {
            color: #66B7D1;
            text-align: center;
            display: block;
          }
          ${disclaimer_data.css}
          @media only screen and (max-width: 767px) {
            .content {
              width: 100%;
              max-width: 100%;
              padding: 10px;
            }
          }
        </style>
      </head>
      <body class="content">
        <div>
          <img src=${EVALUATE_LOGO_URL} width="114" height="30" alt="Image">
          <hr>
          <br>
          <p class="detail"><strong>New User Signup Notification</strong></p>
          <p class="detail">A new user has signed up:</p>
          <p class="detail"><strong>User Name:</strong> ${userName}</p>
          <p class="detail"><strong>User Email:</strong> ${userEmail}</p>
          <p class="detail">Please review the new user registration and take the necessary actions.</p>
          <br>
          <hr>
          ${disclaimer_data.html}
        </div>
      </body>
      </html>
    `;

  return { body: output, subject: subject, cid: img_cid, file_path: '/email_images/logo.png' };
}

export function UserApprovalNotificationEmailBody(userName: string, userEmail: string) {

  let subject: string = `Registration Approved - Welcome to Our Platform, ${userName}!`;

  let disclaimer_data = EmailDisclaimer(userEmail);
  let img_cid = 'img_id';
  const output = `
      <!DOCTYPE html>
      <html>
      <head>
        <style type="text/css">
          html {
            height: 100%;
          }
          .content {
            width: 50%;
            margin: 0 auto;
            color: black;
          }
          table {
            width: 100%;
          }
          table, th {
            border: 1px solid #E1E1E1;
            text-align: center;
            border-collapse: collapse;
          }
          tr {
            height: 25px;
            text-align: left;
          }
          th {
            background-color: #66B7D1;
            color: white;
            height: 60px;
            font-size: 18px;
          }
          .button {
            color: #66B7D1;
            text-align: center;
            display: block;
          }
          ${disclaimer_data.css}
          @media only screen and (max-width: 767px) {
            .content {
              width: 100%;
              max-width: 100%;
              padding: 10px;
            }
          }
        </style>
      </head>
      <body class="content">
        <div>
          <img src=${EVALUATE_LOGO_URL} width="114" height="30" alt="Image">
          <hr>
          <br>
          <p class="detail"><strong>Registration Approved</strong></p>
          <p class="detail">Dear ${userName},</p>
          <p class="detail">We are pleased to inform you that your user registration has been approved and the verification process is complete.</p>
          <p class="detail">You can now start using our platform to its fullest potential. We are excited to have you on board!</p>
          <p class="detail">If you have any questions, feel free to reach out to us at <a href="mailto:evaluate786@gmail.com">evaluate786@gmail.com</a>.</p>
          <br>
          <hr>
          ${disclaimer_data.html}
        </div>
      </body>
      </html>
    `;

  return { body: output, subject: subject, cid: img_cid, file_path: '/email_images/logo.png' };
}



export function AccountCreationEmailBody(email: string = 'INSERT Here') {

  let subject: string = `Evaluate Account Successfully Created (#${new Date().getTime()}) `;

  let disclaimer_data = EmailDisclaimer(email);
  let img_cid = 'img_id';
  const output = `
      <!DOCTYPE html>
    
      <head>
     
      <style type="text/css">
      html {
        height: 100%;
      }
      .content {
        width: 40%;
        margin: 0 auto;
        color : black;
      }
    
      table{
        width:100%
      }
      table, th {
        border:1px solid #E1E1E1;
        text-align: center;
        border-collapse: collapse;
      }
      tr{
        height : 25px;
        text-align: left;
      }
      th{
        background-color: #66B7D1;
        color : white;
        height : 60px;
        font-size: 18px;
      }
      .button{
        color: #66B7D1;
        text-align: center;
        display: block;
      }
      ${disclaimer_data.css}
    
      @media only screen and (max-width: 767px) {
        .content {
            width: 100%;
            max-width: 100%;
            padding: 10px;
        }
      }
      </style>
      </head>
      <html>
      <body class="content">
      <div>
      <img src=${EVALUATE_LOGO_URL}  width="114" height="30"  alt="Image">
      <hr>
      <br>
      <p class="detail"><strong>Your account has been successfully created at Evaluate.</strong></p>
      <p class="detail">If you have any questions or need assistance, please feel free to reach out to us at <u>${EVALUATE_INFO_EMAIL}</u>.</p>
      <p class="detail">Thank you for joining Evaluate!</p>
      <br>
      <hr>
      ${disclaimer_data.html}
      </div>
      </body>
      </html>
    `;

  return { body: output, subject: subject, cid: img_cid, file_path: '/email_images/logo.png' };
}

export function ParentSurveyFillingRequest(email: string = 'INSERT Here', user_name: string = "INSERT Here") {

  let subject: string = `Parents Survey Request from ${user_name}  (#${new Date().getTime()}) `;

  let disclaimer_data = EmailDisclaimer(email);
  let img_cid = 'img_id';
  const output = `
      <!DOCTYPE html>
    
      <head>
     
      <style type="text/css">
      html {
        height: 100%;
      }
      .content {
        width: 40%;
        margin: 0 auto;
        color : black;
      }
    
      table{
        width:100%
      }
      table, th {
        border:1px solid #E1E1E1;
        text-align: center;
        border-collapse: collapse;
      }
      tr{
        height : 25px;
        text-align: left;
      }
      th{
        background-color: #66B7D1;
        color : white;
        height : 60px;
        font-size: 18px;
      }
      .button{
        color: #66B7D1;
        text-align: center;
        display: block;
      }
      ${disclaimer_data.css}
    
      @media only screen and (max-width: 767px) {
        .content {
            width: 100%;
            max-width: 100%;
            padding: 10px;
        }
      }
      </style>
      </head>
      <html>
      <body class="content">
      <div>
      <img src=${EVALUATE_LOGO_URL}  width="114" height="30"  alt="Image">
      <hr>
      <br>
      <p class="detail"><strong>${user_name} has requested you to request fill review survey. You can get details in your Evaluate account.  </strong></p>
      <p class="detail">If you have any questions or need assistance, please feel free to reach out to us at <u>${EVALUATE_INFO_EMAIL}</u>.</p>
      <p class="detail">Thank you for joining Evaluate!</p>
      <br>
      <hr>
      ${disclaimer_data.html}
      </div>
      </body>
      </html>
    `;

  return { body: output, subject: subject, cid: img_cid, file_path: '/email_images/logo.png' };
}
