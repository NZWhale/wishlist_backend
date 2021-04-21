function createMessage(token: string) {
    const emailMessage = `
<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
      style="font-family:'playfair display', georgia, 'times new roman', serif">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>Новое письмо</title>
    <!--[if (mso 16)]>
    <style type="text/css">     a {
        text-decoration: none;
    }     </style><![endif]-->
    <!--[if gte mso 9]>
    <style>sup {
        font-size: 100% !important;
    }</style><![endif]-->
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <!--[if !mso]>-->
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
</head>

<body
        style="width:100%;font-family:'playfair display', georgia, 'times new roman', serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
<div style="max-width:600px;margin:0 auto"><h1 width="120" height="36"
                                                style="margin-top:0;margin-right:0;margin-bottom:32px;margin-left:0px;padding-right:30px;padding-left:30px"
                                                alt="" class="CToWUd">Doobki</h1>
    <h1 style="font-size:30px;padding-right:30px;padding-left:30px">Confirm your email address</h1>
    <p style="font-size:17px;padding-right:30px;padding-left:30px"> Your confirmation code is below — enter it in your
        open browser window and we'll help you get signed in. </p>
    <div style="padding-right:30px;padding-left:30px;margin:32px 0 40px">
        <table style="border-collapse:collapse;border:0;background-color:#f4f4f4;height:70px;table-layout:fixed;word-wrap:break-word;border-radius:6px">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:middle;font-size:30px">${token}</td>
            </tr>
            </tbody>
        </table>
    </div>
    <p style="font-size:17px;padding-right:30px;padding-left:30px"></p>
    <p style="font-size:17px;padding-right:30px;padding-left:30px">If you didn’t request this email, there’s nothing to
        worry about — you can safely ignore it.</p></div>
</body>

</html>`

    return emailMessage
}

export default createMessage