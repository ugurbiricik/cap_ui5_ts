namespace sap.ui5_app;

entity Products {
  key ID : UUID;
  name  : String(100);
  price : Decimal(10, 2);
  description : String(255);
  image : String(5000);
}


entity Users {
    key ID : UUID;
    username : String(100);
    password : String(100);
    email : String(100);
    role : String(50);
}

entity Cart {
    key ID          : UUID;
    userID          : Association to Users;
    productID       : Association to Products;
    quantity        : Integer;
    totalPrice      : Decimal(10, 2);
}