/**
 * Local reducer
 * @param {boolean} showDeleteDialog - User input from signup form.
 * @param {string} selectedMessageId
 * @param {boolean} showDeleteSuccess
 */

const initialState = {
  showDeleteDialog: false,
  selectedMessageId: null,
  showDeleteSuccess: false,

  showForwardDialog: false,
  showForwardSuccess: false,

  // deleteError: null, // 🆕
};

function __reducer_local(state, action) {
  switch (action.type) {
    // --- existing delete logic ---
    case CASES.OPEN_DELETE_DIALOG:
      return {
        ...state,
        showDeleteDialog: true,
        selectedMessageId: action.payload,
      };
    case CASES.SHOW_DELETE_SUCCESS:
      return { ...state, showDeleteSuccess: true };
    case CASES.CLOSE_DELETE_DIALOG:
      return { ...state, showDeleteDialog: false, selectedMessageId: null };
    case CASES.HIDE_DELETE_SUCCESS:
      return { ...state, showDeleteSuccess: false };
    // case CASES.DELETE_FAILED:
    //   return {
    //     ...state,
    //     deleteError: "You cannot delete this message.",
    //   };

    // case CASES.CLEAR_DELETE_ERROR:
    //   return {
    //     ...state,
    //     deleteError: null,
    //   };

    // --- 🆕 new forward logic ---
    case CASES.OPEN_FORWARD_DIALOG:
      return {
        ...state,
        showForwardDialog: true,
        selectedMessageId: action.payload,
      };
    case CASES.SHOW_FORWARD_SUCCESS:
      return { ...state, showForwardSuccess: true };
    case CASES.CLOSE_FORWARD_DIALOG:
      return { ...state, showForwardDialog: false, selectedMessageId: null };
    case CASES.HIDE_FORWARD_SUCCESS:
      return { ...state, showForwardSuccess: false };

    default:
      return state;
  }
}

export { initialState, __reducer_local };

const CASES = {
  SHOW_DELETE_SUCCESS: "SHOW_DELETE_SUCCESS",
  OPEN_DELETE_DIALOG: "OPEN_DELETE_DIALOG",
  CLOSE_DELETE_DIALOG: "CLOSE_DELETE_DIALOG",
  HIDE_DELETE_SUCCESS: "HIDE_DELETE_SUCCESS",

  // 🆕 forward message
  SHOW_FORWARD_SUCCESS: "SHOW_FORWARD_SUCCESS",
  OPEN_FORWARD_DIALOG: "OPEN_FORWARD_DIALOG",
  CLOSE_FORWARD_DIALOG: "CLOSE_FORWARD_DIALOG",
  HIDE_FORWARD_SUCCESS: "HIDE_FORWARD_SUCCESS",
};
