
    module.exports = function (app) {
        const modelName = 'vehicles';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            customerId: { type: Schema.Types.ObjectId, ref: "customers" },
make: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
model: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
year: { type: Number, required: false, min: 0, max: 10000000 },
licensePlate: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
vin: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },

            
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