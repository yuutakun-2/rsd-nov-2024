export type ItemType = {
    id: number;
    content: string;
    created: string;
    user: {
        id: number;
        name: string;
        username: string;
    };
    likes: {
        id: number;
        userId: number;
    }[];
    comments: {
        id: number;
        content: string;
        created: string;
        user: {
            id: number;
            name: string;
            username: string;
        };
    }[];
};
