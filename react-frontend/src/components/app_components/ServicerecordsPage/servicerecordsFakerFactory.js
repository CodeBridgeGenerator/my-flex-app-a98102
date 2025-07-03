
import { faker } from "@faker-js/faker";
export default (user,count,invoiceIdIds,serviceIdIds,vehicleIdIds,technicianIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
invoiceId: invoiceIdIds[i % invoiceIdIds.length],
serviceId: serviceIdIds[i % serviceIdIds.length],
vehicleId: vehicleIdIds[i % vehicleIdIds.length],
technicianId: technicianIdIds[i % technicianIdIds.length],
serviceDate: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
