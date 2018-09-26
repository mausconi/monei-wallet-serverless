import {web3} from '../services/etherium';

export default async function(data) {
  // checks transaction receipt form the blockchain
  const receipt = await web3.eth.getTransactionReceipt(data.transactionHash);

  // if no receipt (transaction is not mined yet) retry with the delay
  if (!receipt) {
    return data;
  }

  // forward to the next step
  data.status = 'completed';
  return data;
}
