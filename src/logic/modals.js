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
  ], 'Confirm', async () => {
    await FirestoreUser.deleteServer(currentServer.serverKey);
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

async function deleteChannelModal(currentChannel, channels, changeToChannel) {
  createModal([
    {
      type: 'label',
      label: 'Delete Channel?',
      placeholder: 'none',
    },
    {
      type: 'label',
      label: 'Note: The last channel cannot be deleted.',
      placeholder: 'none',
    },
  ], 'Confirm', () => {
    if (channels.length > 1) {
      const nextChannelKey = (channels[0].channelKey === currentChannel.channelKey)
        ? channels[1].channelKey : channels[0].channelKey;

      FirestoreUser.deleteChannel(currentChannel.serverKey, currentChannel.channelKey);

      if (changeToChannel) {
        changeToChannel(currentChannel.serverKey, nextChannelKey);
      }
    } else {
      console.error('Cannot delete last channel in server');
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

function deleteMessageModal(currentChannel, message, after) {
  createModal([
    {
      type: 'label',
      label: 'Delete Message?',
      placeholder: 'none',
    },
    {
      type: 'label',
      label: `${message.user}: ${message.content}`,
      placeholder: 'none',
    },
  ], 'Confirm', () => {
    FirestoreUser.deleteMessage(
      currentChannel.serverKey,
      currentChannel.channelKey,
      message.messageKey,
    );
    if (after) {
      after();
    }
  });
}

function leaveServerModal(currentServer, currentUser, after) {
  createModal([
    {
      type: 'label',
      label: 'Leave Server?',
      placeholder: 'none',
    },
  ], 'Confirm', async () => {
    if (currentServer.owner === currentUser.uid) {
      console.error('Owner cannot leave their own server');
    } else {
      await FirestoreUser.leaveServer(currentServer.serverKey, currentUser.uid);
      if (after) {
        after();
      }
    }
  });
}

function editUserModal(user, after) {
  createModal([
    {
      type: 'label',
      label: 'Edit Profile',
      placeholder: 'none',
    },
    {
      type: 'text',
      label: 'Name',
      placeholder: user.displayName,
    },
    {
      type: 'file',
      label: 'Change Icon?',
      placeholder: '',
    },
  ], 'Save', (inputValues) => {
    FirestoreUser.updateUser(user.uid, inputValues[1], inputValues[2]);
    if (after) {
      after();
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
  deleteMessageModal,
  leaveServerModal,
  editUserModal,
};
