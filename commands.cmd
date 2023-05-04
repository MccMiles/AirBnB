//FRONTEND
npm install js-cookie react-redux react-router-dom@^5 redux redux-thunk
npm install -D redux-logger
npm --prefix backend install backend && npm --prefix frontend install frontend
npm run build --prefix frontend

new Render scripts
npm install && npm run render-postbuild && npm run build && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all





//BACKEND
npx sequelize-cli model:generate --name spotImage --attributes spotId:integer,url:string,previewImage:boolean

npx sequelize-cli model:generate --name reviewImage --attributes reviewId:integer,url:string

npx sequelize-cli model:generate --name spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:float,lng:float,name:string,description:string,price:integer

npx sequelize-cli model:generate --name review --attributes userId:integer,spotId:integer,review:string,stars:integer

npx sequelize-cli model:generate --name booking --attributes spotId:integer,userId:integer,startDate:date,endDate:DATE

npx sequelize-cli model:generate --name user --attributes firstName:string,lastName:string,email:string,username:string,password:string


// Define the associations in the User model
User.hasMany(Booking, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

// Define the associations in the Booking model
Booking.belongsTo(User, { foreignKey: 'userId' });

// Define the associations in the Review model
Review.belongsTo(User, { foreignKey: 'userId' });

npx sequelize-cli seed:generate --name spots-seeders//
npx sequelize-cli seed:generate --name booking-seeders//
npx sequelize-cli seed:generate --name demo-reviewImages//
npx sequelize-cli seed:generate --name demo-spotImages//
npx sequelize-cli seed:generate --name review-seeders//

npx dotenv sequelize-cli db:seed:all
npx dotenv sequelize db:seed:all
npx dotenv sequelize db:migrate
npx dotenv sequelize-cli db:migrate:status





