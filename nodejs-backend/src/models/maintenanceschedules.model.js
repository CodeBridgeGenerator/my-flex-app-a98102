
    module.exports = function (app) {
        const modelName = 'maintenanceschedules';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles" },
serviceId: { type: Schema.Types.ObjectId, ref: "services" },
nextServiceDate: { type: Date, required: false },
notes: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },

            
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