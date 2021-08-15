import cuid from 'cuid';

export interface Friend {
  id: string;
	name: string;
	age: number;
	weight: number;
  friendList: Friend[]
}

export const createFriend = (params: Partial<Friend>): Friend => {
  return {
    id: cuid(),
    name: '',
    age: null,
    weight: null,
    friendList: [],
    ...params
  } as Friend;
}
