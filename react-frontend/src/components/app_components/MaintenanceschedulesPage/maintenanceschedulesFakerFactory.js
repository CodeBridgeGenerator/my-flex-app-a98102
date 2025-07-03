
import { faker } from "@faker-js/faker";
export default (user,count,vehicleIdIds,serviceIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
vehicleId: vehicleIdIds[i % vehicleIdIds.length],
serviceId: serviceIdIds[i % serviceIdIds.length],
nextServiceDate: faker.lorem.sentence(1),
notes: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
