function getRandomIndexOfArray(length) {
    return Math.round(Math.random() * (length - 1));
};

function getRandomInteger(min = 0, max = 100) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

function getRandomName(names){
    return names[getRandomIndexOfArray(names.length)]
}