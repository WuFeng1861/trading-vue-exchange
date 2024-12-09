export const clearStorage = () => {
  let accountKeep = localStorage["accountKeep"];
  localStorage.clear();
  if(accountKeep) {
    localStorage["accountKeep"] = accountKeep;
  }
};
