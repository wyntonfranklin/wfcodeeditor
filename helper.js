module.exports = {
  removeFromArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {

        arr.splice(i, 1);
      }

    }
  },
  exitsInArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {
        return true;
      }
    }
    return false;
  }
}
