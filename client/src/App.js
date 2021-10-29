import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./helpers/getWeb3";
import {BrowserRouter, Route, Switch } from 'react-router-dom'

import "./App.css";
import Connexion from './Components/Connexion'
import NotFound  from "./Components/NotFound"
import VoterInterface  from "./Components/VoterInterface"
import AdminInterface  from "./Components/AdminInterface"

class App extends Component {
 
  constructor() {
    super()
    this.state = {
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
      isAdmin:false,
      isConnected:false 
    }
   // this.getWeb3Cnx = this.getWeb3Cnx.bind(this)
  }

   setIsAdmin = val =>this.setState({isAdmin:val})                      
   setIsConnected = val =>this.setState({isConnected:val})
   isConnected = () => this.state.isConnected
   isAdmin = () => this.state.isAdmin

   // Returns the Web3 provider
   getWeb3Cnx = async ()=> {    
     var web3 = this.state.web3
     var err = null
     if( web3 ===null) 
     try {
        web3 = await getWeb3();      
        this.setState({web3})
     }
     catch (error) {
      // Catch any errors for any of the above operations.
      err= error;
      console.error(error);
    }
     return {web3,err}
   }

   initAccounts = async () => {
    const web3 = this.state.web3
    try {
       // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        this.setState({accounts:accounts})
        return accounts
      }
      catch(error)
      {
        alert(
          `accounts: Can not get them. Check console for details.`,
        );
        console.error(error);
        
        return null;
      }
    }
    getAccounts = () => this.state.accounts[0];

   initContract = async () => {
     const web3 = this.state.web3
     var contract = null, err=null
     try {
       // Use web3 to get the user's accounts.

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        //console.log(deployedNetwork.address)
        contract = await new web3.eth.Contract(VotingContract.abi,deployedNetwork && deployedNetwork.address);
        this.setState({contract:contract})
      }
      catch (error) {
        // Catch any errors for any of the above operations.
        err=error
      }
      return {contract,err }
   }
/*
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
*/
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };



  render() {
    
    return (
        <BrowserRouter>
          <Switch>
              <Route exact path='/'> 
                <Connexion  setIsAdmin={this.setIsAdmin} setIsConnected={this.setIsConnected}/> 
              </Route>
              <Route path='/pseudo/:pseudo'>
                  <VoterInterface  isConnected={this.isConnected} isAdmin={this.isAdmin}
                    getWeb3Cnx={this.getWeb3Cnx} initContract={this.initContract} initAccounts={this.initAccounts} getAccounts={this.getAccounts}/>
              </Route>
              <Route path='/admin'>
               
                <AdminInterface isConnected={this.isConnected} isAdmin={this.isAdmin} 
                    getWeb3Cnx={this.getWeb3Cnx} initContract={this.initContract} initAccounts={this.initAccounts} getAccounts={this.getAccounts}/>
              </Route>
              <Route component={NotFound} /> 
          </Switch>
      </BrowserRouter>
    )
/*
    if(!connectef)
    {
      return <p>please Login</p>
    }
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );*/
  }
  
}

export default App;
