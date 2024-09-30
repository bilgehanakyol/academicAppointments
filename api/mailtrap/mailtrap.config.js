import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "İSTE",
};
const recipients = [
  {
    email: "akyolbilgehan0@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "e96a7a1f-02de-4309-842d-2dfe5bc4c185",
    template_variables: {
      "company_info_name": "Test_Company_info_name",
      "name": "Test_Name"
    }
  })
  .then(console.log, console.error);