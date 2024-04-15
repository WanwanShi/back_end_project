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
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
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