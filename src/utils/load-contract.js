import contract from "@truffle/contract";

export const loadContract = async (name, provider) => {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "production" ? "/faucet" : ""
    }/contracts/${name}.json`
  );
  const artifact = await res.json();

  const _contract = contract(artifact);
  _contract.setProvider(provider);

  const deployedContract = await _contract.deployed();

  return deployedContract;
};
