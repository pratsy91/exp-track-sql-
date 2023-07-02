const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./database");

var cors = require("cors");
const userRoutes = require("./routes/user");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const Forgotpassword = require("./models/forgotpassword");

const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premiumFeatures");
const resetPasswordRoutes = require("./routes/resetpassword");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

let port = 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT | port);
  })
  .catch((err) => {
    console.log(err);
  });
