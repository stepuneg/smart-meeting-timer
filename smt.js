const mainZoneElem = document.getElementById("mainZone")
const hoursElem = document.getElementById("hours")
const minutesElem = document.getElementById("minutes")
const numSpeakersElem = document.getElementById("num-speakers")
const countdownElem = document.getElementById("countdown")
const countdownMinElem = document.getElementById("countdownMin")
const countdownSecElem = document.getElementById("countdownSec")
const giveFloorButtonElem = document.getElementById("giveFloorButton")

function adjustTime(minutes) {
    adjustTimeAction(minutes)
    renderMeetingTill()
    renderTiming()
}

function changeMeetingTill() {
    const hh = hoursElem.value
    const mm = minutesElem.value
    setTimeAction(hh, mm)
    renderTiming()
}

function adjustSpeakers(increment) {
    adjustSpeakersAction(increment)
    renderNumOfSpeakers()
    renderTiming()
}

function changeNumberOfSpeekers() {
    const newNum = numSpeakersElem.value
    setNumberOfSpeakersAction(newNum)
    renderTiming()
}

function giveFloor() {
    giveFloorAction()
    render()
}

let shownImageNum = -1
function showBGImage() {
    if(shownImageNum == state.imageNum)
        return
    mainZoneElem.style.backgroundImage = "url('assets/backgrounds/bg" + (state.imageNum + 1).toString() + ".jpg')"
    shownImageNum = state.imageNum
}

let greyscale = false
function setBGGreyscale(makeGreyscale) {
    if (greyscale == makeGreyscale)
        return
    else {
        if (makeGreyscale)
            mainZoneElem.style.filter = "grayscale(100%)"
        else
            mainZoneElem.style.filter = "grayscale(0%)"
    }
    greyscale = makeGreyscale
}

function notifyBySound() {
    new Audio("assets/sounds/4.mp3").play();
}

function renderCountdown(totalSeconds) {
    const minutes = Math.floor(Math.abs(totalSeconds) / 60)
    const seconds = Math.abs(totalSeconds) % 60
    countdownMinElem.innerText = minutes.toString().padStart(2, "0")
    countdownSecElem.innerText = seconds.toString().padStart(2, "0")
}

function renderTiming() {
    showBGImage()

    if (state.floorGiven) {
        giveFloorButtonElem.innerText = "Stop The Speaker"
        giveFloorButtonElem.classList.add("btn-danger")
        countdownElem.classList.remove("text-muted")
        let timeLeftInSeconds = getTimeLeftInSeconds(state.currentSpeakerEndTime)
        if (timeLeftInSeconds <= 0 && !state.bellRung) {
            notifyBySound()
            bellRungAction()
        }
        renderCountdown(timeLeftInSeconds)
        if (timeLeftInSeconds < 0)
            countdownElem.classList.add("alert-danger")
        else
            countdownElem.classList.remove("alert-danger")
        setBGGreyscale(false)
    }
    else {
        giveFloorButtonElem.innerText = "Give The Floor"
        giveFloorButtonElem.classList.remove("btn-danger")
        countdownElem.classList.add("text-muted")
        renderCountdown(getSpeakingDurationInSeconds(state.meetingTill, state.numberOfSpeakers))
        countdownElem.classList.remove("alert-danger")
        setBGGreyscale(true)
    }
}

function renderMeetingTill() {
    hoursElem.value = state.meetingTill.getHours().toString().padStart(2, "0")
    minutesElem.value = state.meetingTill.getMinutes().toString().padStart(2, "0")
}

function renderNumOfSpeakers() {
    numSpeakersElem.value = state.numberOfSpeakers
}

function render() {
    renderMeetingTill()
    renderNumOfSpeakers()
    renderTiming()
}

function init() {
    chooseRandomImage()
    render()
    setInterval(renderTiming, 1000)
}