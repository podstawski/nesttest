import {CloudDatastoreService} from "./cloud-datastore.service";

export const Model = (model: string) => {

    return (destinationClass) => {
        console.log(destinationClass, model);
        /*

            chciałbym, aby ten decorator docelowej klasie dodał wiele metod,
            to trochę tak, jakbym chciał zapisać

            class UserModel extends Model

        */

    }

}

