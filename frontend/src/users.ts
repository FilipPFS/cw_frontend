import { User } from "./user";

import eglise from "./images/eglise.png";
import cross from "./images/cross.jpg";
import nature from "./images/nature.jpg";
import ai_femme from "./images/ai_femme.jpg";

export const users: User[] = [
  {
    id: 1,
    avatar: eglise,
    firstName: "Alfred",
    lastName: "Davies",
  },
  {
    id: 2,
    avatar: cross,
    firstName: "Mathieu",
    lastName: "Belpo",
  },
  {
    id: 3,
    avatar: ai_femme,
    firstName: "Jessica",
    lastName: "Pulin",
  },
  {
    id: 4,
    avatar: nature,
    firstName: "Brandon",
    lastName: "James",
  },
];
