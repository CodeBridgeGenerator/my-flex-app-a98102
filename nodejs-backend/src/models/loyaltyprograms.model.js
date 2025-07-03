
    module.exports = function (app) {
        const modelName = 'loyaltyprograms';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            partId: { type: Number, required: false, min: 0, max: 10000000 },
partName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
description: { type:  [Schema.Types.ObjectId], ref: "document_storages" , minLength: 2, maxLength: 1000, index: true, trim: true },
quantityInStock: { type: Number, required: false, min: 0, max: 10000000 },
price: { type: Number, required: false, min: 0, max: 10000000 },
supplierId: { type: Schema.Types.ObjectId, ref: "suppliers" },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };