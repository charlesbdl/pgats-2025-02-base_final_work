// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const checkoutService = require('../../../src/services/checkoutService.js');
const userService = require('../../../src/services/userService.js');

const app = require('../../../rest/app.js');

describe('TEST CHECKOUT CONTROLLER ', () => {
        it('Mock: Quando moco service para retornar o erro: Produto não encontrado', async () => {
            sinon.stub(userService, 'verifyToken').returns({ id: 1, name: 'mock user' });
            const token = 'fake-token';
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws(new Error('Produto não encontrado'));

                const response = await request(app)
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

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Produto não encontrado');
            sinon.restore();
        });

        it('Mock: Quando moco service para retornar o erro: Dados do cartão obrigatórios para pagamento com cartão', async () => {
            sinon.stub(userService, 'verifyToken').returns({ id: 1, name: 'mock user' });
            const token = 'fake-token';
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws(new Error('Dados do cartão obrigatórios para pagamento com cartão'));

                const response = await request(app)
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

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Dados do cartão obrigatórios para pagamento com cartão');
            sinon.restore();
        });
    });
