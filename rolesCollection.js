// So this is how I've implemented the structure the permissions and the roles defined in the task.

let result = [
/* 1 */
{
  "_id" : ObjectId("6329b5c2d163d4c72c098b0e"),
  "roleName" : "admin",
  "permissions" : [ 
      "create", 
      "update", 
      "delete", 
      "get",
      "patch"
  ]
},

/* 2 */
{
  "_id" : ObjectId("6329b5c2d163d4c72c098b0f"),
  "roleName" : "seller",
  "permissions" : [ 
      "create", 
      "update", 
      "get",
      "patch"
  ]
},

/* 3 */
{
  "_id" : ObjectId("6329b5f2d163d4c72c098b10"),
  "roleName" : "supporter",
  "permissions" : [ 
      "delete", 
      "get"
  ]
},

/* 4 */
{
  "_id" : ObjectId("6329b5f2d163d4c72c098b11"),
  "roleName" : "customer",
  "permissions" : [ 
      "get"
  ]
}

]