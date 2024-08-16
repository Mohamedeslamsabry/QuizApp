/// <reference types="../@types/jquery"/>
//! Global varbles
let fromQuiz = document.getElementById("fromQuiz");
let question = document.getElementById("question");
let categoryMenu = document.getElementById("categoryMenu");
let diffuclty = document.getElementById("diffuclty");
let numberQuestion = document.getElementById("numberQuestion");
let btn = document.getElementById("btn");
let required = document.getElementById("required");
let numberrr = document.getElementById("numberrr");
let rowData = document.getElementById("rowData");
let next = document.getElementById("next");
let showResult = document.getElementById("showResult");

//! prevent Deafult
fromQuiz.addEventListener("click", function (e) {
  e.preventDefault();
});

//! Click
let quesstions;
let MyQuiz;
btn.addEventListener("click", async function () {
  //! class Quiz
  let category = categoryMenu.value;
  let diffuclt = diffuclty.value;
  let number = numberQuestion.value;
  if (category && diffuclt && number) {
    required.classList.add("d-none");
    if (number <= 45) {
      numberrr.classList.add("d-none");
      MyQuiz = new Quiz(category, diffuclt, number);
      quesstions = await MyQuiz.getquestion(); //! array include all questions
      //console.log(quesstions);
      //! hide from and show question
      fromQuiz.classList.add("d-none");
      question.classList.remove("d-none");
      //! class Question
      let MyQuesstion = new Question(0);
      //console.log(MyQuesstion);
      MyQuesstion.display();
    } else {
      numberrr.classList.remove("d-none");
    }
  } else {
    required.classList.remove("d-none");
  }
});

//! class Quiz
class Quiz {
  constructor(Category, diffuclty, number) {
    this.Category = Category;
    this.diffuclty = diffuclty;
    this.number = number;
    this.score = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.Category}&difficulty=${this.diffuclty}`;
  }

  async getquestion() {
    let result = await fetch(this.getApi());
    let data = await result.json();
    return data.results;
  }
  showResult() {
    return `
          <div class="score  ">
            <h2 class="text-center text-danger h5">Your Score is ${this.score} of ${this.number}</h2>
            <button id="try" class="btn btn-info w-50 mt-4 ">Try Again</button>
          </div>
    `;
  }
}

//! class Question
let ques = document.getElementById("ques");
let isAnswer = false;
class Question {
  constructor(index) {
    this.index = index;
    this.categ = quesstions[index].category;
    this.diffuc = quesstions[index].difficulty;
    this.quest = quesstions[index].question;
    this.correct_answer = quesstions[index].correct_answer;
    this.incorrect_answers = quesstions[index].incorrect_answers;
    this.Allanswer = this.getAllanswers();
  }
  getAllanswers() {
    let Allanswers = [this.correct_answer, ...this.incorrect_answers];
    return Allanswers.sort();
  }

  display() {
    let cartona = `
             <li class="w-40 py-2   custome m-3 list-unstyled">${this.Allanswer[0]}</li>
              <li class="w-40 py-2   custome m-3 list-unstyled">${this.Allanswer[1]}</li> 
              <li class="w-40 py-2   custome m-3 list-unstyled">${this.Allanswer[2]}</li>
              <li class="w-40 py-2   custome m-3 list-unstyled">${this.Allanswer[3]}</li>
        `;
    let cartona2 = `
         <li class="w-40 py-2  custome m-3 list-unstyled">${this.Allanswer[0]}</li>
        <li class="w-40 py-2  custome m-3 list-unstyled">${this.Allanswer[1]}</li> 
        `;
    let categ = (document.getElementById("categ").innerHTML = `${this.categ}`);
    let quest = (document.getElementById("quest").innerHTML = `${this.quest}`);
    let numerquestion = (document.getElementById(
      "numerquestion"
    ).innerHTML = `${this.index + 1} of ${quesstions.length}`);
    let score = (document.getElementById(
      "score"
    ).innerHTML = `Score : ${MyQuiz.score}`);
    if (this.Allanswer.length == 4) {
      ques.innerHTML = cartona;
    }
    if (this.Allanswer.length == 2) {
      ques.innerHTML = cartona2;
    }

    let li = document.querySelectorAll("#ques li"); //! hode all answers
    li.forEach((li) => {
      li.addEventListener("click", () => {
        this.checkAnswer(li);
        this.nextQuestion();
      });
    });
  }

  checkAnswer(choise) {
    if (!this.isAnswer) {
      this.isAnswer = true;
      if (choise.innerHTML == this.correct_answer) {
        MyQuiz.score++;
        score.innerHTML = ` Score : ${MyQuiz.score}`;
        choise.classList.add("animate__animated");
        choise.classList.add("correct");
        choise.classList.add("animate__shakeY");
      } else {
        choise.classList.add("animate__animated");
        choise.classList.add("uncorrect");
        choise.classList.add("animate__shakeX");
      }
    }
  }
  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < quesstions.length) {
        let MyNewQuesstion = new Question(this.index);
        MyNewQuesstion.display();
      } else {
        let resu = MyQuiz.showResult();
        question.innerHTML = resu;
        let Try = document.getElementById("try");
        Try.addEventListener("click", function () {
          window.location.reload();
        });
      }
    }, 800);
  }
}
/* ================ */
