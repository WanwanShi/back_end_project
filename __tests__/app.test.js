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

describe("/api/topics",()=>{
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

    test("GET 404, Responds with 404 error and message of 'Route does not exist'", ()=> {
        return request(app)
        .get("/api/wrongtopicsroute")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route does not exist")
        })
    })
})

describe("/api", ()=> {
    test("GET 200: Responds with an objects describe all available endpoints", ()=> {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
    test("GET 404, Responds with 404 error and message of 'Route does not exist'", ()=> {
        return request(app)
        .get("/wrongapiroute")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route does not exist")
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

    test("GET 400: Responds with 400 err and msg 'Bad request:Invalid article_id type'",()=> {
        return request(app)
        .get("/api/articles/Not_a_ID_type")
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request!")
        })
    })

    test("GET 404: Responds with 404 err and msg 'Not found'",()=> {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({body})=> {
            expect(body.msg).toBe("Not found")
        })
    })
})

describe("/api/articles",() => {
    test("GET 200: Responds with array of all the articles objects", ()=> {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const articles = body
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
})