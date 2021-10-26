import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import {registerVoter,getStatus, endProposalRegistration,startProposalRegistration,
        startVotingSession,endVotingSession,endVotingCount,getWinningProposition} from "../helpers/VotingHelper.js"
import {openModal,closeModal} from "../helpers/modals.js"

class AdminInterface extends Component
{
    state = { _ContractStatus:-1,_voteResult:"Vote en cours..." }
    _address:""
    _web3:null
    _contract:null
    _accounts:null
    _operationModal:null

    // Modal utilities
    busyHide = () => {        
        closeModal(this._operationModal)
    }

    errorDisplay = (err) => {
        alert(err.message)        
        this.busyHide()
    }

    // Listening to events
    registerEventStatus = async () =>
    {
        // Listen to status change
       this._contract.events.WorkflowStatusChange().on("data", (event) => { 
           this.setState({_ContractStatus:event.returnValues.newStatus})
        });
        
        //Listen to the end of the voting session
        this._contract.events.VotesTallied().on("data", (event) => { 
           getWinningProposition(this.contract).then((val)=>{
               this.setState({_voteResult: val })
           })         
        });
    }



   async componentDidMount() {
       var initModal = document.getElementById('initModal')       
       this._operationModal = document.getElementById('waitingOperation')
       
       openModal(initModal)

        if(!this.props.isConnected()||!this.props.isAdmin()) return
        var _getWeb3 = this.props.getWeb3Cnx
        var err, result,loop=true

        // Inifinite loop so we do not interact with the page if we are not fully connected
        // Get Web3
        while(loop)
        {
            result= await _getWeb3()
            if(result.err===null)
            {
                loop=false
                this._web3=result.web3
            }
            else{ alert("La connexion a echouee, nous retentons.")}
        }
        loop = 1
        // Get a Cnx To the Contract
        while(loop)
        {
            result= await this.props.initContract()
            if(result.err===null)
            {
                this._contract = result.contract 
                loop = false
            }
            else{alert("Connexion au contrat impossible, nous retentons")}
        }    

        this.setState({_ContractStatus: await getStatus(this._contract,this.errorDisplay)})    
        this._accounts = await this.props.initAccounts()
        this.registerEventStatus()
        closeModal(initModal)
    }


    // Mapping for contract functions    
    getVothingResult = async () =>{
        if(this._ContractStatus!=5) return (<p>Vote en cours...</p>)
        const m = await getWinningProposition()
        return (<p>{m}</p>) 
    }
    RegisterVoter = async ()=> {                       
        openModal(this._operationModal) 
       await registerVoter(this._contract,this._accounts[0],this._address,this.busyHide,this.errorDisplay)    
    }

    StartProposalRegistration = async () => {
        openModal(this._operationModal)
        await startProposalRegistration(this._contract,this._accounts[0],this.busyHide,this.errorDisplay)
    }
    EndProposalRegistration = async () => {
        openModal(this._operationModal)
        await endProposalRegistration(this._contract,this._accounts[0],this.busyHide,this.errorDisplay)
    }
    StartVotingSession = async () => {
        openModal(this._operationModal)
        await startVotingSession(this._contract,this._accounts[0],this.busyHide,this.errorDisplay)
    }
    EndVotingSession = async () => {
        openModal(this._operationModal)
        await endVotingSession(this._contract,this._accounts[0],this.busyHide,this.errorDisplay)
    }
    EndVotingCount = async () => {
        openModal(this._operationModal)
        await endVotingCount(this._contract,this._accounts[0],this.busyHide,this.errorDisplay)
    }

    
    changeAdress = async (event) => {
        this._address = event.target.value
    }

    // Map the internal state of the contract with a description string
    analyzeStatus(param)
    {
        switch (param)
        {
            case -1: return "Connexion au contrat"
            case 0: return "RegisteringVoters";
            case 1: return "ProposalsRegistrationStarted";
            case 2: return "ProposalsRegistrationEnded";
            case 3: return "VotingSessionStarted";
            case 4: return "VotingSessionEnded";
            case 5: return "VotesTallied";
            default: return "Invalid Status";            
        }
    }


    
    render()
    {
        // If we type in the adress directly invite to use the default 
        if(!this.props.isConnected()||!this.props.isAdmin())        return (<Redirect push to={`/`} />)
        // Otherwise execute the page
        
        return (
        <Fragment>
        <nav className="navbar fixed-top navbar-dark bg-dark">
            <span className="navbar-text">
            Status: {this.analyzeStatus(parseInt(this.state._ContractStatus))}
            </span>
        </nav> 
        <div  className="card mx-auto" style={{width: '28%', marginTop: 50}}>
        <div className="card-body">
            <div className="input-group">         
                <input placeholder='Address' className="form-control" type='text ' id="Address" required onChange={this.changeAdress} />
                <button onClick={this.RegisterVoter} className="btn btn-primary" >Register Voter</button>
            </div>
        </div>
        </div>
        <div  className="card mx-auto" style={{width: '28%'}}>
        <div className="card-body">
            <div className="input-group">         
                <button onClick={this.StartProposalRegistration} className="btn btn-primary mr-1" >Start Proposal Registration</button>
                <button onClick={this.EndProposalRegistration} className="btn btn-primary" >End Proposal Registration</button>
            </div>
        </div>
        </div>
        <div  className="card mx-auto" style={{width: '28%'}}>
        <div className="card-body">
            <div className="input-group ">         
                <button onClick={this.StartVotingSession} className="btn btn-primary mr-1  " >Start Voting Registration</button>
                <button onClick={this.EndVotingSession} className="btn btn-primary  " >End Voting Registration</button>
            </div>
        </div>
        </div>
        <div  className="card mx-auto" style={{width: '28%'}}>
        <div className="card-body">
            <div className="input-group ">         
                <button onClick={this.EndVotingCount} className="btn btn-primary mr-1  " >End Voting Count</button>
            </div>
        </div>
        </div>
        <div  className="card mx-auto" style={{width: '28%'}}>
        <div className="card-body">
            <div className="input-group ">         
               <p>Resultat du vote : </p>
               { this.state._voteResult}
            </div>
        </div>
        </div>
        <div className="modal fade" id="initModal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Connexion</h5>                
            </div>
            <div className="modal-body">                
                <span className="spinner-border spinner-border-sm " role="status"/>
                <span> Veuillez vous connecter avec Metamask </span>                
             </div>
             </div>
        </div>
        </div>

       <div className="modal fade" id="waitingOperation" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Transaction</h5>                
            </div>
            <div className="modal-body">                
                <span className="spinner-border spinner-border-sm " role="status"/>
                <span> En attente d'execution de la demande </span>                

            </div>
             </div>
        </div>
        </div>

        </Fragment>
        )
    }
}

export default AdminInterface