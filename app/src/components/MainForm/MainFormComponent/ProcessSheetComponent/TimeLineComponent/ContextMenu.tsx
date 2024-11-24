import React, {ChangeEvent, FunctionComponent, useCallback, useEffect, useState} from 'react';
import type {RemoveSpaceOption} from '../../../../CommonTypes'
import styles from './ContextMenu.css'
import {contextMenuSize} from './constant';

type ContextMenuProp = {
  closeContextMenu: () => void
  selectMode: (mode: RemoveSpaceOption) => void
}

export const ContextMenu:FunctionComponent<ContextMenuProp> = ({closeContextMenu, selectMode}) => {

  const [value, changeValue] = useState<RemoveSpaceOption | undefined>(undefined)

  const _changeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    changeValue(event.target.value as RemoveSpaceOption)
  }, [])

  const _closeContextMenu = useCallback(() => {
    closeContextMenu()
    changeValue(undefined)
  }, [])

  const _accept = useCallback(() => {
    if (!value) {
      return
    }
    selectMode(value)
    _closeContextMenu()
  }, [value, selectMode])


  return <section
    onMouseDown={(event) => {
      event.stopPropagation()
    }}
    onMouseUp={(event) => {
      event.stopPropagation()
    }}
    onClick={(event) => {
      event.stopPropagation()
    }}
    className={styles.container}
    style={{
      width: 'inherit',// contextMenuSize.width,
      height: 'inherit', // contextMenuSize.height
    }}
  >
    <div className={styles.content}>

      <div className={styles.closeButtonContainer}>
        <div onClick={_closeContextMenu} className={styles.closeButton}>
          <div className={`${styles.closeButtonLine} ${styles.closeButtonLineRight}`}/>
          <div className={`${styles.closeButtonLine} ${styles.closeButtonLineLeft}`}/>
        </div>
      </div>

      <div className={styles.selectorContainer}>
        <div className={styles.inputContainer}>
          <input
            type="radio"
            id="removeAll"
            name="radio"
            value="remove_all"
            checked={value === 'remove_all'}
            onChange={_changeValue}/>
          <label className={styles.label} htmlFor={'removeAll'}>Remove all</label>
        </div>

        <div className={styles.inputContainer}>
          <input
            type="radio" name="radio" value="remove_changes" id={"removeChanges"}
            checked={value === 'remove_changes'}
            onChange={_changeValue}/>
          <label className={styles.label} htmlFor={'removeChanges'}>Remove changes</label>
        </div>

        <div className={styles.inputContainer}>
          <input
            type="radio" name="radio" value="insert_space" id={"insertSpace"}
            checked={value === 'insert_space'}
            onChange={_changeValue}/>
          <label className={styles.label} htmlFor={'insertSpace'}>Insert space</label>
        </div>
      </div>

      <div className={styles.acceptButtonContainer} style={{opacity: value ? 1 : 0.5}}>
        <div onClick={_accept} className={styles.acceptButton}>
          <span className={styles.acceptButtonSign}>ok</span>
        </div>
      </div>
    </div>
  </section>
}
