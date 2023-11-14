const faker = require('faker-br');

const produto = {
  nome: faker.name.title(),
  preco: faker.random.number(),
  descricao: faker.lorem.text(),
  quantidade: faker.random.number(),
  putNome: faker.name.title(),  
}

beforeEach(() => {
  cy.postLogin()
})

describe('CRUD - Produtos', () => {

  it('Cadastrar produto com sucesso', () => {
    cy.postProduto(produto).then((res) => {
      expect(res.status).to.eql(201)
      expect(res.body.message).to.eql('Cadastro realizado com sucesso')
      Cypress.env('produtoId', res.body._id)
    })
  })
  
  it('Listar produto pelo Id', () => {
   cy.listProdutoId().then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.nome).to.equal(produto.nome)
      expect(res.body.preco).to.equal(produto.preco)
      expect(res.body.descricao).to.equal(produto.descricao)
      expect(res.body.quantidade).to.equal(produto.quantidade)
      expect(res.body._id).to.eql(Cypress.env('produtoId', res.body._id))
    })
  })

  it('Listar produtos', () => {
    cy.api({
      method: 'GET',
      url: `/produtos`
    }).then((res) => {
      expect(res.status).to.eql(200)
    })
  })

  it('Editar produto', () => {
    cy.putProduto(produto).then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.message).to.equal('Registro alterado com sucesso')
    })

    cy.log('consultando produto pelo Id')

    cy.listProdutoId().then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.nome).to.equal(produto.putNome)
      expect(res.body.preco).to.equal(produto.preco)
      expect(res.body.descricao).to.equal(produto.descricao)
      expect(res.body.quantidade).to.equal(produto.quantidade)
      expect(res.body._id).to.eql(Cypress.env('produtoId', res.body._id))
    })
  })

  it('Excluir produto', () => {
    cy.deleteProduto().then((res) => {
      expect(res.status).to.eql(200)
      expect(res.body.message).to.equal('Registro excluído com sucesso')
    })

    cy.log('Validando que o produto foi excluido, consultando pelo ID')

    cy.listProdutoId(false).then((res) => {
      expect(res.status).to.eql(400)
      expect(res.body.message).to.equal('Produto não encontrado')
    })
  })
})