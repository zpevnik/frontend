import React from 'react'
import classNames from 'classnames'
import './pagination.css'

const Pagination = props => {
  const pages = []
  const lastPage = props.lastPage
  const pagesShownCount = Math.min(props.pageSize, lastPage)
  const startingPage = Math.min(
    Math.max(props.page + 1 - Math.floor(pagesShownCount / 2), 1),
    lastPage - pagesShownCount + 1
  )
  const autoHide = props.autoHide || false

  for (let i = startingPage; i < startingPage + pagesShownCount; i++) {
    pages.push(i)
  }

  const handleFirstPageClick = () => {
    if (props.page !== 0) {
      props.onPageChange(0)
    }
  }
  const handlePreviousPageClick = () => {
    if (props.page !== 0) {
      props.onPageChange(props.page - 1)
    }
  }
  const handleNextPageClick = () => {
    if (props.page !== props.lastPage - 1) {
      props.onPageChange(props.page + 1)
    }
  }
  const handleLastPageClick = () => {
    if (props.page !== props.lastPage - 1) {
      props.onPageChange(props.lastPage - 1)
    }
  }

  if (autoHide && props.lastPage === 1)
    return null

  return (
    <ul className='pagination pull-right'>
      <li>
        <a
          className={classNames({ '-disabled': props.page === 0 })}
          onClick={handleFirstPageClick}>
          <i className='glyphicon glyphicon-backward' />
        </a>
      </li>
      <li>
        <a
          className={classNames({ '-disabled': props.page === 0 })}
          onClick={handlePreviousPageClick}>
          <i className='glyphicon glyphicon-chevron-left' />
        </a>
      </li>
      {pages.map(page => (
        <li key={page}>
          <a
            key={page}
            className={classNames({ '-active': page === props.page + 1 }, 'pagination-button')}
            onClick={() => props.onPageChange(page - 1)}>
            {page}
          </a>
        </li>
      ))}
      <li>
        <a
          className={classNames({ '-disabled': props.page === props.lastPage - 1 })}
          onClick={handleNextPageClick}>
          <i className='glyphicon glyphicon-chevron-right' />
        </a>
      </li>
      <li>
        <a
          className={classNames({ '-disabled': props.page === props.lastPage - 1 })}
          onClick={handleLastPageClick}>
          <i className='glyphicon glyphicon-forward' />
        </a>
      </li>
    </ul>
  )
}

export default Pagination
