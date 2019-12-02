import React, { useState, useEffect } from 'react'
import DisplayHeader from "./DisplayHeader"
import DisplayInput from "./DisplayInput"
import phoneService from "./services/phoneService"
import ErrorSuccess from "./ErrorSuccessMessage"

import "./index.css"

const DisplayEntry = ({ name, number, deleteHandler, id }) =>{
  return(
    <div>
      {name} {number}
      <button onClick={() => deleteHandler(id)}>
        delete
      </button>
    </div>
  )
}

const DisplayEntries = ({ entries, regVal, onClickDeleteHandler }) =>{
  const regExp = new RegExp(regVal, "i")
  const filetedEntries = entries.filter(entry => regExp.test(entry.name))
  const newEntries = filetedEntries.map(entry => <DisplayEntry key={entry.id} name={entry.name} number={entry.number} deleteHandler={onClickDeleteHandler} id={entry.id} />)

  return(
    <div>
      {newEntries}
    </div>
  )
}

const App = () =>{
  const [ userName, setUserName ] = useState("")
  const [ userPhone, setPhone ] = useState("")
  const [ newFilter, setNewFilter ] = useState("")
  const [ entryList, setEntryList ] = useState([])
  const [ errorSuccess, setErrorSuccess ] = useState("")

  const changeHandlerName = (event) => setUserName(event.target.value)

  const changeHandlerNumber = (event) => setPhone(event.target.value)

  const changeHandlerFilter = (event) => {
    //maybe we can do something better with this, as it needs to send
    //request to the server in order to filder the data, main issue
    //is the DisplayEntries component
    const value = event.target.value
    phoneService
      .getAll()
      .then(phoneDatabase =>{
        setNewFilter(value)
        setEntryList(<DisplayEntries 
          entries={phoneDatabase}
          regVal={value}
          onClickDeleteHandler={deleteHandler}
           />)
        })
  }

  const deleteHandler = entryId =>{
    if(window.confirm(`Do you really wish to delete ths number?`)){
      phoneService
      .deletePhone(entryId)
      .then(()=>{
        setUserName("")
        setPhone("")
        phoneService
        .getAll()
        .then(phoneDatabase =>{
          setEntryList(<DisplayEntries 
            entries={phoneDatabase}
            regVal={newFilter}
            onClickDeleteHandler={deleteHandler}
             />)
        })
      })
    }
  }

  const submitHandler = event =>{
    event.preventDefault()
    phoneService
    .getAll()
    .then(phoneDatabase =>{
      const newPhoneDatabase = [...phoneDatabase]
      if(newPhoneDatabase.some(entry => entry.name === userName)){
        if(window.confirm(`${userName} is already added to the phonebook, replace the old number with the new one?`)){
          const phoneToReplaceId = newPhoneDatabase.find(entry => entry.name === userName).id
          const newEntry2 = {
            name: userName,
            number: userPhone
          }
          phoneService
          .replacePhone(phoneToReplaceId, newEntry2)
          .then(() =>{
            phoneService
            .getAll()
            .then(phoneDatabase =>{
              setUserName("")
              setPhone("")
              setEntryList(<DisplayEntries 
                entries={phoneDatabase}
                regVal={newFilter}
                onClickDeleteHandler={deleteHandler}
              />)
            })
          })
          .catch(() =>{
            setErrorSuccess(<ErrorSuccess 
              message={`The information of ${newEntry2.name} has already been removed from the server `}
              success={false}
              callback={() => setTimeout(() => setErrorSuccess(""), 5000)}
            />)
            phoneService
            .getAll()
            .then(phoneDatabase =>{
              setUserName("")
              setPhone("")
              setEntryList(<DisplayEntries 
                entries={phoneDatabase}
                regVal={newFilter}
                onClickDeleteHandler={deleteHandler}
              />)
            })
          })
        }
        //no nothing otherwise
      }else{
        const newEntry = {
          name: userName,
          number: userPhone
        }
        phoneService
        .postPhone(newEntry)
        .then(addedPhone=>{
          setUserName("")
          setPhone("")
          setErrorSuccess(<ErrorSuccess 
            message={`added ${addedPhone.name}`}
            success={true}
            callback={() => setTimeout(() => setErrorSuccess(""), 5000)} 
            />)
          setEntryList(<DisplayEntries 
            entries={newPhoneDatabase.concat(addedPhone)}
            regVal={newFilter}
            onClickDeleteHandler={deleteHandler}
             />)
        })
      }
    })
  }

  useEffect(()=>{
    phoneService
    .getAll()
    .then(phoneDatabase=> setEntryList(
    <DisplayEntries
      entries={phoneDatabase}
      regVal={newFilter}
      onClickDeleteHandler={deleteHandler}
       />))
  },
  [])

  return(
    <div>
       <DisplayHeader message={"Phonebook"} />
       {errorSuccess}
       <DisplayInput message={"filter shown with: "} onChangeHandler={changeHandlerFilter} inputValue={newFilter} />
       <DisplayHeader message={"add a new"} />
       <form onSubmit={submitHandler}>
       <DisplayInput message={"name: "} onChangeHandler={changeHandlerName} inputValue={userName} />
       <DisplayInput value ={"number: "} onChangeHandler={changeHandlerNumber} inputValue={userPhone} />
         <div>
           <button type="submit">add</button>
         </div>
       </form>
       <DisplayHeader message={"Numbers"} />
       {entryList}
     </div>
  )
}

export default App