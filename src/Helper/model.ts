import { Response, Validator } from './path'

class ModelClass {
    constructor() { }

    /**
    * Create model of model class
    * @param schemaModel Eg: UserModel || OrderModel
    * @param data req.body
    * @param res
    */

    createModel = async (schemaModel: any, data: object) => {
        try {
            let value = new schemaModel(data);
            await value.save();
            return {
                success: true,
                value
            }
        }
        catch (err: any) {
            if (err.code === 11000)
                return {
                    success: false,
                    message: `${this.returnText(Object.keys(err.keyValue)[0])} already exists`
                }

            if (err.name === "ValidationError") {
                return {
                    success: false,
                    message: (err as Error).message
                }
            }
        }
    }

    /**
     * Validate model of model class
     @param data req.body
     @param validator // fields 
     @param res
     */
    validateModel = (data: object, options: Array<String>) => {
        try {
            Validator.CommonValidtor(...options).validateSync(data, { abortEarly: false, stripUnknown: true });
            return null
        }
        catch (err: any) {
            let splitVal = err?.errors![0].split(" ")[0]
            return err?.errors![0].replace(splitVal, Model.returnText(splitVal))
        }
    }

    returnText = (value: String) => {
        if (value) {
            return (value.charAt(0).toUpperCase() + value.slice(1)).replace("_", " ");
        }
    }
}

export const Model = new ModelClass();