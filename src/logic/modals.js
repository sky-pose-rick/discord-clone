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
      label: 'Change Icon?',
      placeholder: '',
    },
  ], 'Save', (inputValues) => {
    FirestoreUser.updateServer(currentServer.serverKey, inputValues[1], inputValues[2]);
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
      placeholder: currentChannel.channelRoot,
    },
  ], 'Save', async (inputValues) => {
    const newName = inputValues[1];
    const newDesc = inputValues[2];
    const newRoot = inputValues[3];

    FirestoreUser.updateChannel(
      currentChannel.serverKey,
      currentChannel.channelKey,
      newName,
      newDesc,
      newRoot,
    );

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

function createChannelModal(currentServer, changeToChannel) {
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
  ], 'Create', async (inputValues) => {
    const newName = inputValues[1];
    const newDesc = inputValues[2];
    const newRoot = inputValues[3];

    const channelKey = await FirestoreUser.createNewChannel(
      currentServer.serverKey,
      newName,
      newDesc,
      newRoot,
    );

    if (changeToChannel) {
      changeToChannel(currentServer.serverKey, channelKey);
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
