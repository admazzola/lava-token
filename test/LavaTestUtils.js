
var web3utils = require('web3-utils')
const ethUtil = require('ethereumjs-util')
var ethSigUtil = require('eth-sig-util')
var EIP712Helper = require("./EIP712Helper");
var EIP712HelperV3 = require("./EIP712HelperV3");


/*

  1) signTypedData - accepts data and signs it with the private key just like Metamask

  2)TODO recoverSignerAddress



*/



module.exports = class LavaTestUtils{



  //get the signature !!
   static signTypedData(typedDataHash, privateKey )
  {

    //const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)
    console.log('msghash1',typedDataHash)


    var privKey = Buffer.from(privateKey, 'hex')

    var bufferToSign = Buffer.from(typedDataHash , 'hex')


    const sig = ethUtil.ecsign(bufferToSign, privKey)
    return ethUtil.bufferToHex(ethSigUtil.concatSig(sig.v, sig.r, sig.s))

  }



  recoverTypedSignature(params)
 {

    return ethSigUtil.recoverTypedSignature(params)

 }


 /**
 * @param typedData - Array of data along with types, as per EIP712.
 * @returns Buffer

function typedSignatureHash(typedData) {
  const error = new Error('Expect argument to be non-empty array')
  if (typeof typedData !== 'object' || !typedData.length) throw error

  const data = typedData.map(function (e) {
    return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
  })
  const types = typedData.map(function (e) { return e.type })
  const schema = typedData.map(function (e) {
    if (!e.name) throw error
    return e.type + ' ' + e.name
  })

  return ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data)
    ]
  )
}
 */



/*
 getLavaPacketSchemaHash()  //fix me
 {
    var hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;
    return hardcodedSchemaHash;
 }
 */

 static getLavaTypedDataHash(typedData,types)
 {
   var typedDataHash = ethUtil.sha3(
       Buffer.concat([
           Buffer.from('1901', 'hex'),
           EIP712HelperV3.structHash('EIP712Domain', typedData.domain, types),
           EIP712HelperV3.structHash(typedData.primaryType, typedData.message, types),
       ]),
   );

   return typedDataHash;
 }


 static getLavaTypedDataFromParams(   methodName,relayAuthority,from,
   to,walletAddress,tokenAmount, relayerRewardTokens,expires,nonce )
 {
   const typedData = {
           types: {
               EIP712Domain: [
                   { name: "contractName", type: "string" },
                   { name: "version", type: "string" },
                   { name: "chainId", type: "uint256" },
                   { name: "verifyingContract", type: "address" }
               ],
               LavaPacket: [
                   { name: 'methodName', type: 'string' },
                   { name: 'relayAuthority', type: 'address' },
                   { name: 'from', type: 'address' },
                   { name: 'to', type: 'address' },
                   { name: 'wallet', type: 'address' },
                   //{ name: 'token', type: 'address' },
                   { name: 'tokens', type: 'uint256' },
                   //{ name: 'relayerRewardToken', type: 'address' },
                   { name: 'relayerRewardTokens', type: 'uint256' },
                   { name: 'expires', type: 'uint256' },
                   { name: 'nonce', type: 'uint256' }
               ],
           },
           primaryType: 'LavaPacket',
           domain: {
               contractName: 'Lava Wallet',
               version: '1',
               chainId: 1,
               verifyingContract: walletAddress
           },
           message: {
               methodName: methodName,
               relayAuthority: relayAuthority,
               from: from,
               to: to,
               wallet: walletAddress,
              // token: tokenAddress,
               tokens: tokenAmount,
            //   relayerRewardToken: relayerRewardToken,
               relayerRewardTokens: relayerRewardTokens,
               expires: expires,
               nonce: nonce
           }
       };





     return typedData;
 }





 static getLavaTypedDataFromParamsOld(   methodName,relayAuthority,from,
   to,walletAddress,tokenAmount, relayerRewardTokens,expires,nonce )
 {
   const typedData = {
           types: {

               LavaPacket: [
                   { name: 'methodName', type: 'string' },
                   { name: 'relayAuthority', type: 'address' },
                   { name: 'from', type: 'address' },
                   { name: 'to', type: 'address' },
                   { name: 'wallet', type: 'address' },
                   //{ name: 'token', type: 'address' },
                   { name: 'tokens', type: 'uint256' },
                   //{ name: 'relayerRewardToken', type: 'address' },
                   { name: 'relayerRewardTokens', type: 'uint256' },
                   { name: 'expires', type: 'uint256' },
                   { name: 'nonce', type: 'uint256' }
               ],
           },
           primaryType: 'LavaPacket',
          /* domain: {
               name: 'Lava Wallet',
               verifyingContract: walletAddress,
           },*/
           packet: {
               methodName: methodName,
               relayAuthority: relayAuthority,
               from: from,
               to: to,
               wallet: walletAddress,
              // token: tokenAddress,
               tokens: tokenAmount,
            //   relayerRewardToken: relayerRewardToken,
               relayerRewardTokens: relayerRewardTokens,
               expires: expires,
               nonce: nonce
           },
       };





     return typedData;
 }


 static bufferToHex(buffer)
 {
    return '0x' + buffer.toString('hex')
 }




     static getLavaPacket(
       methodName,relayAuthority,from,to,wallet,tokens,
       relayerRewardTokens,expires,nonce,signature)
     {

       return {
         methodName:methodName,
         relayAuthority:relayAuthority,
         from: from,
         to: to,
         wallet:wallet,
        // token:token,
         tokens:tokens,
        // relayerRewardToken:relayerRewardToken,
         relayerRewardTokens:relayerRewardTokens,
         expires:expires,
         nonce:nonce,
         signature:signature
       }


     }

     static lavaPacketHasValidSignature(packetData){


          var typedData = LavaTestUtils.getLavaTypedDataFromParams(
            packetData.methodName,
             packetData.relayAuthority,
             packetData.from,
             packetData.to,
             packetData.wallet,
           //  packetData.token,
             packetData.tokens,
           //  packetData.relayerRewardToken,
             packetData.relayerRewardTokens,
             packetData.expires,
             packetData.nonce);


             const types = typedData.types;

       //this is borked
       var sigHash = LavaTestUtils.getLavaTypedDataHash(typedData,types);
       var hashBuf = ethUtil.toBuffer(sigHash)

       var msgBuf = ethUtil.toBuffer(packetData.signature)
       const res = ethUtil.fromRpcSig(msgBuf);




       const pubKey  = ethUtil.ecrecover(hashBuf, res.v, res.r, res.s);
       const addrBuf = ethUtil.pubToAddress(pubKey);
       const recoveredSignatureSigner    = ethUtil.bufferToHex(addrBuf);


       //make sure the signer is the depositor of the tokens
       return packetData.from.toLowerCase() == recoveredSignatureSigner.toLowerCase();

     }




  /*

  ethSigUtil.recoverTypedSignature: function (msgParams) {
   const msgHash = typedSignatureHash(msgParams.data)
   const publicKey = recoverPublicKey(msgHash, msgParams.sig)
   const sender = ethUtil.publicToAddress(publicKey)
   return ethUtil.bufferToHex(sender)
 }




 function typedSignatureHash(typedData) {
   const error = new Error('Expect argument to be non-empty array')
   if (typeof typedData !== 'object' || !typedData.length) throw error

   const data = typedData.map(function (e) {
     return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
   })
   const types = typedData.map(function (e) { return e.type })
   const schema = typedData.map(function (e) {
     if (!e.name) throw error
     return e.type + ' ' + e.name
   })



 console.log('schema',new Array(typedData.length).fill('string'),schema)
   console.log('schema subhash',ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema).toString('hex'))

   console.log('types',types, data)
   console.log('types subhash',ethAbi.soliditySHA3(types, data).toString('hex'))


   console.log("hash1", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   ))

   //need to hardcode the 0x64fcd ... into solidity !!
   console.log("hash2", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3',
       ethAbi.soliditySHA3(types, data)
     ]
   ))


   return ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   )
 }




  */



}
