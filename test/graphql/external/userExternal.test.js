const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const faker = require('faker');

const BASE_URL_GRAPHQL = process.env.BASE_URL_GRAPHQL || 'http://localhost:4000/graphql';

describe('EXTERNAL TESTS USER GRAPHQL', () => {
    let token;

   it('Logar com usuário existente via GraphQL', async () => {
        const loginMutation = {
            query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
            variables: { email: 'alice@email.com', password: '123456' }
        };

        const response = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(loginMutation);
  
        token = response.body.data.login.token;
        expect(token).to.not.be.null;
    });

    it('Registrar um novo usuário via GraphQL e retornar na resposta o email e nome', async () => {
        const name = faker.name.findName()
        const email = faker.internet.email()
        const password = String(faker.random.number({ min: 100000, max: 999999 }))

        const registerMutation = {
            query: `mutation Register($name: String!, $email: String!, $password: String!) { register(name: $name, email: $email, password: $password) { name email } }`,
            variables: { name: name, email: email, password: password }
        };
        const resposta = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(registerMutation);
    
        expect(resposta.status).to.equal(200);
        expect(resposta.body.data.register).to.include({ name: name, email: email });
    });

    it('Deve registrar um novo usuário via GraphQL e retornar na resposta somente o email', async () => {
        const name = faker.name.findName()
        const email = faker.internet.email()
        const password = String(faker.random.number({ min: 100000, max: 999999 }))

        const registerMutation = {
            query: `mutation Register($name: String!, $email: String!, $password: String!) { register(name: $name, email: $email, password: $password) { email } }`,
            variables: { name: name, email: email, password: password }
        };
        const response = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(registerMutation);

        expect(response.status).to.equal(200);
        expect(response.body.data.register).to.include({ email: email });
        expect(response.body.data.register).to.not.have.property('name');
    });

    it('Deve retornar erro ao registrar usuário já existente via GraphQL', async () => {
        const registerMutation = {
            query: `mutation Register($name: String!, $email: String!, $password: String!) { register(name: $name, email: $email, password: $password) { name email } }`,
            variables: { name: 'Alice', email: 'alice@email.com', password: '123456' }
        };
        const resposta = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(registerMutation);
        expect(resposta.status).to.equal(200);
        expect(resposta.body.errors[0].message).to.match(/Email já cadastrado/i);
    });

   
});
