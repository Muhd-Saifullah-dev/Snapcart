export const otpEmailTemplate = ({
  title,
  otp,

}: {
  title: string;
  otp: string | number;


}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f0fdf4; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#16a34a; padding:24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:26px;">
                Snapcart
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; text-align:center;">
              <h2 style="margin-top:0; color:#14532d;">
                ${title}
              </h2>

              <p style="font-size:16px; color:#374151; margin-bottom:24px;">
                Use the OTP below to continue. This OTP is valid for a short time.
              </p>

              <!-- OTP Box -->
              <div style="
                display:inline-block;
                padding:16px 32px;
                border-radius:10px;
                background:#f0fdf4;
                border:2px dashed #16a34a;
                font-size:28px;
                letter-spacing:6px;
                font-weight:bold;
                color:#14532d;
              ">
                ${otp}
              </div>

              <p style="font-size:14px; color:#6b7280; margin-top:24px;">
                Do not share this OTP with anyone.
              </p>

              <p style="font-size:13px; color:#9ca3af; margin-top:16px;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

    
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
