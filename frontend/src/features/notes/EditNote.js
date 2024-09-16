import React from 'react'
import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const EditNote = () => {
  const { id } = useParams()

  const { username, isManager, isAdmin} = useAuth()

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({data}) => ({
      note: data?.entites[id]
    }),
  })
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({data}) => ({
      user: data?.ids.map(id => data?.entites[id])
    }),
  })

  if(!note || !users?.length) return <PulseLoader color='#FFF' />

  if(!isManager && !isAdmin){
    if(note.username !== username) {
      return <p className='errmsg'>No access</p>
    }
  }

  const content =  <EditNoteForm note={note} users={users} />
  
  return content
}

export default EditNote