const faker = require('faker-br');

const produto = {
  nome: faker.name.title(),
  preco: faker.random.number(),
  descricao: faker.lorem.text(),
  quantidade: faker.random.number()
}

beforeEach(() => {
  cy.postLogin()
})

describe('CRUD - Produtos', () => {

  it.only('Cadastrar produto com sucesso', () => {

    cy.postProduto(produto).then((res) => {
      expect(res.status).to.eql(201)
      expect(res.body.message).to.eql('Cadastro realizado com sucesso')
      Cypress.env('userId', res.body._id)
    })
  })
  
  it('Deve listar user pelo Id', () => {
    cy.api({
      method: 'GET',
      url: `/usuarios/${Cypress.env('userId')}`
    }).then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.nome).to.equal(user.postName)
      expect(res.body.email).to.equal(user.email)
      expect(res.body._id).to.eql(Cypress.env('userId', res.body._id))
    })
  })

  it('Deve editar user', () => {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${Cypress.env('userId')}`,
      body: {
        "nome": user.putName,
        "email": user.email,
        "password": "teste",
        "administrador": "true"
      }
    }).then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.message).to.equal('Registro alterado com sucesso')
    })

    cy.log('consultando user pelo Id')
    cy.api({
      method: 'GET',
      url: `/usuarios/${Cypress.env('userId')}`
    }).then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.nome).to.equal(user.putName)
      expect(res.body.email).to.equal(user.email)
      expect(res.body._id).to.eql(Cypress.env('userId', res.body._id))
    })

  })

  it('Deve excluir user', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${Cypress.env('userId')}`,
    }).then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.message).to.equal('Registro excluído com sucesso')
    })

    cy.log('Validando que o user foi excluido, consultando pelo ID')

    cy.api({
      failOnStatusCode: false,
      method: 'GET',
      url: `/usuarios/${Cypress.env('userId')}`
    }).then((res) => {
      expect(res.status).to.eql(400)
      expect(res.body.message).to.equal('Usuário não encontrado')
    })
  })
})

describe('Testes funcionais - USER', () => {
  it('Não deve cadastrar mais de um user com mesmo e-mail', () => {
    cy.postUser(user).then((res) => {
      expect(res.status).to.eql(201)
      expect(res.body.message).to.eql('Cadastro realizado com sucesso')
      Cypress.env('userId', res.body._id)
    })

    cy.log('tentativa de cadastro duplicado')

    cy.postUser(user).then((res) => {
      expect(res.status).to.eql(400)
      expect(res.body.message).to.eql('Este email já está sendo usado')
    })
  })
})