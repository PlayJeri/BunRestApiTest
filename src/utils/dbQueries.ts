import { dev_db } from "../database/createDb";
import { test_db } from "../../tests/testDb"

const environment = process.env.NODE_ENV || 'development';
console.log("env is", environment);
const db = environment === 'test' ? test_db : dev_db;


export const insertUserQuery = db.query(`
    INSERT INTO users (id, username, password, email) VALUES ($id, $username, $password , $email)
`);

export const updateUserLastLogin = db.query(`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $id
`)

export const getUserWithUsername = db.query(`
    SELECT * from users WHERE username = $username
`);

export const getUserWithEmail = db.query(`
    SELECT email, password from users WHERE email = $email
`);

export const createNewPost = db.query(`
    INSERT INTO posts (user, content) VALUES ($user, $content)
`)

export const createNewComment = db.query(`
    INSERT INTO comments (user_id, post_id, content) VALUES ($user_id, $post_id, $content)
`)

export const getAllPostsQuery = db.query(`
    SELECT
        posts.id AS post_id,
        posts.user AS post_user,
        users.username AS username,
        posts.content AS post_content,
        posts.created_at AS post_created_at,
        COUNT(DISTINCT post_likes.id) AS num_likes
    FROM
        posts
    LEFT JOIN
        post_likes ON posts.id = post_likes.post_id
    JOIN
        users ON posts.user = users.id
    WHERE
        (:cursor IS NULL OR posts.id < :cursor)
    GROUP BY
        posts.id
    ORDER BY
        posts.id DESC
    LIMIT 10
`);

export const getCommentsForPost = db.query(`
    SELECT
        *
    FROM
        comments
    WHERE
        comments.post_id = $postId
`)