const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
// const Sib = require("Sib-api-v3-sdk");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");
const Forgotpassword = require("../models/forgotpassword");

// const client = Sib.ApiClient.instance;
// const apikey = client.authentications["api-key"];

// const tranEmailApi = new Sib.TransactionalEmailsApi();

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      user.createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });

      const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_key: process.env.SEND_GRID_KEY,
          },
        })
      );

      // const sender = {
      //     email,
      // }
      // const recievers=[{
      //     email,
      // }]

      transporter
        .sendMail({
          to: email,
          from: email,
          subject: "Sendings is Fun",
          html: `<a href="http://localhost:5000/password/resetpassword/${id}">Reset password</a>`,
        })
        .then(() => {
          return res.status(202).json({ message: "check your mail!" });
        });

      // tranEmailApi.sendTransacEmail({
      //     sender,
      //     to:recievers,
      //     subject: 'Sendings is Fun',
      //     textContent:`<a href="http://localhost:5000/password/resetpassword/${id}">Reset password</a>`,
      // }).then((response) => {
      //     return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

      // })
      // .catch((error) => {
      //     throw new Error(error);
      // })
      // const msg = {
      //     to: email, // Change to your recipient
      //     from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
      //     subject: 'Sending with SendGrid is Fun',
      //     text: 'and easy to do anywhere, even with Node.js',
      //     html: `<a href="http://localhost:5000/password/resetpassword/${id}">Reset password</a>`,
      // }

      // sgMail
      // .send(msg)
      // .then((response) => {
      //     return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

      // })
      // .catch((error) => {
      //     throw new Error(error);
      // })
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            if (user) {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
