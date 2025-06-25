export default class CustomerDataset {
    constructor(name, sourceType, sourcePath, fileType, user, aiModel, status = null) {
        this.name = name;
        this.sourceType = sourceType;
        this.sourcePath = sourcePath;
        this.fileType = fileType;
        this.user = user;
        this.aiModel = aiModel;
        this.status = status;
    }
}
