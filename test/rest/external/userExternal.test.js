const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

const app = require('../../../rest/app.js');


describe('User', () => {
    describe('POST Login And POST Register', () => {

        it('Não permite registro de usuários com  mesmo email', async () => {
             await request(app)
                .post('/api/users/register')
                .send({
                    name: faker.person.fullName(),
                    email: 'teste@emailrepetido.com',
                    password: "11111"

                });

            const resposta = await request(app)
                .post('/api/users/register')
                .send({
                    name: faker.person.fullName(),
                    email: 'teste@emailrepetido.com',
                    password: "11111"

                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
        });

        it('Não permite login com credencias invalidas', async () => {

            const resposta = await request(app)
                .post('/api/users/login')
                .send({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.string.numeric(6)
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Credenciais inválidas');
        });

        it.only('Criar e logar com um novo usuário com sucesso', async () => {
             const password =  faker.string.numeric(6);
             const email = faker.internet.email();

             const responseRegister = await request(app)
                .post('/api/users/register')
                .send({
                    name: faker.person.fullName(),
                    email: email,
                    password: password
                });
            console.log('response register:', responseRegister.body);           

            const resposta = await request(app)
                .post('/api/users/login')
                .send({
                    email:email,
                    password: password
                });

            console.log('response login:', resposta.body);           

            expect(resposta.status).to.equal(200);

        });        

    });
   
});
