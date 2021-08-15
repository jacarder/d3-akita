import cuid from 'cuid';

export interface Friend {
  id: string;
	name: string;
	age: number;
	weight: number;
}

export const createFriend = (params: Partial<Friend>): Friend => {
  return {
    id: cuid(),
    name: '',
    age: null,
    weight: null,
    ...params
  } as Friend;
}
