import { petsService, usersService } from "../services/index.js";
import { generateUsers, generatePets } from "../utils/index.js";

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);
  res.send({ status: "success", message: "User deleted" });
};

const mockUsers = async (req, res) => {
  const users = await generateUsers(50);
  res.status(200).json({
    status: "success",
    payload: users,
  });
};

const generateData = async (req, res) => {
  const { users, pets } = req.body;
  const petsArray = generatePets(Number(pets));
  const usersArray = await generateUsers(Number(users));
  usersArray.map((user) => {
    usersService.create(user);
  });
  petsArray.map((pet) => {
    petsService.create(pet);
  });
  res.status(200).json({
    status: "success",
    payload: {
      users: usersArray,
      pets: petsArray,
    },
  });
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  mockUsers,
  generateData,
};
