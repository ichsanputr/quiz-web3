import React, { useState, useEffect, useMemo } from "react";
import Web3 from "web3";

const btnDefaultStyle =
    "bg-accent text-slate-100 text-sm px-6 py-2 rounded-full float-right flex items-center gap-2";

const Header = () => {
    const web3 = new Web3(window.ethereum);

    const [account, setAccount] = useState('')

    const unlockMetamask = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts()

        setAccount(accounts[0])
    }

    useEffect(() => {
        // event for handle accounts changes
        window.ethereum.on("accountsChanged", async (accounts) => {
            setAccount(accounts[0])
        });
    }, [])

    const accountDisplay = useMemo(() => {
        return account != '' ? account.substring(0, 15) + '...' : 'Connect Metamask'
    }, [account])

    return (
        <div className="flex justify-between px-2 md:px-6 py-2">
            <h1 className="text-slate-700 text-xl font-semibold dark:bg-primary dark:text-accent">Web3 Quiz</h1>
            <div>
                <button onClick={unlockMetamask} className={btnDefaultStyle}>
                    {accountDisplay}
                </button>
            </div>
        </div>
    )
};

export default Header;
