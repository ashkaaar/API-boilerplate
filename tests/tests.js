// test/postsController.test.js

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');

describe('Posts API', () => {
    let id;
  
    describe('POST /api/posts', () => {
      it('should create a new post', async function() {
        this.timeout(5000);
        const newPost = {
          title: 'Test Post',
          content: 'This is a test post.'
        };
  
        const res = await request(app).post('/api/posts').send(newPost);
        if (res.error) throw res.error;
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal(newPost.title);
        expect(res.body.content).to.equal(newPost.content);
  
        // Save the ObjectId of the new post
        id = res.body._id;
      });
    });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should get a post by id', async () => {
      const res = await request(app).get(`/api/posts/${id}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.equal(id);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post', async () => {
      const updatedPost = {
        title: 'Updated Post',
        content: 'This is an updated post.'
      };

      const res = await request(app).put(`/api/posts/${id}`).send(updatedPost);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.title).to.equal(updatedPost.title);
      expect(res.body.content).to.equal(updatedPost.content);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const res = await request(app).delete(`/api/posts/${id}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Post removed');
    });
  });

  describe('GET /api/posts/latest/:n', () => {
    it('should get the latest n posts', async () => {
      const n = 3; // Number of latest posts to fetch
      const res = await request(app).get(`/api/posts/latest/${n}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(n);
    });
  });

  describe('GET /api/posts/search/:keyword', () => {
    it('should search posts by keyword', async () => {
      const keyword = 'test'; // Keyword to search for
      const res = await request(app).get(`/api/posts/search/${keyword}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      // Add more assertions based on your search functionality
    });
  });

  describe('GET /api/posts/popular', () => {
    it('should get popular posts', async () => {
      const res = await request(app).get('/api/posts/popular');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      // Add more assertions based on your popular posts functionality
    });
  });

  describe('GET /api/posts/recommended/:id', () => {
    it('should get recommended posts for a user', async () => {
      const res = await request(app).get(`/api/posts/recommended/${id}`);
      if (res.error) throw res.error;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      // Add more assertions based on your recommended posts functionality
    });
  });

  // Add more tests for other routes and scenarios
});