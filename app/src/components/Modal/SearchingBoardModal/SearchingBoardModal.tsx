import React from 'react'
import cn from 'classnames'

import s from './../styles/ValveLineModal.css'
import style from './styles.css'

const SearchingBoardModal = () => {

    return (
        <div className={style.loading}>
            <div className={style['loading-text']}>
                <span className={s['loading-text-words']}>I</span>
                <span className={s['loading-text-words']}>N</span>
                <span className={s['loading-text-words']}>I</span>
                <span className={s['loading-text-words']}>T</span>
                <span className={s['loading-text-words']}>I</span>
                <span className={s['loading-text-words']}>A</span>
                <span className={s['loading-text-words']}>L</span>
                <span className={s['loading-text-words']}>I</span>
                <span className={s['loading-text-words']}>Z</span>
                <span className={s['loading-text-words']}>A</span>
                <span className={s['loading-text-words']}>T</span>
                <span className={s['loading-text-words']}>I</span>
                <span className={s['loading-text-words']}>O</span>
                <span className={s['loading-text-words']}>N</span>
            </div>
        </div>
    )
}

export default SearchingBoardModal

