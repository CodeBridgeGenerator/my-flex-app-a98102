
import { faker } from "@faker-js/faker";
export default (user,count,customerIdIds,vehicleIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerId: customerIdIds[i % customerIdIds.length],
vehicleId: vehicleIdIds[i % vehicleIdIds.length],
serviceDate: faker.lorem.sentence(1),
totalAmount: faker.lorem.sentence(1),
paymentStatus: faker.lorem.sentence(1),
paymentMethod: "Cash",
notes: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
