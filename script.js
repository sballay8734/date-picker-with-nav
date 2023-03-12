import {
  format,
  getUnixTime,
  fromUnixTime,
  sub,
  add,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay
} from 'date-fns'

const datePickerButton = document.querySelector('.date-picker-button')
const datePicker = document.querySelector('.date-picker')
const datePickerHeaderText = document.querySelector('.current-month')
const datePickerGrid = document.querySelector('.date-picker-grid-dates')
const buttonNav = document.querySelector('.nav-to-selected-date')

let globalCurrentDate = new Date()

// Init ************************************************************************
const todaysDate = new Date()
datePickerButton.innerText = format(todaysDate, 'MMMM do, yyyy')
datePickerButton.dataset.currentDate = getUnixTime(todaysDate)
datePickerHeaderText.innerText = format(todaysDate, 'MMMM - yyyy')
// *****************************************************************************

datePickerButton.addEventListener('click', (e) => {
  datePicker.classList.toggle('show')
  buttonNav.classList.toggle('show')
  setUpDatePicker()
})

function setUpDatePicker() {
  // datePickerButton.innerText = format(dateFromButton, 'MMMM do, yyyy')
  // datePickerHeaderText.innerText = format(dateFromButton, 'MMMM - yyyy')
  // const dateFromButton = fromUnixTime(datePickerButton.dataset.currentDate)
  datePickerButton.dataset.currentDate = getUnixTime(globalCurrentDate)
  setUpDates(globalCurrentDate)
}

function setUpDates(dateFromButton) {
  datePickerHeaderText.innerText = format(dateFromButton, 'MMMM - yyyy')
  const firstWeekStart = startOfWeek(startOfMonth(dateFromButton))
  const lastWeekEnd = endOfWeek(endOfMonth(dateFromButton))
  const dates = eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  datePickerGrid.innerHTML = ''

  dates.forEach((date) => {
    const dateElement = document.createElement('button')
    dateElement.innerText = date.getDate()
    dateElement.classList.add('date')

    if (!isSameMonth(date, dateFromButton)) {
      dateElement.classList.add('date-picker-other-month-date')
    }

    dateElement.addEventListener('click', (e) => {
      removeSelectedDate()
      globalCurrentDate = date
      datePickerButton.innerText = format(globalCurrentDate, 'MMMM do, yyyy')
    })

    if (isSameDay(date, globalCurrentDate)) {
      dateElement.classList.add('selected')
    }

    datePickerGrid.appendChild(dateElement)
  })
}

function removeSelectedDate() {
  const itemToUpdate = datePickerGrid.querySelector('.selected')
  if (!itemToUpdate) return

  itemToUpdate.classList.remove('selected')
}

// arrow listeners
document.addEventListener('click', (e) => {
  if (!e.target.matches('.month-button')) return
  const date = globalCurrentDate

  if (e.target.matches('.prev-month-button')) {
    const currentDate = fromUnixTime(datePickerButton.dataset.currentDate)
    setUpDates(sub(currentDate, { months: 1 }))
    datePickerButton.dataset.currentDate = getUnixTime(
      sub(currentDate, { months: 1 })
    )
  }

  if (e.target.matches('.next-month-button')) {
    const currentDate = fromUnixTime(datePickerButton.dataset.currentDate)
    setUpDates(add(currentDate, { months: 1 }))
    datePickerButton.dataset.currentDate = getUnixTime(
      add(currentDate, { months: 1 })
    )
  }
})

buttonNav.addEventListener('click', (e) => {
  datePickerButton.dataset.currentDate = getUnixTime(globalCurrentDate)
  setUpDates(globalCurrentDate)
})
