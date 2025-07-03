
    module.exports = function (app) {
        const modelName = 'oilchangerecords';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles" },
serviceRecordId: { type: Schema.Types.ObjectId, ref: "servicerecords" },
oilType: { type:  String , minLength: 2, maxLength: 1000, index: true, trim: true },
mileage: { type: Number, required: false, min: 0, max: 10000000 },
technicianId: { type: Schema.Types.ObjectId, ref: "technicians" },
dateOfChange: { type: Date, required: false },

            
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