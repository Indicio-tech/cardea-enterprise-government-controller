const sendAdminMessage = require('./transport')

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Create an invitation request message to be sent to the Cloud Agent Adminstration API
const createInvitation = async (
  alias = 'Single-Use Invitation',
  autoAccept = false,
  multiUse = false,
  public = false,
) => {
  try {
    console.log('Generating Invitation')

    const invitationMessage = await sendAdminMessage(
      'post',
      `/connections/create-invitation`,
      {
        alias,
        auto_accept: autoAccept,
        multi_use: multiUse,
        public,
      },
      {},
    )

    return invitationMessage
  } catch (error) {
    console.error('Invitation Creation Error')
    throw error
  }
}

// Fetch a Connection request message to be sent to the Cloud Agent Adminstration API
const fetchConnection = async (connectionID) => {
  try {
    console.log(`Fetching a Connection with connectionID: ${connectionID}`)

    const connection = await sendAdminMessage(
      'get',
      `/connections/${connectionID}`,
      {},
      {},
    )

    return connection
  } catch (error) {
    if (error.response.status === 404) {
      console.log('No Connection Found')

      return null
    }

    console.error('Error Fetching Connection')
    throw error
  }
}

// Query Connection requests message to be sent to the Cloud Agent Adminstration API
const queryConnections = async (
  initiator = 'self',
  state = 'active',
  alias,
  invitationKey = null,
  myDID = null,
  theirDID = null,
  theirRole = null,
) => {
  try {
    console.log(
      `Fetching Connections with the parameters:`,
      alias,
      initiator,
      invitationKey,
      myDID,
      state,
      theirDID,
      theirRole,
    )

    const connections = await sendAdminMessage(
      'get',
      `/connections`,
      {
        alias: alias,
        initiator: initiator,
        invitation_key: invitationKey,
        my_did: myDID,
        state: state,
        their_did: theirDID,
        their_role: theirRole,
      },
      {},
    )

    return connections
  } catch (error) {
    if (error.response.status === 404) {
      console.log('No Connections Found')

      return null
    }

    console.error('Error Fetching Connections')
    throw error
  }
}

const sendBasicMessage = async (connectionID, body) => {
  console.log(`Sending Basic Message to Connection: ${connectionID}`)
  console.log('With Body:')
  console.log(body)
  try {
    const response = await sendAdminMessage(
      'post',
      `/connections/${connectionID}/send-message`,
      {},
      body,
    )

    return response
  } catch (error) {
    console.error('Error Sending Basic Message')
    throw error
  }
}

module.exports = {
  createInvitation,
  fetchConnection,
  queryConnections,
  sendBasicMessage,
}
