export const LOAD_ALL_CHATROOMS = "LOAD_ALL_CHATROOMS";
export const LOAD_ID_CHATROOM = "LOAD_ID_CHATROOM";
export const LOAD_MESSAGES = "LOAD_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const MODIFY_MESSAGE = "MODIFY_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export const UNLOAD = "UNLOAD";

export const loadAllChatRooms = (chatRooms) => ({
  type: LOAD_ALL_CHATROOMS,
  payload: chatRooms,
});

export const loadIdChatRoom = (chatRoom) => ({
  type: LOAD_ID_CHATROOM,
  payload: chatRoom,
});

export const loadMessages = (messages) => ({
  type: LOAD_MESSAGES,
  payload: messages,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const modifyMessage = (index, message) => ({
  type: MODIFY_MESSAGE,
  payload: { index, message },
});

export const removeMessage = (index, message) => ({
  type: REMOVE_MESSAGE,
  payload: { index, message },
});

export const unLoad = () => ({
  type: UNLOAD,
});

const initialState = {
  allChatRooms: null,
  currentChatRoom: null,
  messages: [],
};

const chat = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_CHATROOMS:
      return {
        ...state,
        allChatRooms: action.payload,
      };
    case LOAD_ID_CHATROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };

    case LOAD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      };

    case MODIFY_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((message, index) => {
          if (index === action.payload.index) {
            return action.payload.message;
          }
          return message;
        }),
      };

    case REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.uid !== action.payload.message.uid
        ),
      };
    case UNLOAD:
      return {
        ...state,
        currentChatRoom: null,
        messages: null,
      };
    default:
      return state;
  }
};

export default chat;
