const { where, DATE } = require("sequelize");
const Expense = require("../models/expense");

const addexpense = (req, res) => {
  const { amount, description, category } = req.body;
  const id = req.user.id;

  Expense.create({ amount, description, category, userId: id })
    .then((expen) => {
      return res.status(201).json({ expen, success: true });
    })
    .catch((err) => {
      return res.status(403).json({ error: err, success: false });
    });
};

const expense_per_page = 2;
const getexpense = (req, res) => {
  const page = +req.query.page || 1;
  let total_epenses = 0;
  Expense.count({ where: { userId: req.user.id } })
    .then((total) => {
      total_epenses = total;
      return Expense.findAll({
        where: { userId: req.user.id },
        offset: (page - 1) * expense_per_page,
        limit: expense_per_page,
      });
    })
    .then((expenses) => {
      return res.status(201).json({
        expenses,
        current_page: page,
        hasNextPage: expense_per_page * page < total_epenses,
        hasPreviousPage: page > 1,
        next_page: page + 1,
        previous_page: page - 1,
        first_page: 1,
        last_page: Math.ceil(total_epenses / expense_per_page),
        success: true,
      });
    });
};

const delexpense = (req, res) => {
  const expenseId = req.params.id;
  const id = req.user.id;
  if (expenseId == undefined || expenseId.length === 0) {
    return res.status(400).json({ success: false });
  }

  Expense.destroy({ where: { id: expenseId, userId: id } })
    .then((noOfRows) => {
      if (noOfRows === 0) {
        return res.status(404).json({ success: false });
      }
      return res.status(201).json({ success: true });
    })
    .catch((error) => {
      return res.status(500).json({ error, success: false });
    });
};

module.exports = {
  addexpense,
  getexpense,
  delexpense,
};
