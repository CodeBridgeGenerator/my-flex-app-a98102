
import { faker } from "@faker-js/faker";
export default (user,count,vehicleIdIds,serviceRecordIdIds,technicianIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
vehicleId: vehicleIdIds[i % vehicleIdIds.length],
serviceRecordId: serviceRecordIdIds[i % serviceRecordIdIds.length],
oilType: faker.lorem.sentence(1),
mileage: faker.lorem.sentence(1),
technicianId: technicianIdIds[i % technicianIdIds.length],
dateOfChange: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
