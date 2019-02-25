import React from 'react'
import ReactDOM from 'react-dom'

interface HasClickOutside {
  onClickedOutside(e: Event): void;
}

export default function ClickOutside<Props, State>(
  Wrappable: Class<React.Component<Props, State> & HasClickOutside>,
): Class<React.Component<Props, State>> {
  return class extends Wrappable {
    componentDidMount = (): void => {
      document.addEventListener(
        'click',
        this.outsideClickHandler,
        true,
      )
    }

    componentWillUnmount = (): void => {
      document.removeEventListener(
        'click',
        this.outsideClickHandler,
        true,
      )
    }

    outsideClickHandler = (e: Event): void => {
      const domNode = ReactDOM.findDOMNode(this) // eslint-disable-line
      const clickedOutside = !domNode ||
        ((e.target instanceof Node) &&
          !domNode.contains(e.target))
      if (clickedOutside) {
        this.onClickedOutside(e)
      }
    }
  }
}
