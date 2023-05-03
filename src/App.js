import { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          provider,
          web3: new Web3(provider),
        });
      } else {
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, []);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="is-flex is-align-items-center">
          <span>
            <strong className="mr-2">Account:</strong>
          </span>
          {account ? (
            <div>{account}</div>
          ) : (
            <button
              className="button is-small"
              onClick={async () => {
                const [account] = await web3Api.provider.request({
                  method: "eth_requestAccounts",
                });
                setAccount(account);
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="button is-link mr-2">Donate</button>
        <button className="button is-primary">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
