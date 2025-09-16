// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
import { faker } from '@faker-js/faker';
const app = require('../../../rest/app.js');
const userService = require('../../../src/services/userService.js');


describe('TEST USER CONTROLLER', () => {
    afterEach(() => {
        sinon.restore();
    });
    it('Mock: registro de usuário com sucesso', async () => {
        const userMock = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email()
        };
        sinon.stub(userService, 'registerUser').returns(userMock);

        const resposta = await request(app)
            .post('/api/users/register')
            .send({
                name: userMock.name,
                email: userMock.email,
                password: '123456'
            });
        expect(resposta.status).to.equal(201);
        expect(resposta.body.user).to.include({ name: userMock.name, email: userMock.email }); 
       });



    it('Mock: autenticação de usuário com sucesso', async () => {
        const tokenMock = 'mocked-jwt-token';
        sinon.stub(userService, 'authenticate').returns({ token: tokenMock });

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'teste@email.com',
                password: '123456'
            });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token', tokenMock);
        sinon.restore();
    });
});
