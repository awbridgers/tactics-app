

const pgnString = (pgn:string):string=>{
  const iterator = pgn.indexOf('1.');
  return pgn.substr(iterator);
}


export default pgnString;