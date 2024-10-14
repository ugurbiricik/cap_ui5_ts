using { sap.ui5_app as db } from '../db/schema';

service ProductService {
  entity Products as projection on db.Products;
  entity Users as projection on db.Users;
  entity Cart as projection on db.Cart;

  action addToCart(userID: UUID, productID: UUID, quantity: Integer) returns Boolean;
  action removeFromCart(userID: UUID, productID: UUID) returns Boolean;
  action updateCart(userID: UUID, productID: UUID, quantity: Integer) returns Boolean;

  @readonly
  action login(username : String, password : String) returns Boolean;
  action register(username : String, password : String, email : String, firstName : String, lastName : String) returns Boolean;
}