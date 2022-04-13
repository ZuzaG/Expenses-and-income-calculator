// FUNCTIONS - SHORTCUTS
const qs = (s) => document.querySelector(s);

//MODEL
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
let incomeUl = [];
let expenseUl = [];
let incomeTotal = 0;
let expensesTotal = 0;
let i = 0;

// VIEW
// UNIVERSAL FUNCTIONS
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
  let differenceBetweenIandEP = (incomeTotal - expensesTotal).toFixed(2);
  let differenceBetweenIandEM = ((incomeTotal - expensesTotal) * -1).toFixed(2);
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
// UNIVERSAL FUNCTIONS
const addLine = (obj, oldLines) => {
  oldLines.push(obj);
};

// A. INCOME PART
const deleteIncomeLine = (e) => {
  let buttonId = e.target.classList.value;
  for (let i = 0; i < incomeUl.length; i++) {
    if (buttonId === incomeUl[i].id) {
      incomeTotal = (incomeTotal - incomeUl[i].sum).toFixed(2);
      incomeUl.splice(i, 1);
      renderSumOfIncomesAndExpenses();
      qs(".incomeTotal").innerHTML =
        "Suma przychodów: " + incomeTotal.toFixed(2) + " zł";
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
      let tempImputName = incomeUl[i].name;
      let tempImputSum = incomeUl[i].sum;
      let oldLi = document.getElementById(incomeUl[i].id);
      let newLi = document.createElement("li");
      newLi.innerHTML = `<form id="addNewIncomeForm"><input class="nameEdit" type="text" placeholder= ${tempImputName} value= ${tempImputName} required><input class="sumEdit" type="number" min="0.01" step="0.01" placeholder= ${tempImputSum} value= ${tempImputSum} required><button class="buttonEdit">Dodaj</button></form>`;
      document.getElementById("incomeUl").replaceChild(newLi, oldLi);

      document
        .querySelector("#addNewIncomeForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          incomeTotal = incomeTotal - incomeUl[i].sum;
          let newIncome = {
            id: uuidv4(),
            name: e.currentTarget.elements[0].value,
            sum: Number(e.currentTarget.elements[1].value),
          };
          incomeTotal = incomeTotal + newIncome.sum;
          qs(".incomeTotal").innerHTML =
            "Suma przychodów: " + incomeTotal.toFixed(2) + " zł";
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
        "Suma wydatków: " + expensesTotal.toFixed(2) + " zł";
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
      let tempImputNameE = expenseUl[i].name;
      let tempImputSumE = expenseUl[i].sum;
      expensesTotal = expensesTotal - expenseUl[i].sum;
      let oldLi = document.getElementById(expenseUl[i].id);
      let newLi = document.createElement("li");
      newLi.innerHTML = `<form id="addNewExpenceForm"><input class="nameEdit" type="text" placeholder= ${tempImputNameE} value = ${tempImputNameE} required><input class="sumEdit" type="number" min="0.01" step="0.01" placeholder= ${tempImputSumE} value= ${tempImputSumE} required> <button class="buttonEdit">Dodaj</button></form>`;
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
            "Suma wydatków: " + expensesTotal.toFixed(2) + " zł";
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
// EVENT
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
  qs(".incomeTotal").innerHTML =
    "Suma przychodów: " + incomeTotal.toFixed(2) + " zł";

  addLine(newIncome, incomeUl);
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
  qs(".expensesTotal").innerHTML =
    "Suma wydatków: " + expensesTotal.toFixed(2) + " zł";

  addLine(newExpense, expenseUl);
  renderSumOfIncomesAndExpenses();
  render(
    expenseUl,
    "#expencesUl",
    "editExpenseLine(event)",
    "deleteExpenseLine(event)"
  );
});

// START
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
