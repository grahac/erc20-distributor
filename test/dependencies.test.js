const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { test } = require('node:test');
const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet').default;
const csv = require('csv-parser');

// Public fixture key, never a funded wallet. No provider is configured.
const privateKey = `0x${'0'.repeat(63)}1`;
const address = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf';

test('wallet and web3 derive the expected account and recover signatures offline', () => {
  const wallet = Wallet.fromPrivateKey(Buffer.from(privateKey.slice(2), 'hex'));
  const web3 = new Web3();
  assert.equal(wallet.getAddressString(), address);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  assert.equal(account.address.toLowerCase(), address);
  web3.eth.accounts.wallet.add(account);
  assert.equal(web3.eth.accounts.wallet[0].address.toLowerCase(), address);
  const signed = account.sign('erc20-distributor dependency regression');
  assert.equal(web3.eth.accounts.recover(signed).toLowerCase(), address);
});

test('transfer encoding and Polygon transaction signing work without an RPC', async () => {
  const web3 = new Web3();
  const recipient = '0x0000000000000000000000000000000000000002';
  const amount = web3.utils.toWei('0.01', 'ether');
  assert.equal(amount, '10000000000000000');
  const contract = new web3.eth.Contract([{
    name: 'transfer', type: 'function',
    inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }]
  }], '0x0000000000000000000000000000000000000003');
  const data = contract.methods.transfer(recipient, amount).encodeABI();
  assert.equal(data.slice(0, 10), '0xa9059cbb');
  assert.equal(web3.eth.abi.decodeParameters(['address', 'uint256'], `0x${data.slice(10)}`)[1], amount);
  const transaction = await web3.eth.accounts.signTransaction({
    to: contract.options.address, data, value: '0', nonce: 0,
    gas: 50000, gasPrice: '1000000000', chainId: 137
  }, privateKey);
  assert.equal(web3.eth.accounts.recoverTransaction(transaction.rawTransaction).toLowerCase(), address);
});

test('payment CSV retains wallet and decimal amount strings', async () => {
  const payments = [];
  for await (const row of Readable.from([`WALLET,AMOUNT\n${address},0.01\n`]).pipe(csv())) {
    payments.push(row);
  }
  assert.deepEqual(payments, [{ WALLET: address, AMOUNT: '0.01' }]);
});
