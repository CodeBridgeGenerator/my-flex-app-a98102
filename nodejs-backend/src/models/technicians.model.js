
    module.exports = function (app) {
        const modelName = 'technicians';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            firstName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
lastName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
email: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
phoneNumber: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
specialization: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },

            
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