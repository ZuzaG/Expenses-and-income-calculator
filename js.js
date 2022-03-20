// funkcje pomocnicze
const qs = (s) => document.querySelector(s);

//MODEL
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
let incomeUl = [];
let expenseUl = [];
let incomeTotal = 0;
let expensesTotal = 0;
let i = 0;

//WIDOK
// FUNKCJE UNIWERSALNE
const render = (tab, ulID, editFunctionName, deleteFunctionName) => {
  const createDOM = tab
    .map(
      ({ name, sum, id }) =>
        `<li id="${id}">
        <div class="insideInput">${name} ${sum} zł </div>
        <div class="EDbutton">
        <button id="edit" class="${id}" onclick = "${editFunctionName}">Edytuj</button> 
        <button id="delete" class="${id}" onclick = "${deleteFunctionName}">Usuń</button>
        </div>
        </li>`
    )
    .join("");
  qs(ulID).innerHTML = createDOM;
};

const renderSumOfIncomesAndExpenses = () => {
  let differenceBetweenIandEP = incomeTotal - expensesTotal;
  let differenceBetweenIandEM = (incomeTotal - expensesTotal) * -1;
  if (incomeTotal > expensesTotal) {
    qs(
      "#summary"
    ).innerHTML = `<p>Możesz jeszcze wydać ${differenceBetweenIandEP} złotych</p>`;
  }
  if (incomeTotal === expensesTotal) {
    qs("#summary").innerHTML = `<p>Bilans wynosi zero</p>`;
  }
  if (incomeTotal < expensesTotal) {
    qs(
      "#summary"
    ).innerHTML = `<p>Bilans jest ujemny. Jesteś na minusie ${differenceBetweenIandEM} złotych</p>`;
  }
};

//UPDATE
// FUNKCJE UNIWERSALNE
const addLine = (obj, oldLines) => {
  oldLines.push(obj);
};

// A. INCOME PART
const deleteIncomeLine = (e) => {
  let buttonId = e.target.classList.value;
  for (let i = 0; i < incomeUl.length; i++) {
    if (buttonId === incomeUl[i].id) {
      incomeTotal = incomeTotal - incomeUl[i].sum;
      incomeUl.splice(i, 1);
      renderSumOfIncomesAndExpenses();
      qs(".incomeTotal").innerHTML = "Suma przychodów: " + incomeTotal + " zł";
    }
  }
  render(
    incomeUl,
    "#incomeUl",
    "editIncomeLine(event)",
    "deleteIncomeLine(event)"
  );
};

const editIncomeLine = (event) => {
  for (let i = 0; i < incomeUl.length; i++) {
    if (event.target.classList.value == incomeUl[i].id) {
      incomeTotal = incomeTotal - incomeUl[i].sum;
      let oldLi = document.getElementById(incomeUl[i].id);
      let newLi = document.createElement("li");
      newLi.innerHTML =
        '<form id="addNewIncomeForm"><input class="name" type="text" placeholder="Nazwa przychodu"><input class="sum" type="text" placeholder="Kwota"><button>Dodaj</button></form>';
      document.getElementById("incomeUl").replaceChild(newLi, oldLi);

      document
        .querySelector("#addNewIncomeForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          let newIncome = {
            id: uuidv4(),
            name: e.currentTarget.elements[0].value,
            sum: Number(e.currentTarget.elements[1].value),
          };
          incomeTotal = incomeTotal + newIncome.sum;
          qs(".incomeTotal").innerHTML =
            "Suma przychodów: " + incomeTotal + " zł";
          renderSumOfIncomesAndExpenses();
          incomeUl.splice(i, 1, newIncome);
          render(
            incomeUl,
            "#incomeUl",
            "editIncomeLine(event)",
            "deleteIncomeLine(event)"
          );
        });
    }
  }
};

// B. EXPENCES PART
const deleteExpenseLine = (e) => {
  let buttonId = e.target.classList.value;
  for (let i = 0; i < expenseUl.length; i++) {
    if (buttonId === expenseUl[i].id) {
      expensesTotal = expensesTotal - expenseUl[i].sum;
      expenseUl.splice(i, 1);
      renderSumOfIncomesAndExpenses();
      qs(".expensesTotal").innerHTML =
        "Suma wydatków: " + expensesTotal + " zł";
    }
  }
  render(
    expenseUl,
    "#expencesUl",
    "editExpenseLine(event)",
    "deleteExpenseLine(event)"
  );
};
const editExpenseLine = (event) => {
  for (let i = 0; i < expenseUl.length; i++) {
    if (event.target.classList.value == expenseUl[i].id) {
      expensesTotal = expensesTotal - expenseUl[i].sum;
      let oldLi = document.getElementById(expenseUl[i].id);
      let newLi = document.createElement("li");
      newLi.innerHTML =
        '<form id="addNewExpenceForm"><input class="name" type="text" placeholder="Nazwa przychodu"><input class="sum" type="text" placeholder="Kwota"><button>Dodaj</button></form>';
      document.getElementById("expencesUl").replaceChild(newLi, oldLi);

      document
        .querySelector("#addNewExpenceForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          let newExpense = {
            id: uuidv4(),
            name: e.currentTarget.elements[0].value,
            sum: Number(e.currentTarget.elements[1].value),
          };
          expensesTotal = expensesTotal + newExpense.sum;
          qs(".expensesTotal").innerHTML =
            "Suma wydatków: " + expensesTotal + " zł";
          renderSumOfIncomesAndExpenses();
          expenseUl.splice(i, 1, newExpense);
          render(
            expenseUl,
            "#expencesUl",
            "editExpenseLine(event)",
            "deleteExpenseLine(event)"
          );
        });
    }
  }
};
// EVENTY
// A. INCOME PART
document.querySelector("#addIncomeForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const { newIncomeName, newIncomeSum } = e.currentTarget.elements;

  const newIncome = {
    id: uuidv4(),
    name: newIncomeName.value,
    sum: Number(newIncomeSum.value),
  };
  incomeTotal = incomeTotal + newIncome.sum;
  qs(".incomeTotal").innerHTML = "Suma przychodów: " + incomeTotal + " zł";

  addLine(newIncome, incomeUl);
  console.log(incomeUl);
  renderSumOfIncomesAndExpenses();
  render(
    incomeUl,
    "#incomeUl",
    "editIncomeLine(event)",
    "deleteIncomeLine(event)"
  );
});

// B. EXPENCES PART
document.querySelector("#addExpensesForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const { newExpenseName, newExpenceSum } = e.currentTarget.elements;

  const newExpense = {
    id: uuidv4(),
    name: newExpenseName.value,
    sum: Number(newExpenceSum.value),
  };
  expensesTotal = expensesTotal + newExpense.sum;
  qs(".expensesTotal").innerHTML = "Suma wydatków: " + expensesTotal + " zł";

  addLine(newExpense, expenseUl);
  renderSumOfIncomesAndExpenses();
  render(
    expenseUl,
    "#expencesUl",
    "editExpenseLine(event)",
    "deleteExpenseLine(event)"
  );
});

//Start aplikacji
render(
  expenseUl,
  "#expencesUl",
  "editExpenseLine(event)",
  "deleteExpenseLine(event)"
);
render(
  incomeUl,
  "#incomeUl",
  "editIncomeLine(event)",
  "deleteIncomeLine(event)"
);
