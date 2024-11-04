import { Responder, Model, Request, Response, OrganizationModel, CommonMsg, Utils } from '../Helper/path'

class ControllerClass {
    constructor() { }

    createModel = async (req: Request, res: Response) => {
        let data: any = req.body;

        let validateErr = await Model.validateModel(data, ['node_id', 'node_name', 'node_type']);
        if (validateErr) return Responder.sentFailureMessage(validateErr, res);

        if (!data?.node_color) {
            let getParentColor = await OrganizationModel.findOne({ node_id: data.parent_id });
            data["node_color"] = getParentColor?.node_color
        }

        let createModel = await Model.createModel(OrganizationModel, data);
        if (createModel?.success) Responder.sentSuccessData(createModel?.value, CommonMsg.created, res);
        else Responder.sentFailureMessage(CommonMsg.create404, res);
    }

    getModel = async (req: Request, res: Response) => {
        let aggregate = [
            { $match: {} },
            await Utils.lookup("organizations", "node_id", "parent_id")
        ]
        let organization = await OrganizationModel.aggregate(aggregate);
        Responder.sentSuccessData(organization, CommonMsg.findModel, res);
    }

    updateModel = async (req: Request, res: Response) => {
        let nodeId = req.params.id;
        let data = req.body;

        let model = await OrganizationModel.findOne({ node_id: nodeId });
        if (!model) return Responder.sentFailureMessage(CommonMsg.findModel404, res);

        let parentModel = await OrganizationModel.findOne({ node_id: data?.parent_id });

        if (data?.updateAll) await this.updateAllModel(data, nodeId, parentModel, model);
        else await this.updateChildModel(data, nodeId, parentModel);

        Responder.sentSuccessMessage(CommonMsg.updateModel, res)
    }

    updateChildModel = async (data: any, nodeId: any, parentModel: any) => {
        data = {
            node_name: data?.node_name,
            parent_id: data?.parent_id,
            node_color: parentModel?.node_color
        }

        let updateModel = await OrganizationModel.findOneAndUpdate({ node_id: nodeId }, data, { new: true });
        let updChildModel = await OrganizationModel.updateMany({ parent_id: nodeId }, { node_color: updateModel?.node_color });
    }

    updateAllModel = async (data: any, nodeId: any, parentModel: any, model: any) => {
        data = {
            node_name: data?.node_name,
            parent_id: data?.parent_id,
            node_color: parentModel?.node_color
        }

        let findNextParForChild = await OrganizationModel.findOne({ node_id: model?.parent_id });
        let updChildModel = await OrganizationModel.updateMany({ parent_id: nodeId }, { node_color: findNextParForChild?.node_color, parent_id: findNextParForChild?.node_id }, { new: true });
        let updateModel = await OrganizationModel.findOneAndUpdate({ node_id: nodeId }, data, { new: true });
    }

    deleteModel = async (req: Request, res: Response) => {
        let nodeId = req.params.id;
        let data = req.body;

        let model = await OrganizationModel.findOne({ node_id: nodeId });
        if (!model) return Responder.sentFailureMessage(CommonMsg.findModel404, res);

        if (data?.deleteAll) await this.deleteAllModel(nodeId, res);
        else await this.deleteOneModel(nodeId, model);

        Responder.sentSuccessMessage(CommonMsg.deleteModel, res);
    }

    deleteAllModel = async (nodeId: any, res: Response) => {
        let deleteModel = await OrganizationModel.findOneAndDelete({ node_id: nodeId });
        if (!deleteModel) return Responder.sentFailureMessage(CommonMsg.deleteModel404, res);

        let deleteAllChild = await OrganizationModel.deleteMany({ parent_id: nodeId });
    }

    deleteOneModel = async (nodeId: any, model: any) => {
        let parentModel = await OrganizationModel.findOne({ node_id: model?.parent_id });

        let updateChildModel = await OrganizationModel.updateMany({ parent_id: nodeId }, { parent_id: parentModel?.node_id, node_color: parentModel?.node_color }, { new: true });
        let deleteParentModel = await OrganizationModel.deleteOne({ node_id: nodeId });
    }
}

export const Controller = new ControllerClass()