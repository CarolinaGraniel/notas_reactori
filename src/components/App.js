import React, {useState, useEffect} from 'react';
import Note from './Note';
import noteService from '../services/notes';
import Notification from "./Notification";



const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('A new note')
    const [showAll, setShowAll]= useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
     useEffect(()=> {
     noteService
     .getAll()
      .then(response => {
        setNotes(response)
      })
     
     },[])
     
     console.log('render',notes.length, 'notes');


    //Método donde se indica cuando se aplane el boton   
    const addNote = (event) => {
      event.preventDefault()
      //console.log('button clicked', event.target);
      const noteObject = {
        content: newNote,
        date: new Date().toISOString(), //Sacamos la fecha del sistema y lo metemos en un metodo
        important: Math.random()<0.5
        

      }

      noteService
      .create(noteObject)
      .then(response=> {
        setNotes(notes.concat(response))
        setNewNote('')
      })
     

      
    }
    const handleNoteChange = (event) => {
      //console.log(event.target.value)
      setNewNote(event.target.value)
    }
    const notesToShow = showAll ? 
     notes : notes.filter(x => x.important=== true) 

//post insertar, put actualizar y get agregar
     const updateImportance = (id) =>{

        
         const note = notes.find(x => x.id === id)
         const note2 = {...note, important: !note.important}
         noteService
         .update(id,note2)
         .then(response =>{
          setNotes(notes.map(x => x.id!==id? x: response))
         })
         .catch(error => {
        setErrorMessage(`the note ${note2.content} was already deleted from server` )
        setTimeout(()=>{
          setErrorMessage(null)

        },5000)
          setNotes(notes.filter(x => x.id !== id))
          
     })
    }
    return (
      <div>
        <h1>Notes</h1>
        <Notification message={errorMessage}/>
        <button onClick={()=> setShowAll(!showAll)}> 
          show {showAll? 'important' : 'all'}

        </button>
        <ul>
          {notesToShow.map(x=>{
            console.log(x.id, x.content);
            return (
          <Note key= {x.id} 
          note={x}
          updateImportance = {()=>updateImportance(x.id)} />
            )
        })}
        </ul>
        <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange}/>
          <button type='submit'> Save</button>
        </form>
      </div>
    )
  }



export default App