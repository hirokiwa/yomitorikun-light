interface urlHistory {
  url: string
}

interface dataFromLocalStrage {
  history:urlHistory[]
}

interface historyWithIdType {
  id: string
  text: string,
}

interface historyTimerType {
  timerId: number,
  historyId: string
}