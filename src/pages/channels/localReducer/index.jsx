const CHANNEL_PAGE_SIZE = 10;

const channel_initialState = {
  page: 0,
  hasMore: true,
  dialogOpen: false,
  editDialogOpen: false,
  selectedItem: null,
  initialLoaded: false,
};

function local_channel_reducer(local_channel_state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...local_channel_state,
        page: action.payload,
      };
    case "SET_HAS_MORE":
      return {
        ...local_channel_state,
        hasMore: action.payload,
      };
    case "SELECT_ITEM":
      return {
        ...local_channel_state,
        selectedItem: action.payload,
        editDialogOpen: true,
      };
    case "OPEN_DIALOG":
      return {
        ...local_channel_state,
        dialogOpen: true,
      };
    case "CLOSE_DIALOGS":
      return {
        ...local_channel_state,
        dialogOpen: false,
        editDialogOpen: false,
        selectedItem: null,
      };

    case "INITIAL_LOADED":
      return {
        ...local_channel_state,
        initialLoaded: true,
      };

    default:
      return local_channel_state;
  }
}

export { channel_initialState, CHANNEL_PAGE_SIZE, local_channel_reducer };
