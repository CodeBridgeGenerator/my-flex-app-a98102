
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
firstName: faker.name.firstName(),
lastName: faker.name.lastName(),
email: faker.internet.email(),
phoneNumber: faker.phone.number(""),
address: faker.lorem.sentence(1),
joinDate: faker.lorem.sentence(1),
loyaltyPoints: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
