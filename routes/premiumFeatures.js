const express = require("express")

const authMiddleware = require("../middleware/auth");
const premiumController = require("../controllers/premiumController")

const router= express.Router();

router.get("/showLeaderBoard",authMiddleware.authenticate,premiumController.getUserLeaderBoard);

module.exports=router;