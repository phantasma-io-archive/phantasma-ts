export interface Receipt {
  nexus: string; //Name of nexus
  channel: string; //Name of channel
  index: string; //Index of message
  timestamp: number; //Date of message
  sender: string; //Sender address
  receiver: string; //Receiver address
  script: string; //Script of message, in hex
}
