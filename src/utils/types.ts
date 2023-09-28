export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    created_at: number;
    last_login: number;
}

export interface Post {
    id: number;
    user: string;
    content: string;
    created_at: number;
}

export interface Comment {
    id:         number;
    user_id:    string;
    post_id:    number;
    content:    string;
    created_at: number;
}

export interface AllPosts {
    post_id: number;
    post_user: string;
    post_content: string;
    post_created_at: number;
    num_likes: number;
}
