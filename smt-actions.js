const state = {
    meetingTill: new Date(),
    numberOfSpeakers: 0,
    floorGiven: false,
    currentSpeakerEndTime: null,
    bellRung: false,
    imageNum: -1
}

const imagesCount = 4

function chooseRandomImage() {
    if (state.imageNum == -1)
        state.imageNum = Math.floor(Math.random() * imagesCount)
    else
        state.imageNum = (state.imageNum + Math.floor(Math.random() * (imagesCount - 1)) + 1) % imagesCount
}

function getSpeakingDurationInSeconds(tillDt, numberOfSpeakers) {
    if(numberOfSpeakers == 0)
        return 0
    const nowMs = new Date().getTime()
    const meetingTillMs = tillDt.getTime()
    if(nowMs >= meetingTillMs)
        return 0
    return Math.floor((meetingTillMs - nowMs) / 1000 / numberOfSpeakers)
}

function getTimeLeftInSeconds(tillDt) {
    const nowMs = new Date().getTime()
    const meetingTillMs = tillDt.getTime()
    return Math.floor((meetingTillMs - nowMs) / 1000)
}

function bellRungAction() {
    state.bellRung = true
}

function adjustSpeakersAction(increment) {
    state.numberOfSpeakers = Math.min(Math.max(state.numberOfSpeakers + increment, 0), 99)
}

function adjustTimeAction(minutes) {
    const dt = state.meetingTill
    const step = minutes
    const msStep = step * 60000
    const newMeatingTill = new Date(Math.round((dt.getTime() + msStep) / msStep) * msStep)
    const now = new Date()
    state.meetingTill = newMeatingTill < now ? now : new Date(Math.round((dt.getTime() + msStep) / msStep) * msStep)
}

// receiving potentially incorrect strings of hh and mm
function setTimeAction(hh, mm) {
    if(!hh || !mm)
        return
    const re = /^[0-9]{1,2}$/
    if(!re.test(hh) || !re.test(mm))
        return
    hhNum = Number(hh)
    mmNum = Number(mm)
    if(hhNum > 23 || mmNum > 59)
        return

    // compare time with the current time (now) and if the time "seems" earlier than "now" ignore it
    const now = new Date()
    const candidateTime1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hhNum, mmNum)
    const newMeetingTill = candidateTime1 > now ? candidateTime1 : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hhNum, mmNum)
    if((newMeetingTill.getTime() - now.getTime()) / 1000 / 60 / 60 > 12)
        return

    state.meetingTill = newMeetingTill
}

// receiving potentially incorrect newNum (string)
function setNumberOfSpeakersAction(newNum) {
    if(!newNum)
        return
    const re = /^[0-9]{1,2}$/
    if(!re.test(newNum))
        return
    state.numberOfSpeakers = Number(newNum)
}


function giveFloorAction() {
    state.floorGiven = !state.floorGiven
    if(!state.floorGiven)
    {
        chooseRandomImage()
        return
    }
    state.bellRung = false
    state.currentSpeakerEndTime = new Date(new Date().getTime() + getSpeakingDurationInSeconds(state.meetingTill, state.numberOfSpeakers) * 1000)
    adjustSpeakersAction(-1)
}
