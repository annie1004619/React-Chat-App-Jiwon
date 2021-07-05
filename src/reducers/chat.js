export const LOAD_ALL_CHATROOMS = "LOAD_ALL_CHATROOMS";
export const LOAD_ID_CHATROOM = "LOAD_ID_CHATROOM";
export const UPDATE_CHATROOMS = "UPDATE_CHATROOMS";
export const REMOVE_CHATROOMS = "REMOVE_CHATROOMS";

export const LOAD_MESSAGES = "LOAD_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const MODIFY_MESSAGE = "MODIFY_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";

export const SET_PARTICIPANTS = "SET_PARTICIPANTS";
export const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";
export const UPDATE_PARTICIPANTS = "UPDATE_PARTICIPANTS";
export const REMOVE_PARTICIPANTS = "REMOVE_PARTICIPANTS";

export const UNLOAD = "UNLOAD";

export const loadAllChatRooms = (chatRooms) => ({
  type: LOAD_ALL_CHATROOMS,
  payload: chatRooms,
});
export const loadIdChatRoom = (chatRoom) => ({
  type: LOAD_ID_CHATROOM,
  payload: chatRoom,
});
export const updateChatRooms = (chatRoom) => ({
  type: UPDATE_CHATROOMS,
  payload: chatRoom,
});
export const removeChatRooms = (chatRoom) => ({
  type: REMOVE_CHATROOMS,
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

export const setParticipants = (list) => ({
  type: SET_PARTICIPANTS,
  payload: list,
});
export const addParticipants = (participant) => ({
  type: ADD_PARTICIPANTS,
  payload: participant,
});
export const updateParticipants = (uid, participant) => ({
  type: UPDATE_PARTICIPANTS,
  payload: { uid, participant },
});
export const removeParticipants = (participant) => ({
  type: REMOVE_PARTICIPANTS,
  payload: participant,
});

export const unLoad = () => ({
  type: UNLOAD,
});

const initialState = {
  list: [],
  allChatRooms: null,
  currentChatRoom: null,
  messages: [],
  participants: [],
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
    case UPDATE_CHATROOMS:
      return {
        ...state,
        allChatRooms: state.allChatRooms.map((chatRoom) => {
          if (chatRoom.id === action.payload.id) {
            return action.payload;
          }
          return chatRoom;
        }),
      };
    case REMOVE_CHATROOMS:
      return {
        ...state,
        allChatRooms: state.allChatRooms.filter(
          (chatRoom) => chatRoom.id !== action.payload.id
        ),
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

    case SET_PARTICIPANTS:
      return {
        ...state,
        participants: action.payload,
      };
    case ADD_PARTICIPANTS:
      return {
        ...state,
        participants: state.participants.concat(action.payload),
      };
    case UPDATE_PARTICIPANTS:
      return {
        ...state,
        participants: state.participants.map((participant) => {
          if (participant.uid === action.payload.participant.uid) {
            return action.payload.participant;
          }
          return participant;
        }),
      };

    case REMOVE_PARTICIPANTS:
      return {
        ...state,
        participants: state.participants.filter(
          (participant) => participant.uid !== action.payload.uid
        ),
      };

    case UNLOAD:
      return {
        ...state,
        currentChatRoom: null,
        messages: null,
        participants: [],
      };
    default:
      return state;
  }
};

export default chat;
