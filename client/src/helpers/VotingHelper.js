const registerVoter = async(contract,account, address, successFunc, errorFunc) => {
    try
    {
        contract.methods.registerVoter(address).send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    }
    catch(err)  {errorFunc(err)}       
}

const getStatus =  async(contract, errorFunc) => {
    let res=null
    try
    {
        res = await contract.methods.getStatus().call()
    }
    catch(err)  {errorFunc(err)}   

    return res
}

const endProposalRegistration =  async(contract,account, successFunc, errorFunc) => {
    try
    {
        contract.methods.endProposalRegistration().send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    }
    catch(err)  {errorFunc(err)}       

}

const startProposalRegistration=  async(contract,account, successFunc, errorFunc) => {
    try
    {
        contract.methods.startProposalRegistration().send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}       
}

const startVotingSession=  async(contract,account, successFunc, errorFunc) => {
    try
    {
        contract.methods.startVotingSession().send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}
}
const endVotingSession=  async(contract,account, successFunc, errorFunc) => {
    try
    {
         contract.methods.endVotingSession().send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}
}

const endVotingCount=  async(contract,account, successFunc, errorFunc) => {
    try
    {
         contract.methods.endVotingCount().send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}
}

const submitProposal=  async(contract,txt,account, successFunc, errorFunc) => {
    try
    {
         contract.methods.submitProposal(txt).send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}
}

const getProposal=  async(contract,indx) => { 
    let res = await contract.methods.getProposal(indx).call()
    return res
}
const getProposalNb=  async(contract) => {
    let res = await contract.methods.getProposalNb().call()
    return res
}
const voteFor=  async(contract,indx,account, successFunc, errorFunc) => {    
    try
    {
         contract.methods.voteFor(indx).send({from:account}).then(
            (val) => {successFunc()},
            (err) => {errorFunc(err)}
        )
    } catch(err)  {errorFunc(err)}
}

const getWinningProposition=  async(contract,  errorFunc) => {
    let res =""
    try
    {
        res =  await contract.methods.getWinningProposition().call()
        return res
    } catch(err)  {
        errorFunc(err)
        return res
    }
}


export  {
    registerVoter,
    getStatus,
    endProposalRegistration,
    startProposalRegistration,
    startVotingSession,
    endVotingSession,
    endVotingCount,
    submitProposal,
    getProposal,
    voteFor,
    getWinningProposition,
    getProposalNb

};