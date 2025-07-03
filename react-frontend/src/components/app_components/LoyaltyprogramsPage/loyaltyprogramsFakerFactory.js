
import { faker } from "@faker-js/faker";
export default (user,count,supplierIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
partId: faker.lorem.sentence(1),
partName: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
quantityInStock: faker.lorem.sentence(1),
price: faker.lorem.sentence(1),
supplierId: supplierIdIds[i % supplierIdIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
