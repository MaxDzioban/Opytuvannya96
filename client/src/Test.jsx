import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Timer } from "./Timer.jsx";

export const SelectTestWindow = ({ clickHandler, username }) => {
  const [allQuestions, setAllQuestions] = useState({});
  const [topicQuestions, setTopicQuestions] = useState({});
  const [selectedIndices, setIndices] = useState(new Set());

  useEffect(() => {
    async function loadAllQuestions() {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        const grouped = {};
        data.forEach((q) => {
          if (!grouped[q.topic]) grouped[q.topic] = [];
          grouped[q.topic].push(q.text);
        });
        setAllQuestions(grouped);
      } catch (err) {
        console.error("Помилка завантаження:", err);
      }
    }

    loadAllQuestions();
  }, []);

  // topic selection logic
  const [selectedOption, setSelectedOption] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  const changeHandler = (event) => {
    setSelectedOption(event.target.value);
    setTopicQuestions(allQuestions[event.target.value]);
  };
  const numberChangeHandler = (event) => {
    setQuestionCount(Number(event.target.value));
  };

  // actual test page
  const [showTest, setShowTest] = useState("false");

  const pick_random = () => {
    const count = Math.min(Number(questionCount), topicQuestions.length);
    const set = new Set();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * topicQuestions.length));
    }
    return set;
  };

  return (
    <>
      {showTest === "true" && (
        <TestWindow
          testName={selectedOption}
          time={questionCount}
          questions={[...selectedIndices].map((i) => topicQuestions[i])}
          username={username} // ⬅️ Додай це!
        />
      )}

      {showTest === "false" && (
        <div className="selecttest window">
          <div className="window-header">
            <h4 className="window-header-text">Topic Selection</h4>
            <div className="window-header-buttons">
              <button className="minimize-button window-control-button">
                <img src="/min_window.png" alt="minimize window" />
              </button>
              <button className="maximize-button window-control-button">
                <img src="/max_window.png" alt="maximize window" />
              </button>
              <Link to="/">
                <button className="close-button window-control-button">
                  <img src="/close_window.png" alt="close" />
                </button>
              </Link>
            </div>
          </div>
          <h2>What will you study today?</h2>
          <label htmlFor="topic">Topic:</label>
          <select
            name="topic"
            id="topic-select"
            value={selectedOption}
            onChange={changeHandler}
          >
            <option value="" disabled>
              ------Not Chosen------
            </option>
            <option value="Out-of-order, Pipeline, Microarchitecture">
              Out-of-order, Pipeline, Microarchitecture
            </option>
            <option value="Пам'ять: DRAM, SRAM, архітектура">
              Пам'ять: DRAM, SRAM, архітектура
            </option>
            <option value="ISA, SIMD, архітектури машин">
              ISA, SIMD, архітектури машин
            </option>
            <option value="Паралельні обчислення, архітектури систем">
              Паралельні обчислення, архітектури систем
            </option>
            <option value="Кеш пам'ять">Кеш пам'ять</option>
            <option value="Паралельне програмування">
              Паралельне програмування
            </option>
          </select>

          <label htmlFor="questions-number">Number of Questions :</label>
          <input
            type="number"
            id="questions-number-select"
            name="questions-number"
            min="1"
            max={
              topicQuestions && topicQuestions.length > 1
                ? topicQuestions.length
                : 1
            }
            onChange={numberChangeHandler}
          />
          <Link>
            <button
              id="topic_chosen"
              className="pretty-button"
              onClick={() => {
                if (!selectedOption) {
                  alert("❗ Ви не вибрали тему.");
                  return;
                }
                if (!questionCount || questionCount <= 0) {
                  alert("❗ Введіть кількість питань більшу за 0.");
                  return;
                }
                if (questionCount > topicQuestions.length) {
                  alert(`❗ У темі лише ${topicQuestions.length} питань.`);
                  return;
                }

                if (selectedOption !== "") {
                  const indices = pick_random();
                  const selected = [...indices].map((i) => topicQuestions[i]);

                  if (selected.includes(undefined)) {
                    alert("Помилка: не всі питання знайдено.");
                    return;
                  }

                  setIndices(indices);
                  setShowTest("true");
                }
              }}
            >
              Start
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export const Question = ({ title, text, index }) => (
  <div className="question" id={`question-${index}`}>
    <h3 className="question-title">{title}</h3>
    <p className="question-text">{text}</p>
    <form className="question-form">
      <textarea className="question-input"></textarea>
    </form>
  </div>
);

export const GenerateQuestions = ({ questions }) => (
  <>
    {questions.map((q, i) => (
      <Question key={i} title={`Question ${i + 1}`} text={q} index={i} />
    ))}
  </>
);

export const GenerateTestButtons = ({ questionCount }) =>
  Array.from({ length: questionCount }, (_, i) => (
    <button
      key={i}
      className="question-button pretty-button"
      onClick={() =>
        document
          .getElementById("question-" + i)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    >
      {i + 1}
    </button>
  ));

export const TestWindow = ({ testName, time, questions, username }) => {
  const [isFinished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const finishHandler = () => {
    const inputs = document.getElementsByClassName("question-input");
    const collectedAnswers = Array.from(inputs).map((input) => input.value);
    setAnswers(collectedAnswers);
    setFinished(true);
  };

  return isFinished ? (
    <ResultsWindow
      topic={testName}
      questions={questions}
      answers={answers}
      username={username}
    />
  ) : (
    <div className="test window">
      <div className="window-header">
        <h4 className="window-header-text">Test: {testName}</h4>
        <div className="window-header-buttons">
          {/* <button className="minimize-button window-control-button">
            <img src="/min_window.png" />
          </button>
          <button className="maximize-button window-control-button">
            <img src="/max_window.png" />
          </button> */}
          <button
            className="close-button window-control-button"
            onClick={() => {
              alert("Товариство, все що можна було змінити - не змінити, пишіть опитування!");
            }}
          >
            <img src="/close_window.png" />
          </button>
        </div>
      </div>
      <div className="test-main">
        <div className="test-left">
          <h2 id="test-title">{testName}</h2>
          <GenerateQuestions questions={questions} />
          <button
            id="test-finish"
            className="pretty-button"
            onClick={finishHandler}
          >
            Finish Test
          </button>
        </div>
        <div className="test-right">
          <div className="question-list">
            <div className="window-header">
              <h4 className="window-header-text">Questions</h4>
            </div>
            <div className="question-list-buttons">
              <GenerateTestButtons questionCount={questions.length} />
            </div>
          </div>
          <Timer timeInMins={time} onComplete={finishHandler} />
        </div>
      </div>
    </div>
  );
};

export const ResultsWindow = ({ topic, questions, answers, username }) => {
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    async function evaluateAnswersOnce() {
      let total = 0;

      const tbody = document.getElementById("responses-body");
      if (!tbody || tbody.children.length > 0) return; // prevent double insert

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const answer = answers[i];

        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });

        const data = await res.json();
        total += data.score;

        const newRow = document.createElement("tr");
        [i + 1, data.score, answer, data.comment].forEach((cellText) => {
          const newCell = document.createElement("td");
          newCell.textContent = cellText;
          newRow.appendChild(newCell);
        });
        tbody.appendChild(newRow);
      }

      if (username) {
        await fetch("/api/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, delta: total }),
        });
      }

      setFinalScore(total);
    }
    evaluateAnswersOnce();
  }, [questions, answers, username]);

  return (
    <div className="results window">
      <div className="window-header">
        <h4 className="window-header-text">Results</h4>
        <div className="window-header-buttons">
          {/* <button className="minimize-button window-control-button">
            <img src="/min_window.png" />
          </button>
          <button className="maximize-button window-control-button">
            <img src="/max_window.png" />
          </button> */}
          <Link to="/">
            <button className="close-button window-control-button">
              <img src="/close_window.png" alt="close"/>
            </button>
          </Link>
        </div>
      </div>
      <h2>
        Your score:{" "}
        <span id="test-score">{finalScore || "calculating..."}</span>
      </h2>
      <table id="responses">
        <thead>
          <tr>
            <th>Question №</th>
            <th>Score</th>
            <th>Your Answer</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody id="responses-body"></tbody>
      </table>
    </div>
  );
};
