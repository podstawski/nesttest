"use strict";
exports.__esModule = true;
exports.Model = void 0;
var Model = function (model) {
    return function (destinationClass) {
        console.log(destinationClass, model);
        /*

            chciałbym, aby ten decorator docelowej klasie dodał wiele metod,
            to trochę tak, jakbym chciał zapisać

            class UserModel extends Model

        */
    };
};
exports.Model = Model;
