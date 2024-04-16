const db = require("../db/connection")
const request = require("supertest")
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json")

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(data);
});

describe("/api/topics",() => {
    test("GET 200, responds with array of all topic objects which have slug and description properties", ()=> {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const { topics } = body 
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
                )
            })
        })
    })

})

describe("/NonExistRoute",() => {
    test("GET 404, Responds with 404 error and message of 'Route does not exist'", ()=> {
        return request(app)
        .get("/wrongtopicsroute")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route does not exist")
        })
    })
})

describe("/api", ()=> {
    test("GET 200: Responds with an array of objects describe all available endpoints", ()=> {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const actualEndpointsArray = body;
            const expectedKeys = Object.keys(endpoints)
            expect(actualEndpointsArray.length).toEqual(expectedKeys.length)
            //
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET 200:  Responds with the object that has the required article_id and all the properties",()=> {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toEqual(
                expect.objectContaining({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    votes: 0,
                })
            )
        })
    })

    test("GET 200:  Responds with the object that has the required article_id and all the properties along with the correct comment_count number if there are comments associated with the article_id",()=> {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toEqual(
                expect.objectContaining({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    votes: 0,
                    comment_count: 2
                })
            )
        })
    })

    test("GET 200:  Responds with the object that has the required article_id and the properties along with the comment_count of 0 if there is no comment",()=> {
        return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toEqual(
                expect.objectContaining({
                    article_id: 4,
                    title: "Student SUES Mitch!",
                    topic: "mitch",
                    author: "rogersop",
                    body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    votes: 0,
                    comment_count: 0
                })
            )
        })
    })

    test("GET 400: Responds with 400 error and msg 'Bad request!'",()=> {
        return request(app)
        .get("/api/articles/Not_an_ID_type")
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("GET 404: Responds with 404 error and msg 'Not found'",()=> {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe("Not found")
        })
    })

    test("PATCH 200: Responds with the updated article object",()=> {
        return request(app)
        .patch("/api/articles/3")
        .send({
            inc_votes: 1 
        })
        .expect(200)
        .then(({body}) => {
            const {updatedArticle} = body;
            expect(updatedArticle).toEqual(
                expect.objectContaining({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    votes: 1,
                })
            )
        })
    })

    test("PATCH 400: Respond with error and msg of 'Bad request!' if article_id is wrong data type",()=> {
        return request(app)
        .patch("/api/articles/not_correct_Id_type")
        .send({
            inc_votes: 1 
        })
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("PATCH 404: Respond with error and msg of 'Article_id not found' if article_id is not in the database",()=> {
        return request(app)
        .patch("/api/articles/99999")
        .send({
            inc_votes: 1 
        })
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe("Article_id not found")
        })
    })
    test("PATCH 400: Respond with error and msg of 'Bad request' if the request body is invalid data type",()=> {
        return request(app)
        .patch("/api/articles/5")
        .send({
            inc_votes: 'not a number' 
        })
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request!")
        })
    })
    test("PATCH 200: Responds with the updated article with votes go to 0 if the updated votes less than 0",()=> {
        return request(app)
        .patch("/api/articles/3")
        .send({
            inc_votes: -20 
        })
        .expect(200)
        .then(({body}) => {
            const {updatedArticle} = body;
            expect(updatedArticle).toEqual(
                expect.objectContaining({
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: expect.any(String),
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    votes: 0,
                })
            )
        })
    })
})

describe("/api/articles",() => {
    test("GET 200: Responds with array of all the articles objects", ()=> {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(13)
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        comment_count: expect.any(Number),
                        created_at: expect.any(String),
                        article_img_url: expect.any(String),
                        votes: expect.any(Number),
                    })
                )
            })
        })
    })

    test("GET 404: Responds with 404 error and message of 'Route does not exist'", ()=> {
        return request(app)
        .get("/api/wrongarticlesroute")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route does not exist")
        })
    })

    test("GET 200: Responds with array of article objects filtered by topic query", ()=> {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles.length).toBe(12);
            articles.forEach((article)=> {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: 'mitch',
                        author: expect.any(String),
                        comment_count: expect.any(Number),
                        created_at: expect.any(String),
                        article_img_url: expect.any(String),
                        votes: expect.any(Number),
                    })
                )
            })
        })
    })

    test("GET 400: Responds with error and msg 'Bad request!' if the topic query does not exist in the database", ()=> {
        return request(app)
        .get("/api/articles?topic=topic_does_not_exist_in_database")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("GET 200: Responds msg 'There is no article under this topic.' if the topic query exist but no linked article", ()=> {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
            expect(body.msg).toBe("There is no article under this topic.")
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("GET 200: Responds with array of comments objects for the given article_id", ()=> {
        return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({body})=> {
            const {comments} = body;
            expect(comments.length).toBe(2);
            expect(comments).toBeSortedBy('created_at',{ descending:true })
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String) ,
                        body: expect.any(String),
                        article_id:5
            
                    })
                )
            })
        })
    })

    test("GET 400: Responds with 400 err and msg 'Bad request:Invalid article_id type'",()=> {
        return request(app)
        .get("/api/articles/Not_a_ID_type/comments")
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("GET 404: Responds with 404 err and msg 'Article_id not found' when the id is out of range",()=> {
        return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe("Article_id not found")
        })
    })

    test("GET 200: Responds with 404 err and msg 'Not found' when the id is valid but no comments",()=> {
        return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then(({body})=> {
            expect(body.msg).toBe("There is no comment for this article")
        })
    })

    test("POST 201: Responds with the comment posted", ()=> {
        return request(app)
        .post("/api/articles/7/comments")
        .send({
            username: "lurker",
            body:"This is just something I want to test, Thank you!"
        })
        .expect(201)
        .then(({body}) => {
            const {comment} = body;
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id: 19,
                    body: 'This is just something I want to test, Thank you!',
                    article_id: 7,
                    author: 'lurker',
                    votes: 0,
                    created_at: expect.any(String)
                })
            )
        })
    })
    
    test("POST 400: responds with err and message 'Bad request!' if the article_id is invalid data type", () => {
        return request(app)
        .post("/api/articles/not_correct_id_type/comments")
        .send({
            username: "lurker",
            body:"This is new message I want to test, Thank you!"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("POST 404: responds with err and message 'Bad request!' if the article_id is out of range", () => {
        return request(app)
        .post("/api/articles/999999/comments")
        .send({
            username: "lurker",
            body:"This is new message I want to test, Thank you!"
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })

    test("POST 400: responds with err and message 'Bad request!' if the request body missing username or body", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            body:"This is new message I want to test, Thank you!"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("POST 404: responds with err and message 'Not found' if the request username is not in the users database", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username:"usernamedoesnotexistintheuserdatabase",
            body:"This is new message I want to test, Thank you!"
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })

    test("POST 400: responds with err and message 'Bad request-The comment is empty' if the request body is empty string", () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({
            username:"lurker",
            body:""
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request-The comment is empty")
        })
    })
})

describe("/api/comments/:comment_id", () => {
    test("DELETE 204: Responds with no content and 204 status", () => {
        return request(app)
        .delete("/api/comments/12")
        .expect(204)
    })
    test("DELETE 400: Responds with error msg 'Bad request!' if comment_id is wrong data type", () => {
        return request(app)
        .delete("/api/comments/not_Id_type")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request!")
        })
    })
    test("DELETE 404: Responds with error msg 'comment_id not found' if comment_id is not in the database", () => {
        return request(app)
        .delete("/api/comments/456123")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("comment_id not found")
        })
    })
})

describe("/api/users", () => {
    test("GET 200: Responds with array of user objects with correct properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users.length).toBe(4)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    })
})

