import React, {useState, useEffect} from "react"
import phoneService from "./services/phoneService"

const DisplayEntry = ({ name, number, id }) => {
    const [ newName, setName ] = useState(name)
    const [ newNumber, setNumber ] = useState(number)
    const [ buttonVal, setButtonVal ] = useState("")

    const deleteHandler = (id) =>{
        const handler = () =>{
            if(window.confirm(`Do you reall want to delete ${name}'s number?`)){
                phoneService.deletePhone(id)
                .then(response => {
                    console.log("Phone number deleted")
                    setName("")
                    setNumber("")
                    setButtonVal("")
                })
            }
        }
        return handler
    }

    useEffect(()=>{
        setButtonVal(<button onClick={deleteHandler(id)}>delete</button>)
    },
    [])

    return(
        <div>
            {newName} {newNumber}
            {buttonVal}
        </div>
    )
}

const DisplayEntries = ({ names, regVal }) => {
    const regExp = new RegExp(regVal, "i")
    const filteredArray = names.filter((entry) => regExp.test(entry.name))
    const namesArray = filteredArray.map((entry) => <DisplayEntry key={entry.id} name={entry.name} number={entry.number} id={entry.id} />)
    return(
    <div>
        {namesArray}
    </div>
    )
}

export default DisplayEntries