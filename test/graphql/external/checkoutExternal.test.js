const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const faker = require('faker');

const BASE_URL_GRAPHQL = process.env.BASE_URL_GRAPHQL || 'http://localhost:4000/graphql';

describe('EXTERNAL TESTS CHECKOUT GRAPHQL', () => {
   
    it('Deve realizar com sucesso um checkout via GraphQL', async () => {
           
        const loginMutation = {
            query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
            variables: { email: 'alice@email.com', password: '123456' }
        };

        const response = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(loginMutation);
  
        const token = response.body.data.login.token;
        expect(token).to.not.be.null;
        
        const checkoutMutation = {
            query: `mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {\n  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {\n    items {\n      productId\n      quantity\n    }\n  }\n}`,
            variables: {
                items: [{ productId: 1, quantity: 2 }],
                freight: 1,
                paymentMethod: "credit_card",
                cardData: {
                    number: "4111111111111111",
                    name: "Alice",
                    expiry: "12/25",
                    cvv: "123"
                }
            }
        };
        const resposta = await request(BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(checkoutMutation);
        expect(resposta.status).to.equal(200);
        expect(resposta.body.data.checkout.items[0]).to.have.property('productId', 1);
        expect(resposta.body.data.checkout.items[0]).to.have.property('quantity', 2);   
     });

    it('Deve retornar erro ao realizar checkout com produto inválido via GraphQL', async () => {
        const loginMutation = {
            query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
            variables: { email: 'alice@email.com', password: '123456' }
        };

        const response = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(loginMutation);
  
        const token = response.body.data.login.token;
        expect(token).to.not.be.null;
        
        const checkoutMutation = {
            query: `mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {\n  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {\n    items {\n      productId\n      quantity\n    }\n  }\n}`,
            variables: {
                items: [{ productId: 0, quantity: 2 }],
                freight: 1,
                paymentMethod: "credit_card",
                cardData: {
                    number: "4111111111111111",
                    name: "Alice",
                    expiry: "12/25",
                    cvv: "123"
                }
            }
        };
        const resposta = await request(BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(checkoutMutation);
        console.log("response:", JSON.stringify(resposta.body.data, null, 2));   
        expect(resposta.status).to.equal(200);
        expect(resposta.body.errors[0]).to.have.property('message', 'Produto não encontrado');
    });

    it('Deve retornar erro ao tentar fazer checkout sem preencher dados do cartão de credito via GraphQL', async () => {
        const loginMutation = {
            query: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`,
            variables: { email: 'alice@email.com', password: '123456' }
        };

        const response = await request(BASE_URL_GRAPHQL)
            .post('')
            .send(loginMutation);
  
        const token = response.body.data.login.token;
        expect(token).to.not.be.null;
        
        const checkoutMutation = {
            query: `mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {\n  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {\n    items {\n      productId\n      quantity\n    }\n  }\n}`,
            variables: {
                items: [{ productId: 1, quantity: 2 }],
                freight: 1,
                paymentMethod: "credit_card",
            }
        };
        const resposta = await request(BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(checkoutMutation);
        expect(resposta.status).to.equal(200);
        expect(resposta.body.errors[0]).to.have.property('message', 'Dados do cartão obrigatórios para pagamento com cartão');
    }); 
});
