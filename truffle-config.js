const path = require("path");
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

const { API_URL, MNEMONIC } = process.env;

    module.exports = {
        // See <http://truffleframework.com/docs/advanced/configuration>
        // to customize your Truffle configuration!
        networks: {
            development: {
                host: "127.0.0.1",
                port: 8545,
                network_id: "*", // Match any network id
                gas: 10000000,
                gasLimit: 26000000000
            },
            ropsten: {
                provider:new HDWalletProvider(MNEMONIC,API_URL),
                network_id: 3,
                gas:   67000000 
            },
            mainnet: {
                //provider: new HDWalletProvider(secrets.mnemonic, "https://mainnet.infura.io/"),
                network_id: 1,
                gas: 1000000,
                gasLimit: 67000000
            }
        },
        compilers: {
            solc: {
                version: "0.8.0"
            }
        }
    };