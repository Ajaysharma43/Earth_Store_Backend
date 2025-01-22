function shuffle(array, User) {
    let Backup = [...array];
    let filteredArray = Backup.filter(item => item._id !== User._id);
  
    let currentIndex = filteredArray.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [filteredArray[currentIndex], filteredArray[randomIndex]] = [
        filteredArray[randomIndex],
        filteredArray[currentIndex]
      ];
    }
  
    let result = filteredArray.slice(0, 3);
    return result;
  }
  
  module.exports = shuffle;
  