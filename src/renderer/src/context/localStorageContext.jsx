import { createContext, useContext, useState } from "react";

const StorageContext = createContext();

export const useStorage = () => useContext(StorageContext);

export const StorageProvider = ({ children }) => {
  const [savedPlayers, setSavedPlayers] = useState(localStorage.getItem('savedPlayers') ? JSON.parse(localStorage.getItem('savedPlayers')) : {}); // {mac:room, mac:room...} 
  const [roomList, setRoomList] = useState(localStorage.getItem('roomList') ? JSON.parse(localStorage.getItem('roomList')) : ["Unassigned", "Lobby"]);


  const saveRoomList = (room) => {
    // make sure the room is not already in the list
    if (!roomList.includes(room)) {
      setRoomList(roomList => [...roomList, room]);
      localStorage.setItem('roomList', JSON.stringify([...roomList, room]));
    }
  }

  const removeRoomFromList = (room) => {
    setRoomList(roomList => roomList.filter(item => item !== room));
    localStorage.setItem('roomList', JSON.stringify(roomList.filter(item => item !== room)));
  }

  const saveRoomForMac = (mac, room) => {
    setSavedPlayers(savedPlayers => ({ ...savedPlayers, [mac]: room }));
    localStorage.setItem('savedPlayers', JSON.stringify({ ...savedPlayers, [mac]: room }));
  }



  const checkRoomForMac = (mac) => {
    if (savedPlayers[mac]) {
      return savedPlayers[mac];
    } else {
      return "Unassigned";
    }
  }
  const value = {
    savedPlayers,
    saveRoomForMac,
    roomList,
    saveRoomList,
    checkRoomForMac,
    removeRoomFromList
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};