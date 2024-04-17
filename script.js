const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");

let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">
    Entry ${entryNumber} Name
    </label>
    <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name">

    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>

    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories">
    `;

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

addEntryButton.addEventListener("click", addEntry);

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;
  let breakfastNumberInputs = document.querySelectorAll(
    "#breakfast input[type=number]"
  );
  let lunchNumberInputs = document.querySelectorAll(
    "#lunch input[type=number]"
  );
  let dinnerNumberInputs = document.querySelectorAll(
    "#dinner input[type=number]"
  );
  let snacksNumberInputs = document.querySelectorAll(
    "#snacks input[type=number]"
  );
  let exerciseNumberInputs = document.querySelectorAll(
    "#exercise input[type=number]"
  );

  let breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  let lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  let dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  let snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  let exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  let budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  let consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  let remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

  let surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
    remainingCalories
  )} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed </p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove("hide");
}

calorieCounter.addEventListener("submit", calculateCalories);

function clearForm() {
  let inputContainers = Array.from(
    document.querySelectorAll(".input-container")
  );

  for (const container of inputContainers) {
    container.innerHTML = "";
  }
  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}
clearButton.addEventListener("click", clearForm);
