// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
const checkoutService = require('../../../src/services/checkoutService.js');
const jwt = require('jsonwebtoken');
const userService = require('../../../src/services/userService.js');

const app = require('../../../rest/app.js');


describe('Checkout ', () => {
    describe('POST /checkout', () => {

        it.only('Usando Mocks: Quando informo dados inválidos recebo 400', async () => {
            sinon.stub(userService, 'verifyToken').returns({ id: 1, name: 'mock user' });
            const token = 'fake-token';
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws(new Error('Produto não encontrado'));

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

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Produto não encontrado');
            sinon.restore();
        });

        // // // // // it('Usando Mocks: Quando informo dados válidos recebo 201 CREATED', async () => {
        // // // // //     const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
        // // // // //     checkoutServiceMock.returns({
        // // // // //         productId: 'validId',
        // // // // //         quantity: 2,
        // // // // //         date: new Date().toISOString()
        // // // // //     });

        // // // // //     const resposta = await request(app)
        // // // // //         .post('/api/checkout')
        // // // // //         .set('Authorization', `Bearer ${token}`)
        // // // // //         .send({
        // // // // //             productId: 'validId',
        // // // // //             quantity: 2
        // // // // //         });
        // // // // //     expect(resposta.status).to.equal(201);
        // // // // //     expect(resposta.body).to.have.property('productId', 'validId');
        // // // // //     expect(resposta.body).to.have.property('quantity', 2);
        // // // // // });


    });
});
