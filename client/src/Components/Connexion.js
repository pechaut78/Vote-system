import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";



class Connexion extends Component
{
    state = {
        pseudo:"admin",
        password:"",
        gotoAdmin:false,
        gotoClientAddress:false
    }            
    changePseudo = event=> {this.setState({pseudo:event.target.value})        }
    changePassword = event => { this.setState({password:event.target.value})}
    
    route = event => {        
        event.preventDefault()
        const {setIsAdmin,setIsConnected} = this.props

        if(this.state.pseudo==="admin") 
        {
            setIsAdmin(true)
            setIsConnected(true)
            this.setState({gotoAdmin:true})
        }
        else
        {
            setIsAdmin(false)
            setIsConnected(true)
            this.setState({gotoClientAddress:true})
        }
        
    }

    changPage
    render() {        
        if(this.state.gotoClientAddress)            
            return <Redirect push to={`/pseudo/${this.state.pseudo}`}></Redirect>
        
        if(this.state.gotoAdmin)        
            return <Redirect push to={`/admin`}></Redirect>
        

        return (

        <Fragment>
            <nav className="navbar navbar-dark bg-dark">
  
            </nav>
            <div  className="card mx-auto" style={{width: '20%', marginTop: 50}}>
            <div className="card-body">
            <form onSubmit= {this.route} id='signing'>
                <div className="mb-3">
                    <h5 className="card-title">Adresse</h5>
                    <input placeholder='Pseudo' className="form-control" type='text ' id="login" required defaultValue={this.state.pseudo} onChange={this.changePseudo} />
                    <div id="emailHelp" className="form-text">Adresse a utiliser pour les interactions</div>
                </div>
                <button type='submit' className="btn btn-primary">Login</button>
            </form>
            </div>
            </div>
        </Fragment>
       )
    }
}
export default Connexion