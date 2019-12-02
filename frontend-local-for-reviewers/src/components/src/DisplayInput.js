import React from "react"

const DisplayInput = ({ message, onChangeHandler, inputValue })=>{
    return(
    <div>
        {message} <input onChange={onChangeHandler} value={inputValue} />
    </div>
    )
}

export default DisplayInput