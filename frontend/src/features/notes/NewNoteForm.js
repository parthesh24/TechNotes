import React from 'react'
import { useState, useEffect } from 'react'
import { useAddNewNoteMutation } from './notesApiSlice'
import {useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"



const NewUserForm = ({ users }) => {
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation()

    const navigate = useNavigate()

    const [userId, setUserId] = useState(users[0].id)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')


    useEffect(() => {
        if(isSuccess){
            setUserId('')
            setTitle('')
            setText('')
            navigate('/dash/notes')
        }
    }, [isSuccess,navigate])

    const onUserIdChanged = e => setUserId(e.target.value)
    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)

    const canSave = [userId, title, text].every(Boolean) && !isLoading

    const onSaveNoteCLicked = async (e) => {
        e.preventDefault()
        if (canSave){
            await addNewNote({user:userId, title, text})
        }
    }

    const options = users.map(user => {
      return (
        <option
          key={user.id}
          value={user.id}
          >{user.username}</option>
      )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? 'form__input--incomplete' : ''
    const validTextClass = !text ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveNoteCLicked}>
                <div className='form__title-row'>
                    <h2>New Note</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                    </div>
                </div>

                    <label className='form__label' htmlFor='title'>
                        Title: <span className='nowrap'>[not empty]</span>
                    </label>
                    <input 
                        className={`form__input ${validTitleClass}`}
                        id='title'
                        name='title'
                        type='text'
                        autoComplete='off'
                        value={title}
                        onChange={onTitleChanged}
                    />

                    <label className='form__label' htmlFor='text'>
                        Text: <span className='nowrap'>[not empty]</span>
                    </label>
                    <input 
                        className={`form__input form__input--teext ${validTextClass}`}
                        id='text'
                        name='text'
                        value={text}
                        onChange={onTextChanged}
                    />

                    <label className='form__label form__checkbox-container' htmlFor="username">
                      Assigned to:
                    </label>
                    <select 
                      id='username'
                      name='username'
                      className='form__select'
                      value={userId}
                      onChange={onUserIdChanged}
                      >
                        {options}
                      </select>
            </form>
        </>
    )

  return content
}

export default NewUserForm