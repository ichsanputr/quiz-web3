const Header = ({account, connectMetamask}) => {
    return (
        <div className="flex justify-between px-2 md:px-6 py-2">
            <h1 className="text-slate-700 text-xl font-semibold dark:bg-primary dark:text-accent">Web3 Quiz</h1>
            <div>
                <button onClick={connectMetamask} className="bg-accent text-slate-100 text-sm px-6 py-2 rounded-full float-right flex items-center gap-2">
                    {account}
                </button>
            </div>
        </div>
    )
};

export default Header;
