import { ChosenElement } from '../MainForm/MainFormInterfaces'

interface CommonMoadlInterface {
  removeValveTime: () => void
  chosenElement: ChosenElement
  closeModal: () => void
  resetToPreviousChanges: () => void
  changeStartTime: (startTime: number) => void
  changeEndTime: (endTime: number) => void
}

export default CommonMoadlInterface
