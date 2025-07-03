
    module.exports = function (app) {
        const modelName = 'servicerecords';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            invoiceId: { type: Schema.Types.ObjectId, ref: "invoices" },
serviceId: { type: Schema.Types.ObjectId, ref: "services" },
vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles" },
technicianId: { type: Schema.Types.ObjectId, ref: "technicians" },
serviceDate: { type: Date, required: false },

            
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