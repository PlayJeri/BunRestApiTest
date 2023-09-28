import Database from "bun:sqlite"

export const test_db = new Database("test.db", { create: true });

const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )`

const createPosts = `
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            user TEXT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user) REFERENCES users (id)
        )`

const createComments = `
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY,
                user_id TEXT,
                post_id INTEGER,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            )`

const createCommentLikes = `
                CREATE TABLE IF NOT EXISTS comment_likes (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT,
                    comment_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
                )`

const createPostLikes = `
            CREATE TABLE IF NOT EXISTS post_likes (
                id INTEGER PRIMARY KEY,
                user_id TEXT,
                post_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            )`

const createFollows = `
                CREATE TABLE IF NOT EXISTS follows (
                    id INTEGER PRIMARY KEY,
                    follower_id TEXT,
                    followed_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
                    FOREIGN KEY (followed_id) REFERENCES users (id) ON DELETE CASCADE
                )`

test_db.query(createUsers).run();
test_db.query(createPosts).run();
test_db.query(createPostLikes).run();
test_db.query(createComments).run();
test_db.query(createCommentLikes).run();
test_db.query(createFollows).run();
                