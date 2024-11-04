import * as validate from 'yup'

class ValidateClass {
    constructor() { }

    CommonValidtor = (...options: Array<String>) => {
        let returnVal: any = {};
        options.map((item, i) => {
            returnVal[item.toString()] = validate.string().required()
        })
        return validate.object(returnVal).required();
    }
}

export const Validator = new ValidateClass()