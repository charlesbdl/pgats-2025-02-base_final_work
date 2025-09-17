const request = require('supertest');
const { expect } = require('chai');
const faker = require('faker');
const app = require('../../../rest/app.js');


describe('EXTERNAL TESTS USER REST', () => {
    it('Não permite registro de usuários com  mesmo email', async () => {
        await request(app)
        .post('/api/users/register')
        .send({
            name: faker.name.findName(),
            email: 'teste@emailrepetido.com',
            password: "11111"

        });

    const response = await request(app)
        .post('/api/users/register')
        .send({
            name: faker.name.findName(),
            email: 'teste@emailrepetido.com',
            password: "11111"

        });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
    });

    it('Não permite login com credencias invalidas', async () => {

    const response = await request(app)
        .post('/api/users/login')
        .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: String(faker.random.number({ min: 100000, max: 999999 }))
        });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error', 'Credenciais inválidas');
    });

    it('Criar e logar com um novo usuário com sucesso', async () => {
        const password =  String(faker.random.number({ min: 100000, max: 999999 }));
        const email = faker.internet.email();

        const responseRegister = await request(app)
        .post('/api/users/register')
        .send({
            name: faker.name.findName(),
            email: email,
            password: password
        });

    const response = await request(app)
        .post('/api/users/login')
        .send({
            email:email,
            password: password
        });

    expect(response.status).to.equal(200);
    });        
 });
