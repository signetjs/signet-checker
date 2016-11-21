var signetChecker = (function () {
    'use strict';
    
    return function (registrar) {

        function checkType (typeDef){
            return typeof registrar.get(typeDef.type) === 'function';
        }

        function concat (resultList, list){
            return resultList.concat(list);
        }

        function not (predicate){
            return function (value){
                return !predicate(value);
            }
        }

        function checkSignature (ast){
            var failedTypes =  ast.reduce(concat, [])
                                  .filter(not(checkType));

            return failedTypes.length > 0 ? failedTypes : null;
        }

        return {
            checkSignature: checkSignature,
            checkType: checkType
        };

    }

})();

module.exports = signetChecker;