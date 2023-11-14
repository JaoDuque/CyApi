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

function validateProductDetails(receivedProduct, expectedProduct) {
  expect(receivedProduct.nome).to.equal(expectedProduct.nome);
  expect(receivedProduct.preco).to.equal(expectedProduct.preco);
  expect(receivedProduct.descricao).to.equal(expectedProduct.descricao);
  expect(receivedProduct.quantidade).to.equal(expectedProduct.quantidade);
}

function validateMessage(res, expectedMessage, expectedStatus = 200) {
  expect(res.status).to.eql(expectedStatus);
  if (expectedMessage !== undefined) {
    expect(res.body.message).to.equal(expectedMessage);
  }
}

describe('CRUD - Produtos', () => {

  it('Deve cadastrar produto com sucesso', () => {
    cy.postProduto(produto).then((res) => {
      validateMessage(res, 'Cadastro realizado com sucesso', 201);
      Cypress.env('produtoId', res.body._id);
    });
  });

  it('Deve listar produto pelo Id', () => {
    cy.listProdutoId().then((res) => {
      validateProductDetails(res.body, produto);
      expect(res.body._id).to.eql(Cypress.env('produtoId'));
    });
  });

  it('Deve listar produtos', () => {
    cy.listProdutos().then((res) => {
      expect(res.status).to.eql(200)
    })
  })

  it('Deve editar produto', () => {
    cy.putProduto(produto).then((res) => {
      validateMessage(res, 'Registro alterado com sucesso');
    });

    cy.log('Consultando produto pelo Id');

    cy.listProdutoId().then((res) => {
      validateProductDetails(res.body, { ...produto, nome: produto.putNome });
      expect(res.body._id).to.eql(Cypress.env('produtoId'));
    });
  });

  it('Deve excluir produto', () => {
    cy.deleteProduto().then((res) => {
      validateMessage(res, 'Registro excluído com sucesso');
    });

    cy.log('Validando que o produto foi excluído, consultando pelo ID');

    cy.listProdutoId(false).then((res) => {
      validateMessage(res, 'Produto não encontrado', 400);
    });
  });
});
