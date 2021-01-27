
class ValidationError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = message; // (2)
    }
}
testReg = function(pattern, value) {
    const regexp = RegExp(pattern);
    return regexp.test(value);
}
testAr = function(value){
    const pattern = "^[\u0621-\u064A ]+$"
    if(!testReg(pattern, value))
    throw new ValidationError('يجب ان يكون الاسم باللغة العربية')
}
customTest = function(value, pattern){
    if (!testReg(pattern, value)) {
        throw new ValidationError('يرجي ادخال بيانات صحيحه')
    }
}

module.exports = {
    testAr,
    customTest,
    ValidationError
}

//   try {
//     test();
//   } catch(err) {
//     alert(err.message); // Whoops!
//     alert(err.name); // ValidationError
//     alert(err.stack); // a list of nested calls with line numbers for each
//   }