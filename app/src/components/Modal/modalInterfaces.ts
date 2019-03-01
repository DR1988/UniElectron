import { ChosenElement } from '../MainForm/MainFormInterfaces'

interface CommonMoadlInterface {
  removeValveTime: () => void
  chosenElement: ChosenElement
  closeModal: () => void
  resetToPreviousChanges: () => void
  changeStartTime: () => void
  changeEndTime: () => void
}

export default CommonMoadlInterface
