const ethWallet = require('ethereumjs-wallet');


for (let index = 0; index < 1; index++) {
    let addressData = ethWallet['default'].generate();
    console.log(`PRIVATE KEY:  ${addressData.getPrivateKeyString()}`);
    console.log(`PUBLIC ADDRESS: ${addressData.getAddressString()}`);
}