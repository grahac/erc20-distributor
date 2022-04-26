
# erc20-distributor
This is A simple tool in node to distribute ERC20 tokens from a wallet to a csv list.  I was asked to build this as a tool for someone and figured it was better to just make this available to everyone

Basically you create a wallet (using wallet-generator) and use that as your sender wallet.  You then can specify a list of wallets and amounts as a CSV and this script will go through the csv list and send each of those wallets the amount you have specified.

This was made to work with Polygon but could likely work for any chain if you update the RPC and token ID.

## Caveats
* JS is not my primary language - so this is a bit of a hack and I am sure could be made to look much prettier.
* I am sure there are bugs so please feel free to identify and PR any fixes (or ask to be a contributor!)

### To use it:
 1. Install Node
 2. Run ```node wallet_generator.js``` .  This will create an ETH wallet for you. You will be using this Wallet to make all the transactions. Save both the public and private keys. Do not share the private key. 
 3. Add the appropriate tokens to this wallet that you will be distributing.  If you are sending via Polygon you want both MATIC and your token (i.e. WETH) in this wallet. (Assume 0.005-0.01 MATIC per payment you make fwiw).   
 4. Update the ```payments.csv``` file. DO NOT CHANGE THE HEADERS. This is where you put payments.  One row per address and include the wallet address and the amount (in this case it is in WETH)
 5.  run ```PRIVATE_KEY=<private_key> node main.js``` to run it, replacing <private_key> with the key from Step 2. It takes about 3 seconds per transaction.
 6. If you want to run it again, you can just follow steps 3-5.

#### If you want to use a separate token, 
* Change the TOKEN_ADDRESS field in the main.js file
* You will also need to figure out the conversion on line 48 of main.js as it is currently converting ETH to WEI.

