Cypress.Commands.add('postLogin', () => {
    cy.api({
        method: 'POST',
        url: '/login',
        body: {
            "email": 'fulano@qa.com',
            "password": "teste"
        }
    }).then((res) => {
        expect(res.status).to.eql(200)
        expect(res.body.message).to.eql('Login realizado com sucesso')
        Cypress.env('auth', res.body.authorization)
    })
})

Cypress.Commands.add('postProduto', (produto) => {
    cy.api({
        headers: {
            Authorization: `${Cypress.env('auth')}`,
        },
        method: 'POST',
        url: '/produtos',
        body: {
            "nome": produto.nome,
            "preco": produto.preco,
            "descricao": produto.descricao,
            "quantidade": produto.quantidade
        }
    })
})