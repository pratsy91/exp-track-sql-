const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../database");


const getUserLeaderBoard=async (req,res,next)=>{
         try {
          const leaderBoard = await User.findAll({
            attributes:["id","name",[sequelize.fn("sum",sequelize.col("expenses.amount")),"total_amount"]],
            include:[
              {
                model:Expense,
                attributes:[],
              }
            ],
            group:["user.id"],
            order:[["total_amount","DESC"]]
          });

          return res.status(201).json(leaderBoard);
         } catch (error) {
          return res.status(500).json(error);
         }
}

module.exports ={
  getUserLeaderBoard,
}