export type ItemType = {
	id: number;
	content: string;
	created: string;
	user: {
		id: number;
		name: string;
	};
	likes: {
		userId: number;
		user: {
			id: number;
			name: string;
		};
	}[];
	comments: {
		id: number;
		content: string;
		created: string;
		userId: number;
		user: {
			id: number;
			name: string;
		};
	}[];
};
