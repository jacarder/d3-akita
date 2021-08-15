export interface Friend {
	name: string;
	age: number;
	weight: number;
}

export const createFriend = (params: Partial<Friend>): Friend => {
  return {
    name: '',
    age: null,
    weight: null,
    ...params
  } as Friend;
}
