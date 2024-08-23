import randomAvatar from "./images/mrraandom.png";

export type User = {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
};

export const user: User = {
  id: 10,
  avatar: randomAvatar,
  firstName: "Filip",
  lastName: "Petrovic",
};
