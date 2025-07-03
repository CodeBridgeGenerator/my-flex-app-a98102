
import { faker } from "@faker-js/faker";
export default (user,count,customerIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerId: customerIdIds[i % customerIdIds.length],
make: faker.lorem.sentence(""),
model: faker.lorem.sentence(""),
year: faker.lorem.sentence(""),
licensePlate: faker.lorem.sentence(""),
vin: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
