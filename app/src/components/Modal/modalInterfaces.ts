import { ChosenElement } from '../MainForm/MainFormInterfaces'

interface CommonMoadlInterface {
  removeValveTime: () => void
  chosenElement: ChosenElement
  closeModal: () => void
  resetToPreviousChanges: () => void
}

export default CommonMoadlInterface
