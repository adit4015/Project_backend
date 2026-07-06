import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=Router()


 // now if the route matches register we will call this function or controller whcih we have imported
// ✅ CORRECT: Chain the .post() method to the route map
router.route("/register").post(registerUser);

export default router
