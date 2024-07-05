# Quiz Web 3 App

This simple app built with React.js and Web 3 allowing player to get 1 token (QT) QuizToken if completed 5 quiz with 100% score. I built this app only for learning purpose, you can see the code to learn about how to interact with your token smart contract or connect an application with Metamask.

Flow application will be like this.

- Player connect address to app with Metamask
- Player must get 100% score if want to get 1 token
- If player get 100% token, he can claim the token and application will be call `transfer` method on contract
- Player receive token on contract and display their balance on app
- Player also can change account or logout

See this video below to demo.

[Quiz Web 3 Demo](public/demo.mp4)

## How to Run

First of all you need to create token based on ERC 20 contract, you can use Remix IDE connected to Injected Metamask for deploying into ganache locale network.

After deploying you need to copy contract abi and contract address to connecting web3 to your smart contract, place contract abi on `src/contract/abi.js`.

```jsx
const contract = new web3.eth.Contract(abi, "0xbafc8994c38b......b90b6c582f1aa")
```
Then we have 2 web3 object, first is connect into Metamask and the second connected directly into ganache network. I create 2 instance because i dont want get metamask popup when player claiming their token, because if we use `window.ethereum` then will be open an popup based on player wallet.

```jsx
const ClientWeb3 = new Web3(window.ethereum)
const web3 = new Web3("http://localhost:7545")
```

## How app detect when player change account

To detect account changes we can use `window.ethereum.on()` event placed in `useEffect()` with this if player change their account int metamask app wil be detected and directly change account state.

```jsx
useEffect(() => {
  fetchQuiz(api_url).then((data) => {
    setQuizzes(data);
    setIsloading(false);
  });

  window.ethereum.on("accountsChanged", async (accounts) => {
    setAccount(accounts[0])
    localStorage.setItem("address", accounts[0])

    getBalance(accounts[0])
  });
}, []);
```

## How claim token work

When player press Claim Token button the app will be call `transfer` methods which defined on [ERC 20](https://docs.openzeppelin.com/contracts/4.x/erc20) we build the contract based on `web3` object which connected into ganache server not window ethereum.

```jsx
contract.methods.transfer(accounts[0], 1 * 10 ** 18).send({
    from: "account address which deploy contract"
  }).then(async (res) => {
    setTimeout(async () => {
    setLoadingTransfer(false)
    toast.success('Token added to your account!')
    await getBalance(accounts[0])

    setRecomputed((state) => state += 1)

    // disable claim token again
    setHasClaimed(true)
  }, 2000)
})
```
When transfer happen it will be transfer main account (account which deploy the smart contract) into account's player with total ammount `1 * 10 ** 18` same with 10^18 after.

## Where token's balance come from

Token balance's minted from constructor code or when contract creation, our contract use `msg.sender` so this mean who deploy the contract will be become a main account an it will have a lot of token balance.

```
contract QuizToken is ERC20 {
    // Constructor to set the initial supply and token name/symbol
    constructor(uint256 initialSupply) ERC20("QuizToken", "QT") {
        _mint(msg.sender, initialSupply);
    }
}
```
