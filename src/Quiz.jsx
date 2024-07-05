import { RiArrowRightLine } from "react-icons/ri";
import React, { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Web3 from "web3";

import Button from "./components/Button";
import Banner from "./components/Banner";
import AnswerList from "./components/AnswerList";
import Question from "./components/Question";
import ResultPage from "./components/ResultPage";
import Loader from "./components/Loader";
import Header from "./components/Header";
import abi from "./contract/abi";

const api_url = "https://the-trivia-api.com/api/questions?limit=1";

const Quiz = () => {
	const [quizzes, setQuizzes] = useState([])
	const [quizNo, setQuizNo] = useState(0)
	const [choice, setChoice] = useState("")
	const [score, setScore] = useState(0)
	const [isloading, setIsloading] = useState(true)
	const [showBanner, setShowBanner] = useState(true)
	const [loadingTransfer, setLoadingTransfer] = useState(false)
	const [hasClaimed, setHasClaimed] = useState(false)

	const [account, setAccount] = useState(localStorage.getItem('address'))
	const [balance, setBalance] = useState(localStorage.getItem('balance') ?? 0)
	const [recomputed, setRecomputed] = useState(0)

	const currentQuiz = quizzes.length > 0 && quizzes[quizNo]
	const correctAnswer = currentQuiz?.correctAnswer
	const incorrectAnswers = currentQuiz?.incorrectAnswers
	const answers = correctAnswer && incorrectAnswers && [correctAnswer, ...incorrectAnswers]
	const isCorrect = correctAnswer === choice

	const ClientWeb3 = new Web3(window.ethereum)
	const web3 = new Web3("http://localhost:7545")
	const contract = new web3.eth.Contract(abi, "0xbafc8994c38b51504f1ada9a1c5b90b6c582f1aa")

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

	async function fetchQuiz(url) {
		try {
			const res = await fetch(url);
			const data = await res.json();
			console.log(data[0].correctAnswer)
			return data;
		} catch (e) {
			throw new Error(e);
		}
	};

	async function handleSelectAnswer(answer) {
		return setChoice(answer)
	}

	async function handleClickNext() {
		checkAnswer();
		setQuizNo(quizNo + 1);
	};

	async function handleClickTry(score, claimedToken) {
		if (score == 100 && !claimedToken) {
			await claimToken()
			return
		}

		setHasClaimed(false)
		setIsloading(true);
		setScore(0);
		setChoice("");
		setQuizNo(0);
		fetchQuiz(api_url).then((data) => {
			setQuizzes(data);
			setIsloading(false);
		});
	};

	function checkAnswer() {
		return isCorrect && setScore(score + 1);
	}

	function onBannerRemoved() {
		setShowBanner(false)
	}

	// claim token
	// transfer token for main address to user address
	async function claimToken() {
		await window.ethereum.request({ method: 'eth_requestAccounts' });

		// this get list account connected to metamask
		const accounts = await ClientWeb3.eth.getAccounts()

		await getBalance(accounts[0])

		localStorage.setItem('address', accounts[0])
		setAccount(accounts[0])

		setLoadingTransfer(true)

		contract.methods.transfer(accounts[0], 1 * 10 ** 18).send({
			from: "0xE47cc8Cc4ACceD0C3992E6Be53d0434dE0A4284A"
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
	}

	// get balance based from account argument
	async function getBalance(account) {
		let data = await contract.methods.balanceOf(account).call({
			from: account
		})

		data = Number(data) / 10 ** 18
		setBalance(data)
		localStorage.setItem('balance', data)
	}

	// connect with metamask 
	const connectMetamask = async () => {
		await window.ethereum.request({ method: 'eth_requestAccounts' });

		const accounts = await ClientWeb3.eth.getAccounts()

		localStorage.setItem('address', accounts[0])

		await getBalance(accounts[0])
		setAccount(accounts[0])
	}

	// computed for account display
	const accountDisplay = useMemo(() => {
		return account.length > 0 && balance > 0 ? balance + ' QT' + ' | ' + account.substring(0, 5) + '...' + account.slice(-5) : 'Connect Metamask'
	}, [account, recomputed])

	function logout(){
		setAccount('')
		setBalance(null)

		localStorage.setItem('address', '')
		localStorage.setItem('balance', null)
	}

	return (
		<div className="min-h-screen h-full bg-primary text-slate-800 dark:bg-accent dark:text-slate-100 items-center justify-center p-3">
			<Toaster />
			<Header account={accountDisplay} connectMetamask={connectMetamask} logout={logout} />
			<div className="w-full md:px-0 px-3 justify-center h-full mt-12 flex items-center">
				{quizzes.length === 0 || isloading ? (
					<Loader />
				) : quizNo === quizzes.length ? (
					<ResultPage
						score={score}
						quizzes={quizzes}
						onClickTry={handleClickTry}
						loading={loadingTransfer}
						claimedToken={hasClaimed}
					/>
				) : (
					<div className="w-full md:max-w-lg">

						{
							showBanner && <Banner onRemoved={onBannerRemoved} />
						}
						<div className="flex justify-between mb-3">
							<span>{currentQuiz?.category}</span>
							<span>
								{quizNo + 1}/{quizzes.length}
							</span>
						</div>

						<Question currentQuiz={currentQuiz} />

						<AnswerList
							answers={answers}
							choice={choice}
							onSelectAnswer={handleSelectAnswer}
						/>

						<Button onClickButton={handleClickNext}>
							Next
							<RiArrowRightLine />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Quiz;
