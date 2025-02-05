import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const sendSignUpSuccessfulEmail = async (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;
    const templatePath = path.join(__dirname, "../views", 'SignUPEmail.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ name });

    const mailOptions = {
        from: `WorkHub  <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to Our Platform",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
};