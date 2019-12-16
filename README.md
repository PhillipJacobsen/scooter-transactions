# Custom scooter transactions
This plugin contains custom transactions built for the Tier-0 Ark Scooters project. 

https://ark.io/projects/ark-scooters

## Installation
1 Add the plugin to your relay node. 
```bash
cd ~/{core-bridgechain}/plugins && git clone https://github.com/e-m-s-y/scooter-transactions.git
```
2 Open `~/.config/{ark-core}/{mainnet|devnet|testnet}/plugins.js` and add the plugin config at the bottom of the file.
```js
"@e-m-s-y/scooter-transactions": {
    enabled: true
}
```
3 Build the plugin.
```bash
cd ~/{core-bridgechain}
yarn build
```
4 Restart your relay.

## Credits

- [e-m-s-y](https://github.com/e-m-s-y)

## License

[MIT](LICENSE)
