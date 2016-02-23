/**
 * Created by ChristianFernando on 12/26/2015.
 */
var mysql = require('mysql'),
  connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'auction-app-bd'
    }
  );
var async = require('async');
var items =[
  {idItem:1,cant:30},
  {idItem:2,cant:18},
  {idItem:3,cant:1}
]

var userModel = {};

userModel.getUsers = function(callback) {
  if (connection) {
    connection.query('SELECT * FROM users ORDER BY id', function(error, rows) {
      if(error) {
        throw error;
      }
      else {
        callback(null, rows);
      }
    });
  }
}

userModel.getUser = function(id,callback) {
  if (connection) {
    var sql = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
    connection.query(sql, function(error, row) {
      if(error) {
        throw error;
      }
      else {
        callback(null, row[0]);
      }
    });
  }
}

userModel.getInventory = function(id,callback) {
  if (connection) {
    var sql = 'SELECT * FROM inventory,items WHERE id_user = ' + connection.escape(id) + ' AND cant > 0 AND idItem = items.id '
    connection.query(sql, function(error, row) {
      if(error) {
        throw error;
      }
      else {
        callback(null, row);
      }
    });
  }
}

userModel.getUserByUserName = function(userName,callback) {
  if (connection) {
    var sql = 'SELECT * FROM users WHERE username = ' + connection.escape(userName);
    connection.query(sql, function(error, row) {
      if(error) {
        throw error;
      }
      else {
        callback(null, row);
      }
    });
  }
}

userModel.insertUser = function(userData,callback) {
  if (connection) {
    connection.query('INSERT INTO users SET ?', userData, function(error, result) {
      if(error) return callback(error);

      async.each(items, function (item,callback ) {
        connection.query('INSERT INTO inventory SET ?', {id_user:result.insertId,idItem:item.idItem, cant:item.cant}, function(err, result) {
          if(err){
            callback(err);
          }
          else{
            console.log('2',item);
            callback();
          }
        });

      }, function (err) {
        if(err) return callback(err);
        //devolvemos la última id insertada
        return callback(null,{"insertId" : result.insertId});
      });

    });
  }
}

userModel.updateUser = function(auctionData, callback) {
  if(!auctionData.idBettor) return  callback('SERVER_ERROR');

  if (connection) {
    var sql = 'SELECT coins, cant FROM users,inventory WHERE users.id = ' + connection.escape(auctionData.idSeller)
      + ' AND inventory.id_user = ' + connection.escape(auctionData.idSeller)
      + ' AND inventory.idItem = ' + connection.escape(auctionData.idItem);
    connection.query(sql, function (error, sellerRow) {
      if (error) {
        throw error;
      }
      else {
        async.series([
            function (callback) {
              var sql = 'UPDATE users SET coins = ' + connection.escape(sellerRow[0].coins + auctionData.winBid) +
                ' WHERE id = ' + auctionData.idSeller;

              connection.query(sql, function (error, result) {
                if (error) {
                  throw error;
                } else {
                  callback(null, {"msg": "success"});
                }
              });
            },
            function (callback) {
              var sql = 'UPDATE inventory SET cant = ' + connection.escape(sellerRow[0].cant - auctionData.cant) +
                ' WHERE idItem = ' + auctionData.idItem + ' AND id_user = ' + auctionData.idSeller;

              connection.query(sql, function (error, result) {
                if (error) {
                  throw error;
                } else {
                  callback(null, {"msg": "success"});
                }
              });
            }
          ],
          function (err, results) {
            var sql = 'SELECT coins, cant FROM users,inventory WHERE users.id = ' + connection.escape(auctionData.idBettor)
              + ' AND inventory.id_user = ' + connection.escape(auctionData.idBettor)
              + ' AND inventory.idItem = ' + connection.escape(auctionData.idItem);
            connection.query(sql, function (error, bettorRow) {
              if (error) {
                throw error;
              }
              else {
                async.series([
                    function (callback) {
                      var sql = 'UPDATE users SET coins = ' + connection.escape(bettorRow[0].coins - auctionData.winBid) +
                        ' WHERE id = ' + auctionData.idBettor;

                      connection.query(sql, function (error, result) {
                        if (error) {
                          throw error;
                        } else {
                          callback(null, {"msg": "success"});
                        }
                      });
                    },
                    function (callback) {
                      var sql = 'UPDATE inventory SET cant = ' + connection.escape(bettorRow[0].cant + auctionData.cant) +
                        ' WHERE idItem = ' + auctionData.idItem + ' AND id_user = ' + auctionData.idBettor;

                      connection.query(sql, function (error, result) {
                        if (error) {
                          throw error;
                        } else {
                          callback(null, {"msg": "success"});
                        }
                      });
                    }
                  ],
                  function (err, results) {

                    callback(null, true);

                  });
                console.log('sellerRow', sellerRow);

              }
            });

          });
        console.log('sellerRow', sellerRow);

      }
    });
  }
}

userModel.deleteUser = function(id, callback) {
  if(connection) {
    var sqlExists = 'SELECT * FROM users WHERE id = ' + connection.escape(id);
    connection.query(sqlExists, function(err, row) {
      //si existe la id del usuario a eliminar
      if(row) {
        var sql = 'DELETE FROM users WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, result) {
          if(error) {
            throw error;
          }
          else {
            callback(null,{"msg":"deleted"});
          }
        });
      }
      else {
        callback(null,{"msg":"notExist"});
      }
    });
  }
}

module.exports = userModel;
