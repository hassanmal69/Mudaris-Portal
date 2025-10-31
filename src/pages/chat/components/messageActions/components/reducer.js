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
};

function __reducer_local(state, action) {
  switch (action.type) {
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
};
