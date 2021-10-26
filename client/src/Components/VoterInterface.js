import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import {openModal,closeModal} from "../helpers/modals.js"
import {getStatus, voteFor,
        getProposal,getProposalNb,submitProposal,getWinningProposition} from "../helpers/VotingHelper.js"
class VoterInterface extends Component
{
    state = {
         _ContractStatus:-1,
        _address:"",
        _Winner:"",
        _ProposalCount:0
    }

    // Variables
    _operationModal:null
    _web3:null
    _accounts:null
    _Proposals:null


    // Modal Utilities
    busyHide = () => {        
        closeModal(this._operationModal)
    }    
    errorDisplay = (err) => {
        alert(err.message)        
        this.busyHide()
    }

    // Register to the events we want to catch
    registerEventStatus = async () =>
    {
       // Listen to the contract changig its status 
       this._contract.events.WorkflowStatusChange().on("data", (event) => { 
           this.setState({_ContractStatus:event.returnValues.newStatus})

        });
        
        // For this event we do something special: we force the update of the list displayed on screen
        this._contract.events.ProposalRegistered().on("data", (event) => { 
                this.updateProposalList()                 
        });
    }



    async componentDidMount() {
       
       this.setState({_address:this.props.match.params.pseudo})
       var initModal = document.getElementById('initModal')       
       this._operationModal = document.getElementById('waitingOperation')
       
       // Display a modal window while we do operations
       openModal(initModal)

        
        var _getWeb3 = this.props.getWeb3Cnx
        var  result,loop=true
        // We loop so the site is not accessible until everything is set properly
        while(loop)
        {
            // getWeb3 comes from App
            result= await _getWeb3()
            if(result.err===null)
            {
                loop=false
                this._web3=result.web3
            }
            else{ alert("La connexion a echouee, nous retentons.")}
        }
        
        
        loop = true
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
        
        // On récupère l'état du contrat pour conditionner l'affichage
        this.setState({_ContractStatus: await getStatus(this._contract,this.errorDisplay)})    
        this._accounts = await this.props.initAccounts()
        this.registerEventStatus()

        //  On récupère la liste des propositions - Si faites
        this.updateProposalList()
        // On récupère le gagnant
        this.GetWinner()
        closeModal(initModal)
    }

    updateProposalList = async () => {
        
        // On récupère le nombre de propositions
        let nb = await getProposalNb(this._contract)
        this._Proposals = []
        // Pour chaque indx on retourne la prop. correspondante 
        for(let i=0;i<nb;i++)
        {
            console.log(i)
            this._Proposals.push(await getProposal(this._contract,i))
        }
        this.setState({_ProposalCount:nb})   
    }

    // Send a proposal to the contract
    SubmitProposal = async () =>
    {
        openModal(this._operationModal)
        var proposal = document.getElementById('proposal').value 
        await submitProposal(this._contract,proposal,this._accounts[0],this.busyHide,this.errorDisplay)
    }

    // Vote for Index
    VoteFor = async () =>
    {
        openModal(this._operationModal)
        var proposal = parseInt(document.getElementById('voteNB').value) 
        await voteFor(this._contract,proposal,this._accounts[0],this.busyHide,this.errorDisplay)
    }
    // Get The winnet proposition - only if counting has been done
    GetWinner = async () =>{
            if(this.state._ContractStatus==="5")
            {                                
                let v = await getWinningProposition(this._contract,this.errorDisplay) 
                this.setState({_Winner:v})       
            }
    }
    // Depending on the status, gives the correct interface
    getScreen = () =>
    {

        let s = parseInt(this.state._ContractStatus)
        if(s===1) { //ProposalsRegistrationStarted
        return (
            <Fragment>            
            <div  className="card mx-auto" style={{width: '28%', marginTop: 50}}>
            <div className="card-body">
            <h5 className="card-title">Proposition</h5>
            <div className="input-group">         
                <input placeholder='Texte a soumettre' className="form-control" type='text ' id="proposal" required  />
                <button onClick={this.SubmitProposal} className="btn btn-primary" >Soumettre</button>
            </div>
            </div>
            </div>
            </Fragment>
            )
        }
        if (s===3) { //VotingSessionStarted
        return (
            <Fragment>            
            <div  className="card mx-auto" style={{width: '28%', marginTop: 50}}>
            <div className="card-body">
            <h5 className="card-title">Voter Pour:</h5>
            <div className="input-group">         
                <input placeholder='Index de proposition' className="form-control" type='number' min="0" max="${this.state._ProposalCount}" id="voteNB" required  />
                <button onClick={this.VoteFor} className="btn btn-primary" >Voter pour</button>
            </div>
            </div>
            </div>
            </Fragment>
            )
        }
        if(s===-1) return(<p>Initialisation</p>)        // Web3, contract not yet initialized
        if(s===5) return(<div><p>Resultat du vote: </p><p>{this.state._Winner}</p></div>) // VotesTallied
        return(<p>Session de Vote non ouverte</p>)

             
    }

    // Render a list Element
    renderProposal = (person, index) => {
    return (
        <tr key={index.toString()}>
        <td>{index}</td>
        <td>{person}</td>
        </tr>
    )
    }

    // Construct the list of propositions
    getPropositionList = () => {
        if(this.state._ProposalCount>0)
        {
            return (
                <table className="table table-bordered" >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Proposition</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {this._Proposals.map(this.renderProposal)}
                    </tbody>
                </table>
            )
        }

    }

    render()
    {


        return (
            <Fragment>
                 
            {this.getPropositionList()}
            {this.getScreen()}

            
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

export default withRouter(VoterInterface)