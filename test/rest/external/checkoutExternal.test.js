// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

const app = require('../../../rest/app.js');


describe('Checkout ', () => {
    describe('POST /checkout', () => {

        it('Quando logo com um usuário válido mas preencho valores invalidos na requisição do checkout', async () => {
            let token;

            await request(app)
                .post('/api/users/register')
                .send({
                    username: 'joao augusto',
                    password: '1111111'
                });

            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'joao augusto',
                    password: '1111111'
                });

            token = respostaLogin.body.token;
            console.log('response login:', token);           
           
            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: 'invalido',
                    quantity: -1
                });
            expect(resposta.status).to.equal(400);

            expect(resposta.body).to.have.property('error');
        });


        it('Fazendo um checkout com sucesso', async () => {
           let token;

            const respostaRegister = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'joao augusto',
                    email: 'joaozinho@hotmai.com',
                    password: '1111111'
                });
            console.log('USUÁRIO REGISTRADO:', respostaRegister.body);           

            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'joaozinho@hotmai.com',
                    password: '1111111'
                });

            token = respostaLogin.body.token;
            console.log('TOKEN GERADO:', token);           
           
                const resposta = await request(app)
                    .post('/api/checkout')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        items: [
                            {
                                productId: 1,
                                quantity: 2
                            }
                        ],
                        freight: 10,
                        paymentMethod: "boleto",
                        cardData: {
                            number: "1234567890123456",
                            name: "Teste",
                            expiry: "12/30",
                            cvv: "123"
                        }
                    });

                console.log('response checkout:', resposta.body);
                expect(resposta.status).to.equal(200);
                expect(resposta.body).to.have.property('items');
                expect(resposta.body).to.have.property('freight', 10);
                expect(resposta.body).to.have.property('paymentMethod', 'boleto');
        });





        // it('Usando Mocks: Quando informo dados inválidos recebo 400', async () => {
        //     const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
        //     checkoutServiceMock.throws(new Error('Produto ou quantidade inválida'));

        //     const resposta = await request(app)
        //         .post('/api/checkout')
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({
        //             productId: 'invalido',
        //             quantity: -1
        //         });
        //     expect(resposta.status).to.equal(400);
        //     expect(resposta.body).to.have.property('error', 'Produto ou quantidade inválida');
        // });

        // it('Usando Mocks: Quando informo dados válidos recebo 201 CREATED', async () => {
        //     const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
        //     checkoutServiceMock.returns({
        //         productId: 'validId',
        //         quantity: 2,
        //         date: new Date().toISOString()
        //     });

        //     const resposta = await request(app)
        //         .post('/api/checkout')
        //         .set('Authorization', `Bearer ${token}`)
        //         .send({
        //             productId: 'validId',
        //             quantity: 2
        //         });
        //     expect(resposta.status).to.equal(201);
        //     expect(resposta.body).to.have.property('productId', 'validId');
        //     expect(resposta.body).to.have.property('quantity', 2);
        // });


    });
});
