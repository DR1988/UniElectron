import React from 'react'

interface ClickOutProps {
  onClickOut: (e: Event) => void
  children: React.ReactNode
}

// Замена react-onclickout: библиотека использует ReactDOM.findDOMNode,
// удалённый в react-dom 19. Логика та же (клик вне поддерева → onClickOut),
// но узел берётся через callback-ref на обёртке display:contents
// (в layout не вмешивается, CSS-селекторов с комбинатором «>» в проекте нет).
// Важно НЕ гасить propagation: клики по элементам внутри (кнопка options,
// чекбоксы модалок) должны доходить до их собственных обработчиков.
export default class ClickOutHandler extends React.Component<ClickOutProps> {
  private node: HTMLElement | null = null
  private unmounted = false

  componentDidMount() {
    // отложенная регистрация: клик, открывший модалку, не должен её же закрыть
    setTimeout(() => {
      if (!this.unmounted) this.attach('addEventListener')
    }, 0)
  }

  componentWillUnmount() {
    this.attach('removeEventListener')
    this.unmounted = true
  }

  private attach(method: 'addEventListener' | 'removeEventListener') {
    document[method]('click', this.outsideClick, false)
  }

  private outsideClick = (e: Event) => {
    if (this.unmounted) return
    const target = e.target as Node | null
    // клик внутри поддерева — игнорируем (как в оригинальной библиотеке)
    if (target && this.node && this.node.contains(target)) return
    this.props.onClickOut(e)
  }

  render() {
    return (
      <div
        ref={(n) => { this.node = n }}
        style={{ display: 'contents' }}
      >
        {this.props.children}
      </div>
    )
  }
}
