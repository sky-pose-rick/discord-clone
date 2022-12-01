import FirebaseAuthUser from './FirebaseAuthUser';
import modalService from './modalService';
import FirestoreUser from './FirestoreUser';

const createModal = modalService.useModal();

function signOutModal(after) {
  createModal([
    {
      type: 'label',
      label: 'Signout?',
      placeholder: 'none',
    },
    {
      type: 'label',
      label: 'Confirm',
      placeholder: 'none',
    },
  ], 'Yes', () => {
    FirebaseAuthUser.logoutUser();
    if (after) {
      after();
    }
  });
}

function editServerModal(currentServer, after) {
  createModal([
    {
      type: 'label',
      label: 'Edit Server',
      placeholder: 'none',
    },
    {
      type: 'text',
      label: 'Name',
      placeholder: currentServer.serverName,
    },
    {
      type: 'file',
      label: 'Icon',
      placeholder: '',
    },
  ], 'Save', () => {
    if (after) {
      after();
    }
  });
}

function deleteServerModal(currentServer, after) {
  createModal([
    {
      type: 'label',
      label: 'Delete Server?',
      placeholder: 'none',
    },
  ], 'Confirm', () => {
    if (after) {
      after();
    }
  });
}

function editChannelModal(currentChannel, after) {
  createModal([
    {
      type: 'label',
      label: 'Edit Channel',
      placeholder: 'none',
    },
    {
      type: 'text',
      label: 'Name',
      placeholder: currentChannel.channelName,
    },
    {
      type: 'text',
      label: 'Description',
      placeholder: currentChannel.channelDesc,
    },
    {
      type: 'textarea',
      label: 'Root Message',
      placeholder: 'need to fetch channel root',
    },
  ], 'Save', () => {
    if (after) {
      after();
    }
  });
}

function deleteChannelModal(currentChannel, after) {
  createModal([
    {
      type: 'label',
      label: 'Delete Channel?',
      placeholder: 'none',
    },
  ], 'Confirm', () => {
    if (after) {
      after();
    }
  });
}

function createChannelModal(currentServer, after) {
  createModal([
    {
      type: 'label',
      label: 'Create Channel',
      placeholder: 'none',
    },
    {
      type: 'text',
      label: 'Name',
      placeholder: 'New Channel',
    },
    {
      type: 'text',
      label: 'Description',
      placeholder: 'A new channel',
    },
    {
      type: 'textarea',
      label: 'Root Message',
      placeholder: 'Welcome to the new channel',
    },
  ], 'Create', () => {
    if (after) {
      after();
    }
  });
}

function createServerModal(currentUser, changeToServer) {
  createModal([
    {
      type: 'label',
      label: 'Create Server',
      placeholder: 'none',
    },
    {
      type: 'text',
      label: 'Name',
      placeholder: 'new-server',
    },
    {
      type: 'file',
      label: 'Icon',
      placeholder: '',
    },
  ], 'Create', async (inputValues) => {
    const newServer = await FirestoreUser.createNewServer(
      currentUser,
      inputValues[1],
      inputValues[2],
    );
    if (changeToServer) {
      changeToServer(newServer.serverKey, newServer.channelKey);
    }
  });
}

export default {
  signOutModal,
  editServerModal,
  deleteServerModal,
  editChannelModal,
  deleteChannelModal,
  createChannelModal,
  createServerModal,
};
