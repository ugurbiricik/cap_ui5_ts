namespace sap.ui5_app;

entity Products {
    key ID            : UUID;
    Name              : String(100);      
    Status            : String(50);       
    SupplierName      : String(100);    
    MainCategory      : String(100);      
    Category          : String(100);     
    Width             : Decimal(5, 2);    
    Height            : Decimal(5, 2);   
    WeightMeasure     : Decimal(5, 2);   
    ProductPicUrl     : String(5000); 
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