
    module.exports = function (app) {
        const modelName = 'customers';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            firstName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
lastName: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
email: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
phoneNumber: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
address: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
joinDate: { type: Number, required: false, min: 0, max: 10000000 },
loyaltyPoints: { type: Number, required: false, min: 0, max: 10000000 },

            
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