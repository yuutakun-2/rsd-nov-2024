type itemType = {
  id: number;
  title: string;
  content: string;
  userId: number;
  created: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    bio: string;
    created: string;
  };
};

export type { itemType };
