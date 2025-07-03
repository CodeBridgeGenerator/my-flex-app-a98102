
    module.exports = function (app) {
        const modelName = 'invoices';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            customerId: { type: Schema.Types.ObjectId, ref: "customers" },
vehicleId: { type: Schema.Types.ObjectId, ref: "vehicles" },
serviceDate: { type: Date, required: false },
totalAmount: { type: Number, required: false, min: 0, max: 10000000 },
paymentStatus: { type: Boolean, required: false, default: false },
paymentMethod: { type: String, required: false , enum: ["Online Payment","Cash"] },
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