import { User } from "src/database/entities/User.entity";
import { FindOptionsSelect } from "typeorm";

export const USER_BASIC_SELECT: FindOptionsSelect<User> = {
    id: true,
    userName: true,
    firstName: true,
    lastName: true,
    profilePicture: {
        url: true,
    },
};

export const USER_PROFILE_SELECT: FindOptionsSelect<User> = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  profilePicture: {
    url: true,
  },
  birthDate: true,
  bio: true,
  isPrivate: true,
  followerCount: true,
  followedCount: true,
  myFollowers: {
    id: true,
    status:true,
    followed: {
      id: true,
    },
  },
};