const express = require("express");

const expenseController = require("../controllers/expense");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post(
  "/add-expense",
  authMiddleware.authenticate,
  expenseController.addexpense
);
router.get(
  "/get-expense",
  authMiddleware.authenticate,
  expenseController.getexpense
);
router.get(
  "/del-expense/:id",
  authMiddleware.authenticate,
  expenseController.delexpense
);


module.exports = router;
