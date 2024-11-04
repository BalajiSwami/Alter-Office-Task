import mongoose from "mongoose";
import { Schema, Document } from "../Helper/path";

interface ISchema extends Document {
    node_id: string,
    node_name: string,
    node_type: string,
    node_color: string,
    parent_id: string
}

let option = {
    versionKey: false,
    timestamps: true
}

let schema = new Schema<ISchema>({
    node_id: String,
    node_name: String,
    node_color: String,
    node_type: String,
    parent_id: String
}, option);

let OrganizationModel = mongoose.model('organization', schema);

export { OrganizationModel }