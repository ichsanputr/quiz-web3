import React from "react";
import Button from "./Button";
import HashLoader from "react-spinners/HashLoader";

const ResultPage = ({ score, quizzes, loading, claimedToken, onClickTry }) => {
	const percentageScore = score * (100 / quizzes.length)

	function actionButton(){
		onClickTry(percentageScore, claimedToken)
	}

	return (
		<div className="h-full flex flex-col justify-center items-center gap-3 pb-8">
			<img
				src={percentageScore == 100 ? '/good-job.gif' : 'yayy.gif'}
				className="w-60 mt-auto"
				alt=""
			/>

			{
				percentageScore == 100 && <span className="text-3xl font-medium">Congrats 🥳</span>
			}

			<h2 className="font-bold text-5xl">{percentageScore}% Score</h2>

			<span className="block text-lg font-light">{ percentageScore == 100 ? 'Yayy you got 1 token.' : 'Ups.. little bit more to get a reward' }</span>

			<Button
				customStyle=" w-full md:w-fit bg-accent text-white dark:bg-primary px-8 py-2 rounded-full mt-6"
				onClickButton={actionButton}
			>
				{
					loading ? (
						<div className="flex justify-center">
							<HashLoader color="white" size="26"/>
						</div>
					) : (
						<div>{percentageScore == 100 && !claimedToken ? 'Claim Token' : "Let's try again :)"}</div>
					)
				}
			</Button>
		</div>
	)
};

export default ResultPage;
