import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import usersController from "../controllers/users.controller.js";

const router = Router();

router.get("/mockingpets/:quantity", petsController.mockPets);

router.get("/mockingusers", usersController.mockUsers);

router.post("/generateData", usersController.generateData);

export default router;
