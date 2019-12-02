import React from "react"

const DisplayErrorSuccess = ({ message, success, callback }) =>{
    if(success){
        callback()
        return (
            <div>
                <h1 className="success">
                    {message}
                </h1>
            </div>
        )
    }else{
        callback()
        return (
            <div>
                <h1 className="error">
                    {message}
                </h1>   
            </div>
        )
    }
}

export default DisplayErrorSuccess