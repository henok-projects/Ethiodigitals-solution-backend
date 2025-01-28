require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/contact', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Serve React static files
app.use(express.static(path.join(__dirname, '../')));

// Fallback to React for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://ethiodigitals-solution-project-y6sg.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies if needed
  })
);

// Middleware to handle preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).send(); // Send response for preflight
  }
  next();
});

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  const htmlTemplate = `
  <div style="width:800px; margin:0 auto; background-color:rgb(32, 72, 249); font-family:Arial, sans-serif; color:#fff;">
    <table cellpadding="10" cellspacing="0" border="0" width="100%" style="border:1px solid #ddd; background:#fff;">
      <!-- Header Section -->
      <tr>
        <td style="background:rgb(8, 24, 94); padding:15px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:24px;">Ethio digitals solution</h1>
         <h2 className="text-3xl font-bold text-gray-900 mb-6 sm:text-4xl">Ethio Digitals Solution</h2>
         <p className="text-lg text-gray-700 mb-8">Empowering Brands with Digital Marketing Excellence</p>
         <p className="text-base text-gray-600">Your Partner in Achieving Online Success</p>
        </td>
      </tr>

      <!-- Welcome Banner -->
      <tr>
       <td style="padding:20px; margin-left:10px;">
          <img src="cid:logo" alt="Clinic Logo" style="width:50px; height:50px; margin-bottom:10px; border-radius:50%; object-fit:cover;" />
       </td>
      </tr>

      <!-- Message Section -->
      <tr>
        <td style="padding:20px;">
          <h2 style="font-size:18px; color:rgb(8, 24, 94); margin:0 0 15px;">Hello ${firstName},</h2>
          <p style="font-size:14px; line-height:22px; margin:0 0 20px; color:#333;">
            Thank you for reaching out to Ethio digitals solution. We appreciate your interest and will get back to you shortly.
          </p>
          <p style="font-size:14px; margin:0 0 10px; color:#333;">Here is a copy of your message:</p>
          <div style="border-left:4px solid rgb(8, 24, 94); padding-left:15px; margin:10px 0; background:#f4f4f4; color:#333;">
            <p style="margin:0; font-size:14px;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin:10px 0 0; font-size:14px;"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="font-size:14px; margin:20px 0 5px;">Best regards,</p>
          <p style="font-size:14px; font-weight:bold; margin:0; color:#333;">Ethio digitals solution</p>
        </td>
      </tr>

      <!-- Footer Section -->
      <tr>
        <td style="background:rgb(8, 24, 94); text-align:center; color:#fff; padding:15px;">
          <p style="margin:5px 0;">For support, call: <strong>+251993934377</strong></p>
          <p style="margin:5px 0;">Email: <strong>henokaddis72@gmail.com</strong></p>
          <p style="margin:10px 0 0; font-size:12px;">&copy; ${new Date().getFullYear()} Ethio digitals solution. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;
  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`, // Your email as the sender
      to: process.env.WEBSITE_OWNER_EMAIL, // Website owner's email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
    <div style="width:800px; margin:0 auto; background-color:rgb(8, 24, 94); font-family:Arial, sans-serif; color:#fff;">
      <table cellpadding="10" cellspacing="0" border="0" width="100%" style="border:1px solid #ddd; background:#fff;">
        <!-- Header Section -->
        <tr>
          <td style="background:rgb(8, 24, 94); padding:15px; text-align:center; color:#fff;">
            <h1 style="margin:0; font-size:24px;">Ethio digitals solution</h1>
            <p style="margin:5px 0; font-size:14px;">New Contact Form Submission</p>
          </td>
        </tr>
         <!-- Welcome Banner -->
        <tr>
          <td style="padding:20px; margin-left:10px;">
            <img src="cid:logo" alt="Clinic Logo" style="width:50px; height:50px; margin-bottom:10px; border-radius:50%; object-fit:cover;" />
          </td>
        </tr>
        <!-- Contact Details Section -->
        <tr>
          <td style="padding:20px;">
            <h2 style="font-size:18px; color:rgb(8, 24, 94); margin:0 0 15px;">Contact Details</h2>
            <div style="border-left:4px solid rgb(8, 24, 94); padding-left:15px; margin:10px 0; background:#f4f4f4; color:#333;">
              <p style="margin:0; font-size:14px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin:10px 0 0; font-size:14px;"><strong>Message:</strong> ${message}</p>
            </div>
          </td>
        </tr>

        <!-- Footer Section -->
        <tr>
          <td style="background:rgb(8, 24, 94); text-align:center; color:#fff; padding:15px;">
            <p style="margin:5px 0;">For support, call: <strong>+251993934377</strong></p>
            <p style="margin:5px 0;">Email: <strong>henokaddis72@gmail.com</strong></p>
            <p style="margin:10px 0 0; font-size:12px;">&copy; ${new Date().getFullYear()} Ethio digitals solution. All Rights Reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `,
      attachments: [
        {
          filename: 'logo.jpeg',
          path: './logo.jpeg', // Local path to the image
          cid: 'logo', // Use the same `cid` in the HTML `src`
        },
      ],
    });
    // Confirmation email to the user
    await transporter.sendMail({
      from: `"Ethio digitals solution" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We Received Your Message',
      html: htmlTemplate,
      attachments: [
        {
          filename: 'logo.jpeg', // Name of the image file
          path: './logo.jpeg', // Path to the image on your server
          cid: 'logo', // Match this `cid` to the `src` in the HTML
        },
      ],
    });

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
