import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(
    () => reload(!shouldReload),
    [shouldReload, reload]
  );

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3Api({
          provider,
          contract,
          web3: new Web3(provider),
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api({ ...web3Api, isProviderLoaded: true });
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const [account] = await web3Api.web3.eth.getAccounts();
      setAccount(account);
    };
    web3Api.web3 && getAccount();
  }, [web3Api]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;

    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");

    await contract.withdraw(withdrawAmount, { from: account });

    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        {web3Api.isProviderLoaded ? (
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            {account ? (
              <div>{account}</div>
            ) : !web3Api.provider ? (
              <>
                <div className="notification is-warning is-size-6 is-rounded">
                  Wallet is not detected!{` `}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.metamask.io"
                  >
                    Install Metamask
                  </a>
                </div>
              </>
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
        ) : (
          <span>Looking for Web3...</span>
        )}
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        <button
          className="button is-link mr-2"
          disabled={!account}
          onClick={addFunds}
        >
          Donate 1eth
        </button>
        <button
          className="button is-primary"
          disabled={!account || balance <= 0}
          onClick={withdraw}
        >
          Withdraw 0.1eth
        </button>
      </div>
    </div>
  );
}

export default App;
